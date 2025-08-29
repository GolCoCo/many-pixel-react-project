import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { humanFileSize } from '@constants/utils';
import { IconFile } from '@components/IconFile';
import message from '@components/Message';
import downloadSingleFile from '@utils/downloadSingleFile';
import { DOWNLOAD_FILE } from '@graphql/mutations/file';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import downloadUrlWithProgressToBlob from '@utils/downloadUrlWithProgressToBlob';
import { saveAs } from 'file-saver';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from '@constants/routes';
import { blue } from '@ant-design/colors';
import CloseIcon from '@components/Svg/Close';
import { Progress } from '@components/Progress';

const variants = {
    P5: {
        $textVariant: 'P5',
        $colorScheme: 'secondary',
    },
    mobile: {
        $colorScheme: 'secondary',
        fontSize: '10',
        fontWeight: '400',
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
    isDirectory,
    textSizeVariant = 'mobile',
    imageIcon,
    imageSize = '32',
    paddingImage = '8',
    downloadIconSize = '16',
    downloadIcon,
    content,
    onClick,
    h = '78',
    pl = '20',
    pr = '16',
    py = '20',
    requestName,
    canDownload,
    _hover,
    bg = 'bg-gray',
    children,
    listType = 'card',
    requestId,
    isBrief,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadFile] = useMutation(DOWNLOAD_FILE);
    const [percent, setPercent] = useState(0);
    const [abrt, setAbort] = useState(() => {});

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
        setPercent(prcnt);
        if (Math.ceil(prcnt) >= 100) {
            setPercent(0);
            setIsDownloading(false);
            setAbort(null);
        }
    };
    const abort = useCallback(() => {
        if (abrt) {
            abrt();
        }
        setPercent(0);
        setIsDownloading(false);
    }, [abrt]);

    const handleClickDownload = async ev => {
        ev.preventDefault();
        ev.stopPropagation();

        if (isDirectory) {
            const filteredFiles = files?.filter(file => !file.isHidden);
            if (filteredFiles?.length) {
                setIsDownloading(true);
                const folderName = `${requestName}-${name}`;
                downloadFilesAsZip(filteredFiles, folderName, handleZippingFiles, setAbort);
            } else {
                message.destroy();
                message.error('Folder is empty');
            }
        } else {
            setIsDownloading(true);
            if (!url.includes('.cloudfront.net')) {
                await downloadFile({ variables: { id } })
                    .then(({ data }) => {
                        downloadSingleFile(data?.downloadFile?.signedURL, name, requestName, 'attachment', handleZippingFiles, setAbort);
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
                    const downloadFile = await downloadUrlWithProgressToBlob(
                        url,
                        ({ received, total }) => handleZippingFiles((received / total) * 100),
                        setAbort
                    );

                    saveAs(downloadFile, name);
                    setIsDownloading(false);
                    message.destroy();
                    message.success('File has been downloaded');
                } catch (err) {
                    if (!err.name === 'AbortError') {
                        setIsDownloading(false);
                        console.log(err);
                        message.destroy();
                        message.error(err);
                    }
                }
            }
        }
    };

    const hoverCss = _hover ?? {};

    return (
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
                $radii="10"
                $bg={bg}
                $trans="0.2s all"
                $userSelect="none"
                _hover={{ $boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', ...hoverCss }}
                onClick={isDownloading ? () => {} : onClick}
            >
                <Box $d="flex" $pr={pr} $py={py} $pl={pl} $alignItems="center" $flexWrap="nowrap" $boxShadow="none" $h={h}>
                    <Box $d="inline-flex" $alignItems="center">
                        {(url || isDirectory) && <IconFile size={imageSize} url={url} name={name} showPreviewImage isDirectory={isDirectory} />}
                        {imageIcon}
                    </Box>
                    {listType === 'list' && (
                        <Box $pl={paddingImage} $flex="1" $pr="20" $minW="0">
                            <Text $textVariant="Badge" $colorScheme="primary" $isTruncate>
                                {name}
                            </Text>
                        </Box>
                    )}
                    {listType === 'card' && (
                        <Box $pl={paddingImage} $flex="1" $pr="20" $minW="0">
                            <Text $textVariant="Badge" $colorScheme="primary" $isTruncate>
                                {name}
                            </Text>
                            <Box {...variants[textSizeVariant]} $d="flex" $alignItems="center">
                                {size && <Text>{humanFileSize(parseInt(size))}</Text>}
                                {content && <Text>{content}</Text>}
                                {updatedAt && (
                                    <>
                                        <Box $w="1" $h="1parseInt2" $bg="secondary" $mx="4" />
                                        <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}

                    <Box $ml="auto" $alignSelf="center" $d="flex" $flexDir="row">
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
                        {isDownloading ? (
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
                            <Box
                                $fontSize={downloadIconSize}
                                $colorScheme="tertiary"
                                _hover={{ $colorScheme: 'cta' }}
                                onClick={canDownload ? handleClickDownload : () => {}}
                            >
                                {downloadIcon}
                            </Box>
                        )}
                    </Box>
                </Box>
                {children}

                {isDownloading && (
                    <div style={{ width: '100%', marginTop: '-24px', padding: '0 24px 10px' }}>
                        <Progress size="small" strokeColor={blue[4]} percent={23} showInfo={false} />
                    </div>
                )}
            </Box>
        </a>
    );
};
