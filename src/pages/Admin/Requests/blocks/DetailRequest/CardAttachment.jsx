import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { humanFileSize } from '@constants/utils';
import { IconFile } from '@components/IconFile';
import IconCopy from '@components/Svg/IconCopy';
import message from '@components/Message';
import { Popup, PopupDelete } from '@components/Popup';
import IconShow from '@components/Svg/IconShow';
import IconHide from '@components/Svg/IconHide';
import { blue } from '@ant-design/colors';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import IconDownload from '@components/Svg/IconDownload';
import IconOptions from '@components/Svg/IconOptions';
import downloadSingleFile from '@utils/downloadSingleFile';
import { DOWNLOAD_FILE } from '@graphql/mutations/file';
import { DELETE_FOLDER, UPDATE_FOLDER_VISIBILITY } from '@graphql/mutations/folder';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import FormRenameFolder from './FormRenameFolder';
import downloadUrlWithProgressToBlob from '@utils/downloadUrlWithProgressToBlob';
import { saveAs } from 'file-saver';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from '@constants/routes';
import CloseIcon from '@components/Svg/Close';
import { Button } from '@components/Button';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import { Progress } from '@components/Progress';
import { APP_URL } from '@constants/general';

const variants = {
    P5: {
        textVariant: 'P5',
        $colorScheme: 'secondary',
    },
    mobile: {
        $colorScheme: 'secondary',
        $fontSize: '10',
        $fontWeight: '400',
        fontFamily: 'Geomanist',
        $lineH: '15',
    },
};

