import React, { useMemo, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import { Box } from '@components/Box';
import IconAttach from '@components/Svg/IconAttach';
import { Portal } from '@components/Portal';
import { Text } from '@components/Text';
import { Popup } from '@components/Popup';
import { withResponsive } from '@components/ResponsiveProvider';
import UploadIcon from '@components/Svg/Upload';
import CheckIcon from '@components/Svg/Check';
import CloseIcon from '@components/Svg/Close';
import IconPreloader from '@components/Svg/IconPreloader';
import IconUploadRequest from '@components/Svg/IconUploadRequest';
import message from '@components/Message';
import { uploadToR2 } from '@utils/uploadToR2';
import { SAVE_FILE } from '@graphql/mutations/file';
import { useWysiwygContext } from '../WysiwygContext';

const initialState = {
    isPopupVisible: false,
    isEntering: false,
    attachments: [],
    uploadedFileIds: [],
};

const ACTION_TYPE = {
    FILE_ENTER: 'FILE_ENTER',
    FILE_LEAVE: 'FILE_LEAVE',
    POPUP_VISIBLE: 'POPUP_VISIBLE',
    POPUP_HIDE: 'POPUP_HIDE',
    ADDED_ATTACHMENTS: 'ADDED_ATTACHMENTS',
    REMOVE_ATTACHMENT: 'REMOVE_ATTACHMENT',
    UPLOAD_ATTACHMENT: 'UPLOAD_ATTACHMENT',
    UPLOADING_ATTACHMENT: 'UPLOADING_ATTACHMENT',
    RESET_ATTACHMENT: 'RESET_ATTACHMENT',
    RESET_UPLOADED: 'RESET_UPLOADED',
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPE.FILE_ENTER:
            return { ...state, isEntering: true };
        case ACTION_TYPE.FILE_LEAVE:
            return { ...state, isEntering: false };
        case ACTION_TYPE.POPUP_VISIBLE:
            return { ...state, isPopupVisible: true };
        case ACTION_TYPE.POPUP_HIDE:
            return { ...state, isPopupVisible: false };
        case ACTION_TYPE.ADDED_ATTACHMENTS:
            return {
                ...state,
                attachments: [
                    ...state.attachments,
                    ...action.attachments.map(file => ({
                        file,
                        name: file.name,
                        isUploaded: false,
                        isUploading: false,
                        isError: false,
                        fileId: null,
                    })),
                ],
                isEntering: false,
                isPopupVisible: false,
            };
        case ACTION_TYPE.REMOVE_ATTACHMENT:
            return {
                ...state,
                attachments: state.attachments.filter((attachment, attachmentIndex) =>
                    action.fileId !== null ? attachment.fileId !== action.fileId : attachmentIndex !== action.index
                ),
                uploadedFileIds: state.uploadedFileIds.filter((uploadedFileId, uploadedIndex) =>
                    action.fileId !== null ? uploadedFileId !== action.fileId : uploadedIndex !== action.index
                ),
            };
        case ACTION_TYPE.UPLOAD_ATTACHMENT:
            return {
                ...state,
                attachments: state.attachments.map((attachment, index) =>
                    index === action.index ? { ...attachment, isUploading: false, isUploaded: true, fileId: action.fileId } : attachment
                ),
                uploadedFileIds: [...state.uploadedFileIds, action.fileId],
            };
        case ACTION_TYPE.UPLOADING_ATTACHMENT:
            return {
                ...state,
                attachments: state.attachments.map((attachment, index) => (index === action.index ? { ...attachment, isUploading: true } : attachment)),
            };
        case ACTION_TYPE.RESET_ATTACHMENT:
            return {
                ...state,
                ...initialState,
            };
        case ACTION_TYPE.RESET_UPLOADED:
            return {
                ...state,
                uploadedFileIds: [],
            };
        default:
            break;
    }
};

const defaultIconUpload = (
    <Box $mb="24">
        <IconUploadRequest />
    </Box>
);

