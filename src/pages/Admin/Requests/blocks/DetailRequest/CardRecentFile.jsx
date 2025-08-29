import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Dropdown } from 'antd';
import { blue } from '@ant-design/colors';
import moment from 'moment';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { humanFileSize } from '@constants/utils';
import { IconFile } from '@components/IconFile';
import IconFeedbackFilled from '@components/Svg/IconFeedbackFilled';
import message from '@components/Message';
import { EllipsisMultiple } from '@components/EllipsisMultiple';
import { Popup, PopupDelete } from '@components/Popup';
import IconShow from '@components/Svg/IconShow';
import IconHide from '@components/Svg/IconHide';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import IconDownload from '@components/Svg/IconDownload';
import IconOptions from '@components/Svg/IconOptions';
import IconFeedback from '@components/Svg/IconFeedback';
import WithLoggedUser from '@components/WithLoggedUser';
import downloadSingleFile from '@utils/downloadSingleFile';
import { DOWNLOAD_FILE, DELETE_FILE, UPDATE_FILE_VISIBILITY } from '@graphql/mutations/file';
import { unreadCheck } from '../../utils/unreadCheck.js';
import FormRenameUpload from './FormRenameUpload.jsx';
import downloadUrlWithProgressToBlob from '@utils/downloadUrlWithProgressToBlob';
import { saveAs } from 'file-saver';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from '@constants/routes';
import { Progress } from '@components/Progress';