export const CardAttachment = ({
    id,
    url,
    name,
    size,
    updatedAt,
    files,
    isHidden,
    hover = true,
    isDirectory,
    textSizeVariant = 'mobile',
    imageIcon,
    imageSize = '32',
    paddingImage = '8',
    content,
    maxNW,
    onClick,
    h = '78',
    pl = '20',
    pr = '16',
    py = '20',
    requestName,
    _hover,
    bg = 'bg-gray',
    children,
    downloadIcon,
    refetchRequests,
    isDefaultFolder,
    orderId,
    listType = 'card',
    requestId,
    isBrief,
}) => {
    const [downloadFile] = useMutation(DOWNLOAD_FILE);
    const [deleteFolder] = useMutation(DELETE_FOLDER);
    const [updateFolderVisibility] = useMutation(UPDATE_FOLDER_VISIBILITY);
    const [showRenameFolderForm, setShowRenameFolderForm] = useState(false);
    const [showDeleteFolderPrompt, setShowDeleteFolderPrompt] = useState(false);
    const [isDeletingFolder, setIsDeletingFolder] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [abrt, setAbrt] = useState();
    const [signedURL, setSignedUrl] = useState(null);

    const [getSignedUrl] = useMutation(DOWNLOAD_FILE);

    useEffect(() => {
        const getUrlWithExpiration = async () => {
            const res = await getSignedUrl({
                variables: {
                    id,
                },
            });
            setSignedUrl(res.data.downloadFile.signedURL);
        };
        if (isBrief) {
            getUrlWithExpiration();
        }
    }, [id, isBrief, getSignedUrl]);

    const link = isDirectory ? `${DETAIL_REQUEST.replace(':id', requestId)}?folder=${id}` : `${FEEDBACK_REQUEST.replace(':id', requestId)}?file=${id}`;
    const handleZippingFiles = prcnt => {
        setProgress(prcnt);
        if (Math.ceil(prcnt) >= 100) {
            message.destroy();
            message.success('Folder has been downloaded');
            setProgress(0);
            setIsDownloading(false);
        }
    };

    const handleDownloadFile = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            message.destroy();
            message.success('File has been downloaded');
            setIsDownloading(false);
        }
    };

    const abort = useCallback(() => {
        if (abrt) {
            abrt();
        }
        setProgress(0);
        setIsDownloading(false);
    }, [abrt]);

    const handleClickDownload = async () => {
        if (isDirectory) {
            if (files?.length) {
                try {
                    message.destroy();
                    message.loading('Downloading folder...');
                    setIsDownloading(true);
                    const folderName = `${requestName}-${name}`;
                    downloadFilesAsZip(files, folderName, handleZippingFiles, setAbrt);
                } catch (err) {
                    if (!err.name === 'AbortError') {
                    }
                    setIsDownloading(false);
                }
            } else {
                message.destroy();
                message.error('Folder is empty');
            }
        } else {
            setIsDownloading(true);
            message.destroy();
            message.loading('Downloading file...', 1000);

            if (!url.includes('.cloudfront.net')) {
                await downloadFile({ variables: { id } })
                    .then(({ data }) => {
                        downloadSingleFile(data?.downloadFile?.signedURL, name, requestName, 'attachment', handleDownloadFile, setAbrt);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsDownloading(false);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on downloading file';
                        message.error(formErrorMessage);
                    });
            } else {
                try {
                    const downloadFile = await downloadUrlWithProgressToBlob(url, ({ received, total }) => handleDownloadFile((received / total) * 100), setAbrt);
                    saveAs(downloadFile, name);
                } catch (err) {
                    if (!err.name === 'AbortError') {
                        console.log(err);
                        message.destroy();
                        message.error(err);
                    }
                    setIsDownloading(false);
                }
            }
        }
    };

    const handleIconDownloadClick = ev => {
        ev.preventDefault();
        ev.stopPropagation();

        handleClickDownload();
    };

    const handleSuccessRename = async () => {
        message.destroy();
        message.success('Folder name has been updated');
        setShowRenameFolderForm(false);

        if (refetchRequests) {
            await refetchRequests();
        }
    };

    const handleShowRenameFolderForm = () => {
        setShowRenameFolderForm(true);
    };

    const handleDeleteFolder = () => {
        setShowDeleteFolderPrompt(true);
    };

    const handleDelete = async () => {
        message.destroy();
        message.loading(
            <>
                Deleting{' '}
                <Text $d="inline-block" $fontWeight="400">
                    {name}
                </Text>
                ...
            </>,
            50000
        );
        setIsDeletingFolder(true);

        await deleteFolder({ variables: { folderId: id } })
            .then(async () => {
                message.destroy();
                message.success('Folder has been deleted');
                await refetchRequests();
            })
            .catch(err => {
                console.log(err);
                message.destroy();
                message.error('Error on deleting folder');
            });
        setIsDeletingFolder(false);
        setShowDeleteFolderPrompt(false);
    };

    const handleVisibility = async () => {
        message.destroy();
        message.loading(isHidden ? 'Showing folder...' : 'Hiding folder...', 50000);
        await updateFolderVisibility({ variables: { id, visibility: !isHidden } })
            .then(async () => {
                message.destroy();
                message.success(isHidden ? 'This folder has been changed to visible' : 'This folder has been changed to hidden');
                await refetchRequests();
            })
            .catch(e => {
                console.log(e);
                message.destroy();
                message.error('Error on updating folder');
            });
    };

    const handleFolderLinkCopy = async () => {
        await navigator.clipboard.writeText(`${APP_URL}/requests/${orderId}?folder=${id}`);
        message.destroy();
        message.success('Folder link has been copied');
    };

    const hoverCss = _hover ?? {};

    const dropDownOverlay = !isDefaultFolder ? (
        <DropdownMenu $mt="-8" $w="164">
            <DropdownMenuItem key="download" onClick={handleClickDownload}>
                <DropdownMenuItemContent icon={<IconDownload />}>Download</DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem key="rename" onClick={handleShowRenameFolderForm}>
                <DropdownMenuItemContent icon={<IconEdit />}>Rename</DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem key="delete" onClick={handleDeleteFolder}>
                <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem key="visibility" onClick={handleVisibility}>
                <DropdownMenuItemContent icon={isHidden ? <IconShow /> : <IconHide />}>{isHidden ? 'Show' : 'Hide'}</DropdownMenuItemContent>
            </DropdownMenuItem>
            <DropdownMenuItem key="copy" onClick={handleFolderLinkCopy}>
                <DropdownMenuItemContent icon={<IconCopy />}>Copy Link</DropdownMenuItemContent>
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
            <a
                href={signedURL ? signedURL : link}
                style={{ textDecoration: 'none' }}
                onClick={
                    isDownloading
                        ? () => {}
                        : e => {
                              e.preventDefault();
                              if (signedURL) {
                                  window.open(signedURL, '_blank');
                              }
                          }
                }
            >
                <Box
                    $cursor="pointer"
                    $bg={bg}
                    $radii="10"
                    $trans="0.2s all"
                    $userSelect="none"
                    onClick={onClick}
                    _hover={hover ? { $boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', ...hoverCss } : {}}
                >
                    <Box $d="flex" $pr={pr} $py={py} $pl={pl} $alignItems="center" $flexWrap="nowrap" $boxShadow="none" $h={h}>
                        <Box $d="inline-flex" $alignItems="center">
                            {(url || isDirectory) && <IconFile size={imageSize} url={url} name={name} showPreviewImage isDirectory={isDirectory} />}
                            {imageIcon}
                        </Box>
                        {listType === 'list' && (
                            <Box $pl={paddingImage} $flex="1" $pr="20" $minW="0" $maxW={maxNW}>
                                <Text $textVariant="Badge" $colorScheme="primary" $isTruncate>
                                    {name}
                                </Text>
                            </Box>
                        )}
                        {listType === 'card' && (
                            <Box $pl={paddingImage} $flex="1" $pr="20" $minW="0" $maxW={maxNW}>
                                <Text $textVariant="Badge" $colorScheme="primary" $isTruncate>
                                    {name}
                                </Text>
                                <Box {...variants[textSizeVariant]} $d="flex" $alignItems="center">
                                    {typeof size !== 'undefined' && <>{size ? <Text>{humanFileSize(parseInt(size))}</Text> : '0 kb'}</>}
                                    {content && <Text>{content}</Text>}
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
                                {!hover && (
                                    <Box $py="4">
                                        <Button
                                            type="ghost"
                                            $textTransform="none"
                                            $colorScheme="cta"
                                            $px="0"
                                            $fontSize="12"
                                            $h={['16', '16']}
                                            icon={
                                                <Box $lineH="1" $fontSize="14">
                                                    {isDownloading ? (
                                                        <Icon component={LoadingOutlined} style={{ fontSize: 14, color: '#0099F6' }} />
                                                    ) : (
                                                        <IconDownloadAlt />
                                                    )}
                                                </Box>
                                            }
                                            onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleClickDownload();
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                        {listType === 'list' && (
                            <Box $pl={paddingImage} $pr="20" $minW="0" $d="flex" $flexDir="row" $alignItems="center">
                                <Box {...variants[textSizeVariant]} $d="flex" $alignItems="center">
                                    {size && <Text>{humanFileSize(parseInt(size))}</Text>}
                                    {content && (
                                        <>
                                            <Box $w="1" $h="12" $bg="secondary" $mx="4" />
                                            <Text>{content}</Text>
                                        </>
                                    )}
                                    {updatedAt && (
                                        <>
                                            <Box $w="1" $h="12" $bg="secondary" $mx="4" />
                                            <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        )}
                        {!isDirectory ? (
                            <Box $ml="auto" $alignSelf="center">
                                {isDownloading ? (
                                    <Box
                                        $fontSize="16"
                                        $colorScheme="tertiary"
                                        _hover={{ $colorScheme: 'cta' }}
                                        onClick={e => {
                                            e.preventDefault();
                                            abort();
                                        }}
                                    >
                                        <CloseIcon />
                                    </Box>
                                ) : (
                                    <Box $fontSize="16" $colorScheme="tertiary" _hover={{ $colorScheme: 'cta' }} onClick={handleIconDownloadClick}>
                                        {downloadIcon}
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box $ml="auto" $alignSelf="center" $h="20" $overflow="hidden" onClick={ev => ev.stopPropagation()}>
                                {isDownloading ? (
                                    <Box
                                        $fontSize="16"
                                        $colorScheme="tertiary"
                                        _hover={{ $colorScheme: 'cta' }}
                                        onClick={e => {
                                            e.preventDefault();
                                            abort();
                                        }}
                                    >
                                        <CloseIcon />
                                    </Box>
                                ) : (
                                    hover && (
                                        <Dropdown trigger={['click']} overlay={dropDownOverlay}>
                                            <Box $colorScheme="cta" className="ant-dropdown-link">
                                                <IconOptions style={{ fontSize: 20 }} />
                                            </Box>
                                        </Dropdown>
                                    )
                                )}
                            </Box>
                        )}
                    </Box>
                    {children}
                    <Box $d="flex" $pr={pr} $pl={pl} $alignItems="center" $flexWrap="nowrap" $boxShadow="none">
                        {progress > 0 && <Progress showInfo={false} size="small" strokeColor={blue[4]} percent={progress} />}
                    </Box>
                </Box>
            </a>
            <Popup
                open={showRenameFolderForm}
                $variant="default"
                centered
                destroyOnClose
                title="Rename folder"
                footer={null}
                width={420}
                onCancel={() => setShowRenameFolderForm(false)}
            >
                <FormRenameFolder folderId={id} folderName={name} onSuccessSubmit={handleSuccessRename} />
            </Popup>
            <PopupDelete
                title="Are you sure you want to delete this folder?"
                $variant="delete"
                open={showDeleteFolderPrompt}
                onOk={handleDelete}
                onCancel={() => setShowDeleteFolderPrompt(false)}
                confirmLoading={isDeletingFolder}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </>
    );
};