const ShadowDrop = ({ onDrop, uploadingActiveBar }) => {
    const [isEntering, setEntering] = useState(false);
    const [filesExist, setFilesExist] = useState(false);

    const handleDrop = useCallback(
        values => {
            setEntering(false);
            setFilesExist(values.length > 0);
            onDrop(values);
        },
        [onDrop]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple: true,
    });

    useEffect(() => {
        let dragging = false;
        let timeout = null;

        const handleDragEnter = ev => {
            const adminMessage = document.querySelector('#admin-message-tab-switcher');
            if (adminMessage && dragging) {
                adminMessage.style.borderRadius = '0';
            }

            dragging = true;
            if (ev.dataTransfer) {
                setEntering(true);
            }
        };
        const handleDropOnBody = ev => {
            const adminMessage = document.querySelector('#admin-message-tab-switcher');
            if (adminMessage && dragging && !filesExist) {
                adminMessage.style.borderRadius = '10px 10px 0 0';
            }
            dragging = false;
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                if (!dragging) {
                    setEntering(false);
                }
            }, 200);
        };

        const body = document.body;

        // body.addEventListener('dragenter', handleDragEnter);
        body.addEventListener('dragover', handleDragEnter);
        body.addEventListener('drop', handleDropOnBody);
        body.addEventListener('dragleave', handleDropOnBody);

        return () => {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
            // body.removeEventListener('dragenter', handleDragEnter);
            body.removeEventListener('dragover', handleDragEnter);
            body.removeEventListener('dragleave', handleDropOnBody);
            body.removeEventListener('drop', handleDropOnBody);
        };
    }, []);
    return (
        <Box
            {...getRootProps({
                style: {
                    height: isEntering ? 110 : 0,
                    minHeight: isEntering ? 110 : 0,
                    borderTopWidth: isEntering ? 1 : 0,
                },
            })}
            $bg={isEntering ? 'rgba(0, 153, 246, 0.4)' : 'white'}
            $borderW="1"
            $borderB="0"
            $borderStyle="solid"
            $radii="10px 10px 0 0"
            $borderColor={isEntering ? 'cta' : 'outline-gray'}
            $overflow="hidden"
            $trans="all 0.2s"
        >
            <input {...getInputProps()} />
            <Box $d="flex" $alignItems="center" $justifyContent="center" $h="100%">
                <Text $textVariant="P4" $colorScheme="primary">
                    Drop your file here to upload
                </Text>
            </Box>
        </Box>
    );
};

