import React, { useState, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@components/Svg/Close';
import { useMutation } from '@apollo/client';
import { DELETE_FILE } from '@graphql/mutations/file';
import { PopupDelete } from '@components/Popup';
import { Box } from '../Box';
import { Text } from '../Text';
import { IconFile } from '../IconFile';
import UploadIcon from '../Svg/Upload';

const UploaderItem = ({ onCloseClick, isFileObj, value }) => {
    return (
        <Box $d="flex" $flexWrap="nowrap" $py="6">
            <Box>
                <IconFile fileObj={isFileObj ? value : undefined} url={value.url} name={value.name} showPreviewImage size="39" />
            </Box>
            <Box $px="14" $flex={1}>
                <Text $textVariant="P4" $colorScheme="primary">
                    {value.name}
                </Text>
                <Text $textVariant="P5" $colorScheme="secondary">
                    Uploaded
                </Text>
            </Box>
            <Box $colorScheme="secondary" _hover={{ $colorScheme: 'cta' }}>
                <CloseIcon onClick={onCloseClick} />
            </Box>
        </Box>
    );
};

export const Uploader = forwardRef(
    ({ value, accept, multiple, onChange, initialValue, refetch, isDuplicateEdit, handleChangeAttachments, handleChangeAttachmentsToDisconnect }, ref) => {
        const [internalValue, setInternalValue] = useState(() => {
            if (multiple) {
                return [];
            }
            return null;
        });
        const [deletable, setDeletable] = useState(null);
        const [deletableIndex, setDeletableIndex] = useState(null);
        const [deleting, setDeleting] = useState(false);
        const [hasDragFile, setHasDragFile] = useState(false);

        const [deleteFile] = useMutation(DELETE_FILE);

        const onDrop = (...dropProps) => {
            const acceptedFiles = dropProps[0];
            setInternalValue(old => {
                if (multiple) {
                    return [...old, ...acceptedFiles];
                }
                return acceptedFiles;
            });

            if (onChange) {
                onChange(multiple ? [...internalValue, ...acceptedFiles] : acceptedFiles);
            }
        };

        const dropZoneProps = accept ? { onDrop, multiple, accept } : { onDrop, multiple };

        const { getRootProps, getInputProps } = useDropzone(dropZoneProps);

        const hasValue =
            (multiple && internalValue.length > 0) ||
            (!multiple && internalValue !== null) ||
            (multiple && Array.isArray(initialValue) && initialValue.length > 0) ||
            (!multiple && initialValue);

        const handleDragOver = () => {
            if (!hasDragFile) {
                setHasDragFile(true);
            }
        };

        const handleDragExit = () => {
            setHasDragFile(false);
        };

        const handleDeleteMultiple = index => {
            setInternalValue(old => old.filter((_, i) => i !== index));

            if (onChange) {
                onChange(internalValue.filter((_, i) => i !== index));
            }
        };

        const handleDeleteSingle = () => {
            setInternalValue(null);

            if (onChange) {
                onChange(null);
            }
        };

        const handleDeleteExisting = async () => {
            if (!isDuplicateEdit) {
                try {
                    setDeleting(true);
                    await deleteFile({
                        variables: {
                            id: deletable.id,
                        },
                    });

                    if (refetch) {
                        await refetch();
                    }
                    setDeleting(false);
                    setDeletable(null);
                } catch (error) {
                    console.log(error);
                    setDeleting(false);
                    setDeletable(null);
                }
            } else {
                if (handleChangeAttachments) {
                    handleChangeAttachments(initialValue.filter((_, i) => i !== deletableIndex));
                }

                if (handleChangeAttachmentsToDisconnect) {
                    handleChangeAttachmentsToDisconnect(initialValue.filter((_, i) => i === deletableIndex));
                }
                setDeletableIndex(null);
                setDeletable(null);
            }
        };

        return (
            <>
                <PopupDelete
                    $variant="delete"
                    open={deletable !== null}
                    title="Are you sure you want to delete this file?"
                    onOk={handleDeleteExisting}
                    onCancel={() => setDeletable(null)}
                    confirmLoading={deleting}
                >
                    <Text $textVariant="P4" $colorScheme="secondary">
                        This action cannot be undone
                    </Text>
                </PopupDelete>
                <Box
                    $w="100%"
                    $borderW="1"
                    $borderColor={hasDragFile ? 'cta' : 'outline-gray'}
                    $borderStyle={hasDragFile ? 'solid' : 'dashed'}
                    $px="16"
                    $bg={hasDragFile ? 'rgba(0, 153, 246, 0.4)' : 'white'}
                    onDragOver={handleDragOver}
                    onDrop={handleDragExit}
                    onDragLeave={handleDragExit}
                    $userSelect="none"
                    $radii="10"
                    $cursor="pointer"
                >
                    <Box $h="128" {...getRootProps()}>
                        <input ref={ref} {...getInputProps()} />
                        <Box $d="flex" $flexDir="column" $alignItems="center" $justifyContent="center" $textAlign="center" $h="100%">
                            <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }} $textVariant="badge" $colorScheme="cta">
                                <UploadIcon /> Upload File
                            </Text>
                            <Text $d={['none', 'block']} $textVariant="P4" $p="8px" $colorScheme="primary">
                                or
                            </Text>
                            <Text $d={['none', 'block']} $textVariant="P4" $colorScheme="primary">
                                Drag and drop your files here
                            </Text>
                        </Box>
                    </Box>
                    {hasValue && (
                        <Box $mt="16" $borderT="1" $borderTopStyle="solid" $borderTopColor="outline-gray" $py="10">
                            {initialValue && (
                                <>
                                    {Array.isArray(initialValue) ? (
                                        initialValue.map((item, index) => (
                                            <UploaderItem
                                                key={item.id}
                                                value={item}
                                                onCloseClick={() => {
                                                    setDeletableIndex(index);
                                                    setDeletable(item);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <UploaderItem value={initialValue} onCloseClick={() => setDeletable(initialValue)} />
                                    )}
                                </>
                            )}
                            {multiple ? (
                                internalValue.map((item, index) => (
                                    <UploaderItem key={index} isFileObj value={item} onCloseClick={() => handleDeleteMultiple(index)} />
                                ))
                            ) : (
                                <UploaderItem isFileObj value={value} onCloseClick={handleDeleteSingle} />
                            )}
                        </Box>
                    )}
                </Box>
            </>
        );
    }
);
