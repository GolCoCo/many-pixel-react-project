import React, { useCallback, useState, useEffect, memo } from 'react';
import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import IconAdd from '@components/Svg/IconAdd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Popup, PopupDelete } from '@components/Popup';
import message from '@components/Message';
import { UPLOAD_FILES, DOWNLOAD_FILE } from '@graphql/mutations/file';
import { UPDATE_BRAND } from '@graphql/mutations/brand';
import downloadSingleFile from '@utils/downloadSingleFile';
import FormRenameUpload from './FormRenameUpload.jsx';
import { CardDetailUploaded } from './CardDetailUploaded.jsx';
import { MiniUpload } from '../style.js';
import client from '@constants/client.js';

export const FieldDetailUpload = memo(({ value, accept, label, brandData, fileCategory, isCustomer }) => {
    const [internalValues, setInternalValues] = useState(value ?? []);
    const [hasDragFile, setHasDragFile] = useState(false);
    const [{ deletable }, setDeletable] = useState({ deletable: null });
    const [{ renamable }, setRenamable] = useState({ renamable: null });
    const [isDeletingFile, setIsDeletingFile] = useState(false);
    const [uploadFiles] = useMutation(UPLOAD_FILES);
    const [downloadFile] = useMutation(DOWNLOAD_FILE);
    const [updateBrand] = useMutation(UPDATE_BRAND);

    useEffect(() => {
        setInternalValues(value ?? []);
    }, [value]);

    const onDrop = useCallback(
        async acceptedFiles => {
            message.destroy();
            message.loading(`Uploading ${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''}...`, 50000);
            await client
                .mutate({ mutation: UPLOAD_FILES, variables: { files: acceptedFiles }, fetchPolicy: 'network-only' })
                .then(async ({ data }) => {
                    const ids = data?.uploadFiles.map(uploaded => uploaded.id);
                    let uploadedIds;

                    switch (fileCategory) {
                        case 'logo':
                            uploadedIds = { logosIds: ids };
                            break;
                        case 'guide':
                            uploadedIds = { guideIds: ids };
                            break;
                        case 'font':
                            uploadedIds = { fontsIds: ids };
                            break;
                        case 'asset':
                            uploadedIds = { assetsIds: ids };
                            break;
                        default:
                            break;
                    }

                    await updateBrand({
                        variables: {
                            id: brandData.id,
                            name: brandData.name,
                            industry: brandData.industry,
                            description: brandData.description,
                            website: brandData.website,
                            ...uploadedIds,
                        },
                    })
                        .then(() => {
                            message.destroy();
                            message.success(`File${acceptedFiles.length > 1 ? 's' : ''} has been uploaded`);
                        })
                        .catch(err => {
                            console.log(err);
                            message.destroy();
                            message.error('Error on updating brand');
                        });
                })
                .catch(err => {
                    console.log(err);
                    message.destroy();
                    message.error('Error on uploading files');
                });
            setHasDragFile(false);
        },
        [uploadFiles, brandData, updateBrand, fileCategory]
    );

    const onDragOver = useCallback(() => {
        if (!hasDragFile) {
            setHasDragFile(true);
        }
    }, [hasDragFile]);

    const onDragLeave = useCallback(() => {
        setHasDragFile(false);
    }, []);

    const dropZoneProps = accept ? { onDrop, onDragOver, onDragLeave, multiple: true, accept } : { onDrop, onDragOver, onDragLeave, multiple: true };

    const { getInputProps, getRootProps } = useDropzone(dropZoneProps);

    const handleDownload = async item => {
        message.destroy();
        message.loading('Downloading file. Please wait...', 1.5);
        await downloadFile({ variables: { id: item.id } })
            .then(({ data }) => {
                downloadSingleFile(data?.downloadFile?.signedURL, item.name, brandData.name, fileCategory);
            })
            .catch(err => {
                console.log(err);
                message.destroy();
                const errors = err.graphQLErrors || [];
                const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on downloading file';
                message.error(formErrorMessage);
            });
    };

    const handleSuccessRename = async () => {
        message.destroy();
        message.success('File name has been updated');
        setRenamable({ renamable: null });
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

        let removeFileId;

        switch (fileCategory) {
            case 'logo':
                removeFileId = { logoToDelete: deletable.id };
                break;
            case 'guide':
                removeFileId = { guideToDelete: deletable.id };
                break;
            case 'font':
                removeFileId = { fontToDelete: deletable.id };
                break;
            case 'asset':
                removeFileId = { assetToDelete: deletable.id };
                break;
            default:
                break;
        }

        await updateBrand({
            variables: {
                id: brandData.id,
                name: brandData.name,
                industry: brandData.industry,
                description: brandData.description,
                website: brandData.website,
                ...removeFileId,
            },
        })
            .then(async () => {
                message.destroy();
                message.success('File has been deleted');
            })
            .catch(err => {
                console.log(err);
                message.destroy();
                message.error('Error on updating brand');
            });
        setIsDeletingFile(false);
        setDeletable({ deletable: null });
    };

    return (
        <Box $hasSpace $spaceRight={['0', '20']} $d="flex" $flexWrap="wrap">
            {isCustomer && (
                <MiniUpload {...getRootProps()} $hasDragFile={hasDragFile}>
                    <input {...getInputProps()} />
                    <Box $mb="10" $fontSize="40">
                        <IconAdd />
                    </Box>
                    <Text $textVariant="Badge" $colorScheme="primary">
                        {label}
                    </Text>
                </MiniUpload>
            )}
            {!isCustomer && internalValues?.length === 0 && (
                <Box
                    $d="flex"
                    $w="224"
                    $h="60"
                    $px="16"
                    $py="11"
                    $flexDir="column"
                    $justifyContent="center"
                    $borderW="1"
                    $borderColor="outline-gray"
                    $borderStyle="solid"
                    $mb="20"
                >
                    <Text $textVariant="Badge" $colorScheme="primary">
                        N/A
                    </Text>
                </Box>
            )}
            {Array.isArray(internalValues) &&
                internalValues.length > 0 &&
                internalValues.map((item, index) => (
                    <CardDetailUploaded
                        key={item.id ?? index}
                        name={item.name}
                        size={item.size}
                        url={item.url}
                        onRename={() => setRenamable({ renamable: item })}
                        onDelete={() => setDeletable({ deletable: item })}
                        onDownload={() => handleDownload(item)}
                        isCustomer={isCustomer}
                    />
                ))}
            <Popup
                open={renamable !== null}
                $variant="default"
                centered
                destroyOnClose
                title="Rename file"
                footer={null}
                width={420}
                onCancel={() => setRenamable({ renamable: null })}
            >
                <FormRenameUpload
                    initialValues={{
                        ...renamable,
                        name: renamable?.name,
                    }}
                    onSuccessSubmit={handleSuccessRename}
                />
            </Popup>
            <PopupDelete
                title="Are you sure you want to delete this file?"
                $variant="delete"
                open={deletable !== null}
                onOk={handleDelete}
                onCancel={() => setDeletable({ deletable: null })}
                confirmLoading={isDeletingFile}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </Box>
    );
});
