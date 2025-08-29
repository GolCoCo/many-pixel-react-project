import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Progress } from '@components/Progress';
import { blue } from '@ant-design/colors';
import moment from 'moment';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { humanFileSize } from '@constants/utils';
import { IconFile } from '@components/IconFile';
import IconFeedbackFilled from '@components/Svg/IconFeedbackFilled';
import message from '@components/Message';
import downloadSingleFile from '@utils/downloadSingleFile';
import { DOWNLOAD_FILE } from '@graphql/mutations/file';
import { EllipsisMultiple } from '@components/EllipsisMultiple';
import IconFeedback from '@components/Svg/IconFeedback';
import WithLoggedUser from '@components/WithLoggedUser';
import { unreadCheck } from '../../utils/unreadCheck.js';
import downloadUrlWithProgressToBlob from '@utils/downloadUrlWithProgressToBlob';
import { saveAs } from 'file-saver';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from '@constants/routes';
import CloseIcon from '@components/Svg/Close';

export const CardRecentFile = WithLoggedUser(
    ({
        id,
        url,
        name,
        size,
        feedback,
        updatedAt,
        isDirectory,
        imageSize = '48',
        downloadIconSize = '16',
        downloadIcon,
        onClick,
        requestName,
        viewer,
        listType = 'card',
        requestId,
    }) => {
        const [isDownloadingFile, setIsDownloadingFile] = useState(false);
        const [downloadFile] = useMutation(DOWNLOAD_FILE);
        const [percent, setPercent] = useState(0);
        const [abrt, setAbrt] = useState(null);
        const link = isDirectory ? `${DETAIL_REQUEST.replace(':id', requestId)}?folder=${id}` : `${FEEDBACK_REQUEST.replace(':id', requestId)}?file=${id}`;
        useEffect(() => {
            if (percent === 100) {
                message.success('File has been downloaded');
                setAbrt(null);
                setPercent(0);
                setIsDownloadingFile(false);
            }
        }, [percent, setPercent]);

        const abort = useCallback(() => {
            if (abrt) {
                abrt();
            }
            setPercent(0);
            setIsDownloadingFile(false);
        }, [abrt]);

        const handleClickDownload = async ev => {
            ev.preventDefault();
            ev.stopPropagation();

            setIsDownloadingFile(true);
            if (!url.includes('.cloudfront.net')) {
                await downloadFile({ variables: { id } })
                    .then(({ data }) => {
                        downloadSingleFile(data?.downloadFile?.signedURL, name, requestName, 'file', setPercent, setAbrt);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsDownloadingFile(false);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on downloading file';
                        message.error(formErrorMessage);
                    });
            } else {
                try {
                    const downloadFile = await downloadUrlWithProgressToBlob(
                        url,
                        ({ received, total }) => {
                            setPercent((received / total) * 100);
                        },
                        setAbrt
                    );
                    saveAs(downloadFile, name);
                } catch (err) {
                    if (!err.name === 'AbortError') {
                        console.log(err);
                        message.destroy();
                        message.error(err);
                    }
                }
            }
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

        return (
            <a href={link} style={{ textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                <Box
                    $cursor="pointer"
                    $bg="bg-gray"
                    $p="14"
                    $h={listType === 'card' ? '170' : '64'}
                    $boxShadow="none"
                    $trans="0.2s all"
                    $userSelect="none"
                    $pos="relative"
                    $radii="10"
                    $textAlign="center"
                    _hover={{ $boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                    onClick={isDownloadingFile ? () => {} : onClick}
                >
                    {listType === 'card' && (
                        <Box $pos="absolute" $right="16" $top="12">
                            {isDownloadingFile ? (
                                <Box
                                    $fontSize={downloadIconSize}
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
                                <Box $fontSize={downloadIconSize} $colorScheme="tertiary" _hover={{ $colorScheme: 'cta' }} onClick={handleClickDownload}>
                                    {downloadIcon}
                                </Box>
                            )}
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
                                <Box $ml="16">
                                    {isDownloadingFile ? (
                                        <Box
                                            $fontSize={downloadIconSize}
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
                                        <Box $fontSize={downloadIconSize} $colorScheme="tertiary" _hover={{ $colorScheme: 'cta' }} onClick={handleClickDownload}>
                                            {downloadIcon}
                                        </Box>
                                    )}
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
                            </Box>
                        </>
                    )}
                    {percent > 0 && (
                        <Box>
                            <Progress size="small" strokeColor={blue[4]} percent={percent.toFixed(2)} showInfo={false} />
                        </Box>
                    )}
                </Box>
            </a>
        );
    }
);