export const CardRecentFile = WithLoggedUser(
    ({
        id,
        url,
        name,
        size,
        feedback,
        updatedAt,
        isHidden,
        isDirectory,
        imageSize = '48',
        onClick,
        requestName,
        viewer,
        refetchRequests,
        isDefaultFolder,
        isUploading,
        uploadProgress,
        listType = 'card',
        requestId,
    }) => {
        const [downloadFile] = useMutation(DOWNLOAD_FILE);
        const [deleteFile] = useMutation(DELETE_FILE);
        const [updateFileVisibility] = useMutation(UPDATE_FILE_VISIBILITY);
        const [renamable, setRenamable] = useState(null);
        const [deletable, setDeletable] = useState(null);
        const [isDeletingFile, setIsDeletingFile] = useState(false);
        const [percent, setPercent] = useState(0);

        const link = isDirectory ? `${DETAIL_REQUEST.replace(':id', requestId)}?folder=${id}` : `${FEEDBACK_REQUEST.replace(':id', requestId)}?file=${id}`;

        useEffect(() => {
            if (percent === 100) {
                message.destroy();
                message.success('File has been downloaded');
                setTimeout(() => {
                    setPercent(0);
                }, 1500);
            }
        }, [percent, setPercent]);

        const handleClickDownload = async () => {
            message.destroy();
            message.loading('Downloading file...', 50000);
            if (!url.includes('.cloudfront.net')) {
                await downloadFile({ variables: { id } })
                    .then(({ data }) => {
                        downloadSingleFile(data?.downloadFile?.signedURL, name, requestName, 'file', setPercent);
                    })
                    .catch(err => {
                        console.log(err);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on downloading file';
                        message.error(formErrorMessage);
                    });
            } else {
                try {
                    const downloadFile = await downloadUrlWithProgressToBlob(url, ({ received, total }) => {
                        setPercent((received / total) * 100);
                    });
                    saveAs(downloadFile, name);
                } catch (err) {
                    console.log(err);
                    message.destroy();
                    message.error(err);
                }
            }
        };

        const handleRenameFile = () => {
            setRenamable({ id, name });
        };

        const handleSuccessRename = async () => {
            message.destroy();
            message.success('File name has been updated');
            setRenamable(null);
            await refetchRequests();
        };

        const handleDeleteFile = () => {
            setDeletable({ id, name });
        };

        const handleDelete = async () => {
            message.destroy();
            message.loading(
                <>
                    Deleting{' '}
                    <Text $d="inline-block" $fontWeight="400">
                        {deletable.name}
                    </Text>
                    ...
                </>,
                50000
            );
            setIsDeletingFile(true);

            await deleteFile({ variables: { id: deletable.id } })
                .then(async () => {
                    message.destroy();
                    message.success('File has been deleted');
                    await refetchRequests();
                })
                .catch(err => {
                    console.log(err);
                    message.destroy();
                    message.error('Error on deleting file');
                });
            setIsDeletingFile(false);
            setDeletable(null);
        };

        const handleVisibility = async () => {
            message.destroy();
            message.loading(isHidden ? 'Showing file...' : 'Hiding file...', 50000);
            await updateFileVisibility({ variables: { id, visibility: !isHidden } })
                .then(async () => {
                    message.destroy();
                    message.success(isHidden ? 'This file has been changed to visible' : 'This file has been changed to hidden');
                    await refetchRequests();
                })
                .catch(e => {
                    console.log(e);
                    message.destroy();
                    message.error('Error on updating file');
                });
        };

        const totalFeedback = feedback?.length ?? 0;
        const unreadComments = Array.isArray(feedback)
            ? feedback
                  ?.map(feed => {
                      const unreadDetailsComments = feed.comments?.filter(comment => unreadCheck(comment, viewer));
                      const unreadCommentCount = unreadDetailsComments?.length ?? 0;
                      const unreadFeedbackCount = unreadCheck(feed, viewer) ? 1 : 0;

                      return unreadCommentCount + unreadFeedbackCount;
                  })
                  .reduce((prev, item) => prev + item, 0)
            : 0;

        const dropDownOverlay = !isDefaultFolder ? (
            <DropdownMenu $mt="-8" $w="164">
                <DropdownMenuItem key="download" onClick={handleClickDownload}>
                    <DropdownMenuItemContent icon={<IconDownload />}>Download</DropdownMenuItemContent>
                </DropdownMenuItem>
                <DropdownMenuItem key="rename" onClick={handleRenameFile}>
                    <DropdownMenuItemContent icon={<IconEdit />}>Rename</DropdownMenuItemContent>
                </DropdownMenuItem>
                <DropdownMenuItem key="delete" onClick={handleDeleteFile}>
                    <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                </DropdownMenuItem>
                <DropdownMenuItem key="visibility" onClick={handleVisibility}>
                    <DropdownMenuItemContent icon={isHidden ? <IconShow /> : <IconHide />}>{isHidden ? 'Show' : 'Hide'}</DropdownMenuItemContent>
                </DropdownMenuItem>
            </DropdownMenu>
        ) : (
            <DropdownMenu $mt="-8" $w="164">
                <DropdownMenuItem key="download" onClick={handleClickDownload}>
                    <DropdownMenuItemContent icon={<IconDownload />}>Download</DropdownMenuItemContent>
                </DropdownMenuItem>
            </DropdownMenu>
        );

        return (
            <>
                <a href={link} style={{ textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                    <Box
                        $cursor="pointer"
                        $bg="bg-gray"
                        $p="14"
                        $radii="10"
                        $h={listType === 'card' ? '170' : '64'}
                        $boxShadow="none"
                        $trans="0.2s all"
                        $userSelect="none"
                        $pos="relative"
                        $textAlign="center"
                        _hover={{ $boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                        onClick={onClick}
                    >
                        {!isUploading && listType === 'card' && (
                            <Box $pos="absolute" $right="16" $top="12" onClick={ev => ev.stopPropagation()}>
                                <Dropdown trigger={['click']} overlay={dropDownOverlay}>
                                    <Box $colorScheme="cta" className="ant-dropdown-link">
                                        <IconOptions style={{ fontSize: 20 }} />
                                    </Box>
                                </Dropdown>
                            </Box>
                        )}

                        {totalFeedback > 0 && listType === 'card' && (
                            <Box $pos="absolute" $left="16" $top="12">
                                <Box $d="flex" $alignItems="center">
                                    <Box $fontSize="16" $h="20" $colorScheme={unreadComments > 0 ? 'other-pink' : 'secondary'}>
                                        {unreadComments > 0 ? <IconFeedbackFilled /> : <IconFeedback />}
                                    </Box>
                                    <Text $pl="4" $textVariant="P5">
                                        {totalFeedback}
                                    </Text>
                                </Box>
                            </Box>
                        )}
                        <Box
                            $h={listType === 'list' ? '100%' : undefined}
                            $d={listType === 'card' ? 'inline-flex' : 'flex'}
                            $alignItems="center"
                            $mb={listType === 'card' ? '10' : undefined}
                            $mt={listType === 'card' ? '12' : undefined}
                            $justifyContent="space-between"
                        >
                            <Box $d="flex" $alignItems="center">
                                <IconFile size={imageSize} url={url} name={name} showPreviewImage isDirectory={isDirectory} />
                                {listType === 'list' && (
                                    <Text $textVariant="Badge" $colorScheme="primary" $isTruncate $ml="10">
                                        {name}
                                    </Text>
                                )}
                            </Box>
                            {listType === 'list' && (
                                <Box $d="flex" $alignItems="center" $w="30%">
                                    {totalFeedback > 0 && (
                                        <Box $d="flex" $alignItems="center">
                                            <Box $fontSize="16" $h="20" $colorScheme={unreadComments > 0 ? 'other-pink' : 'secondary'}>
                                                {unreadComments > 0 ? <IconFeedbackFilled /> : <IconFeedback />}
                                            </Box>
                                            <Text $pl="4" $textVariant="P5">
                                                {totalFeedback}
                                            </Text>
                                        </Box>
                                    )}
                                    <Box $textVariant="P5" $colorScheme="secondary" $d="flex" $alignItems="center" $justifyContent="flex-end" $ml="auto">
                                        <Text>{humanFileSize(size)}</Text>
                                        {updatedAt && (
                                            <>
                                                <Box $w="1" $h="12" $bg="secondary" $mx="4" />
                                                <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                                            </>
                                        )}
                                    </Box>
                                    <Box onClick={ev => ev.stopPropagation()} $ml="16">
                                        <Dropdown trigger={['click']} overlay={dropDownOverlay}>
                                            <Box $colorScheme="cta" className="ant-dropdown-link">
                                                <IconOptions style={{ fontSize: 20 }} />
                                            </Box>
                                        </Dropdown>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                        {listType === 'card' && (
                            <>
                                <EllipsisMultiple $textVariant="Badge" $colorScheme="primary" $maxW="80%" $textAlign="center" $mx="auto" $mb="4" line={2}>
                                    {name}
                                </EllipsisMultiple>
                                <Box $textVariant="P5" $colorScheme="secondary" $d="flex" $alignItems="center" $justifyContent="center" $mx="auto">
                                    <Text>{humanFileSize(size)}</Text>
                                    {updatedAt && (
                                        <>
                                            <Box $w="1" $h="12" $bg="secondary" $mx="4" />
                                            <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                                        </>
                                    )}
                                    {isHidden && (
                                        <>
                                            <Box $w="1" $h="12" $bg="secondary" $mx="4" />
                                            <IconHide style={{ width: 16, height: 16 }} />
                                        </>
                                    )}
                                </Box>
                            </>
                        )}
                        {(percent > 0 || uploadProgress > 0) && (
                            <Box>
                                <Progress
                                    size="small"
                                    strokeColor={blue[4]}
                                    percent={percent ? percent.toFixed(2) : uploadProgress.toFixed(2)}
                                    showInfo={false}
                                />
                            </Box>
                        )}
                    </Box>
                </a>
                <Popup
                    open={renamable !== null}
                    $variant="default"
                    centered
                    destroyOnClose
                    title="Rename file"
                    footer={null}
                    width={420}
                    onCancel={() => setRenamable(null)}
                >
                    <FormRenameUpload initialValues={{ ...renamable }} onSuccessSubmit={handleSuccessRename} />
                </Popup>
                <PopupDelete
                    title="Are you sure you want to delete this file?"
                    $variant="delete"
                    open={deletable !== null}
                    onOk={handleDelete}
                    onCancel={() => setDeletable(null)}
                    confirmLoading={isDeletingFile}
                >
                    <Text $textVariant="P4" $colorScheme="secondary">
                        This action cannot be undone
                    </Text>
                </PopupDelete>
            </>
        );
    }
);