const AttachmentPlugin = withResponsive(
    ({
        windowWidth,
        iconUpload = defaultIconUpload,
        onSetFileIds,
        onRemoveFileId,
        onResetSentStatus,
        hasSent,
        enableShadowDrop,
        onUploadingFiles,
        onBlurEditor,
    }) => {
        const [state, dispatch] = useReducer(reducer, initialState);
        const { attachments, isPopupVisible, isEntering, uploadedFileIds } = state;
        const { getContainerDiv } = useWysiwygContext();
        const [saveFile] = useMutation(SAVE_FILE);
        const uploadingActiveBar = useRef(null);
        useEffect(() => {
            const startUpload = async () => {
                let pendingAttachment = null;
                let pendingIndex = -1;
                for (let i = 0; i < attachments.length; i += 1) {
                    if (!attachments[i].isUploaded && !attachments[i].isUploading) {
                        pendingAttachment = attachments[i];
                        pendingIndex = i;
                        break;
                    }
                }

                if (pendingAttachment) {
                    dispatch({
                        type: ACTION_TYPE.UPLOADING_ATTACHMENT,
                        index: pendingIndex,
                    });
                    const uploadedFile = await uploadToR2(pendingAttachment.file, () => {});
                    if (uploadedFile) {
                        const variables = {
                            name: pendingAttachment.file.name,
                            size: pendingAttachment.file.size,
                            type: pendingAttachment.file.type,
                            secret: uploadedFile,
                        };
                        await saveFile({ variables })
                            .then(({ data }) => {
                                dispatch({
                                    type: ACTION_TYPE.UPLOAD_ATTACHMENT,
                                    index: pendingIndex,
                                    fileId: data?.saveFile?.id,
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                message.destroy();
                                message.error('Error on uploading file(s)');
                            });
                    }
                }
            };

            startUpload();
            const adminMessage = document.querySelector('#admin-message-tab-switcher');
            if (adminMessage) {
                if (attachments && attachments.length > 0) {
                    adminMessage.style.borderRadius = 0;
                    if (uploadingActiveBar.current) {
                        uploadingActiveBar.current.setAttribute('style', 'border-radius: 10px 10px 0 0;border: 1px solid #ccc; border-bottom-width: 0; ');
                    }
                } else {
                    adminMessage.style.borderRadius = '10px 10px 0 0';
                    if (uploadingActiveBar.current) {
                        uploadingActiveBar.current.setAttribute('style', 'border-radius: 10px 10px 0 0;border: 0px solid #ccc; border-bottom-width: 0; ');
                    }
                }
            }
        }, [attachments, saveFile]);

        useEffect(() => {
            if (hasSent) {
                dispatch({ type: ACTION_TYPE.RESET_ATTACHMENT });
                if (onResetSentStatus) {
                    onResetSentStatus();
                }
            }
        }, [onResetSentStatus, hasSent]);

        const onDrop = (...dropProps) => {
            const acceptedFiles = dropProps[0];
            dispatch({ type: ACTION_TYPE.ADDED_ATTACHMENTS, attachments: acceptedFiles });
        };

        const onDragEnter = () => {
            dispatch({ type: ACTION_TYPE.FILE_ENTER });
        };

        const onDragLeave = () => {
            dispatch({ type: ACTION_TYPE.FILE_LEAVE });
        };

        const { getRootProps, getInputProps } = useDropzone({ onDrop, onDragEnter, onDragLeave, multiple: true });

        const handleOpenPopup = () => {
            dispatch({ type: ACTION_TYPE.POPUP_VISIBLE });
            if (onBlurEditor) {
                onBlurEditor();
            }
        };

        const handleClosePopup = () => {
            dispatch({ type: ACTION_TYPE.POPUP_HIDE });
            if (onBlurEditor) {
                onBlurEditor();
            }
        };

        const handleDeleteAttachment = (fileId, index) => {
            if (onRemoveFileId) {
                onRemoveFileId(fileId, index);
            }
            dispatch({ type: ACTION_TYPE.REMOVE_ATTACHMENT, fileId, index });
        };

        const [isUploading, uploadPercentage] = useMemo(() => {
            let _isUploading = false;
            let _uploadedCount = 0;

            for (let i = 0; i < attachments.length; i += 1) {
                const attachment = attachments[i];
                if (!attachment.isUploaded) {
                    _isUploading = true;
                } else {
                    _uploadedCount += 1;
                }
            }

            if (onUploadingFiles && attachments.length) {
                onUploadingFiles(_isUploading);
            }

            if (attachments?.length && attachments?.length === uploadedFileIds?.length && onSetFileIds) {
                onSetFileIds(uploadedFileIds);
            }

            const _uploadedPercentage = Math.ceil((_uploadedCount * 100) / attachments.length);

            return [_isUploading, `${_uploadedPercentage}%`];
        }, [attachments, onUploadingFiles, onSetFileIds, uploadedFileIds]);

        return (
            <>
                <Box
                    as="button"
                    type="button"
                    $outline="0"
                    $appearance="none"
                    $borderW="0"
                    $cursor="pointer"
                    $d="inline-flex"
                    $alignItems="center"
                    $fontSize="20"
                    $bg="transparent"
                    $px="0"
                    _hover={{ $colorScheme: 'cta' }}
                    onClick={handleOpenPopup}
                >
                    <IconAttach />
                </Box>
                <Popup
                    open={isPopupVisible}
                    onCancel={handleClosePopup}
                    $variant="default"
                    footer={null}
                    centered
                    width={windowWidth > 768 ? 900 : '100%'}
                    destroyOnClose
                >
                    <Text $textVariant="H4" $py="20" $textAlign="center">
                        Upload File
                    </Text>
                    <Box
                        $h="484"
                        $borderW="1"
                        $radii="10"
                        $borderStyle="dashed"
                        $borderColor="outline-gray"
                        data-active={isEntering ? 'true' : undefined}
                        $bg="white"
                        _active={{ $bg: 'rgba(0, 153, 246, 0.4)' }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <Box $d="flex" $flexDir="column" $alignItems="center" $justifyContent="center" $textAlign="center" $h="100%">
                            {iconUpload}
                            <Text $textVariant="badge" $colorScheme="cta" $d="flex" $gap="8px" $alignItems="center">
                                <UploadIcon /> Upload File
                            </Text>
                            <Text $d={['none', 'block']} $textVariant="P4" $colorScheme="primary">
                                or
                            </Text>
                            <Text $d={['none', 'block']} $textVariant="P4" $colorScheme="primary">
                                Drag and drop your files here
                            </Text>
                        </Box>
                    </Box>
                </Popup>
                <Portal container={getContainerDiv()}>
                    {enableShadowDrop && <ShadowDrop onDrop={onDrop} uploadingActiveBar={uploadingActiveBar} />}
                    <Box
                        $bg="bg-gray"
                        $borderB="0"
                        $borderStyle="solid"
                        $borderColor="transparent"
                        style={{ border: '0 solid #ccc', borderBottomWidth: '0' }}
                        data-active={attachments.length > 0 ? 'true' : undefined}
                        _active={{ $borderColor: 'outline-gray' }}
                        ref={uploadingActiveBar}
                    >
                        {isUploading && (
                            <>
                                <Box $d="flex" $alignItems="center" $px="10" $pt="10" $pb="6">
                                    <Box
                                        $fontSize="16"
                                        $colorScheme="cta"
                                        $w="20"
                                        $h="20"
                                        $d="inline-flex"
                                        $alignItems="center"
                                        $justifyContent="center"
                                        $lineH="1"
                                    >
                                        <Icon component={IconPreloader} spin />
                                    </Box>
                                    <Text $pl="10" $textVariant="P4" $colorScheme="primary">
                                        Uploading: {uploadPercentage}
                                    </Text>
                                </Box>
                                <Box $w="100%" $h="4" $pos="relative">
                                    <Box $h="1" $bg="outline-gray" />
                                    <Box
                                        $h="4"
                                        $bg="cta"
                                        style={{
                                            width: uploadPercentage,
                                        }}
                                        $pos="absolute"
                                        $trans="0.2s all"
                                        $top="-2px"
                                        $radii="2px"
                                    />
                                </Box>
                            </>
                        )}
                        {attachments.length > 0 && (
                            <Box $py="9">
                                {attachments.map((attachment, index) => (
                                    <Box key={index} $d="flex" $alignItems="center" $px="10" $py="5">
                                        <Box
                                            $fontSize="16"
                                            $colorScheme="cta"
                                            $w="20"
                                            $h="20"
                                            $d="inline-flex"
                                            $alignItems="center"
                                            $justifyContent="center"
                                            $lineH="1"
                                        >
                                            {attachment.isUploaded ? <CheckIcon /> : <Icon component={IconPreloader} spin />}
                                        </Box>
                                        <Box $pl="10" $flex="1" $minW="0">
                                            <Text $isTruncate line={1} $textVariant="P4" $colorScheme="secondary">
                                                {attachment.name}
                                            </Text>
                                        </Box>
                                        <Box $ml="auto" $h="14">
                                            <Tooltip color="white" trigger="hover" title="Remove item">
                                                <Box
                                                    as="button"
                                                    type="button"
                                                    $fontSize="14"
                                                    $colorScheme="secondary"
                                                    $cursor="pointer"
                                                    $outline="none"
                                                    $appearance="none"
                                                    $borderW="0"
                                                    $bg="transparent"
                                                    $p="0"
                                                    $w="14"
                                                    $h="14"
                                                    $d="inline-flex"
                                                    $alignItems="center"
                                                    $justifyContent="center"
                                                    $lineH="1"
                                                    onClick={() => handleDeleteAttachment(attachment.fileId, index)}
                                                >
                                                    <CloseIcon />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Portal>
            </>
        );
    }
);
export default AttachmentPlugin;
