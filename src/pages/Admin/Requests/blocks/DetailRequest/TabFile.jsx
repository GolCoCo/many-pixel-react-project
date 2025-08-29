import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'antd';
import { blue } from '@ant-design/colors';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import message from '@components/Message';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import IconAdd from '@components/Svg/IconAdd';
import IconUpload from '@components/Svg/IconUpload';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import IconUploadRequest from '@components/Svg/IconUploadRequest';
import { FEEDBACK_REQUEST } from '@constants/routes';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import downloadFoldersAsZip from '@utils/downloadFoldersAsZip';
import { SAVE_FILE } from '@graphql/mutations/file';
import { ATTACH_FILE_TO_FOLDER } from '@graphql/mutations/folder';
import orderBy from 'lodash/orderBy';
import slice from 'lodash/slice';
import includes from 'lodash/includes';
import { useDetailContext } from './DetailContext.js';
import { CardAttachment } from './CardAttachment.jsx';
import { CardRecentFile } from './CardRecentFile.jsx';
import FormAddFolder from './FormAddFolder.jsx';
import IconNoData from '@components/Svg/IconNoData';
import { uploadToR2 } from '@utils/uploadToR2.js';
import IconCardView from '@components/Svg/IconCardView';
import IconListView from '@components/Svg/IconListView';
import * as qs from 'query-string';
import { Progress } from '@components/Progress';

const EmptyData = ({ title, desc }) => (
    <>
        <Box $lineH="1" $fontSize="160" $mb="30">
            <IconNoData />
        </Box>
        <Text $textVariant="H5" $colorScheme="primary" $mb="16">
            {title}
        </Text>
        <Text $textVariant="P2" $colorScheme="secondary" $fontSize="14" $lineH="21">
            {desc}
        </Text>
    </>
);

const ListType = ({ type, setType, ml }) => {
    return (
        <Box $d="flex" $justifyContent="space-between" $ml={ml}>
            <Box onClick={() => setType('card')} $mr="10" $cursor="pointer">
                <IconCardView isFilled={type === 'card'} />
            </Box>
            <Box onClick={() => setType('list')} $cursor="pointer">
                <IconListView isFilled={type === 'list'} />
            </Box>
        </Box>
    );
};

const createRunSequentially = () => {
    const queue = [];
    let processing = false;

    const processQueue = (func, finalFunc) => {
        if (processing || queue.length === 0) return;
        message.destroy();
        message.loading('Uploading file(s). Please wait...', 50000);
        processing = true;
        const options = queue.shift();

        func(options).finally(() => {
            processing = false;
            message.destroy();

            if (queue.length > 0) {
                setImmediate(processQueue, func, finalFunc); // Process next email
            } else {
                finalFunc();
            }
        });
    };

    return {
        add: (options, func, finalFunc) => {
            queue.push(options);
            setImmediate(processQueue, func, finalFunc);
        },
    };
};

const runSequentially = createRunSequentially();

let uploadFileIds = [];

export const TabFile = () => {
    const { request, refetchRequests, viewerId, activeFolderId, folders, setActiveFolderId } = useDetailContext();
    const activeFolder = useMemo(
        () => (activeFolderId ? folders.find(f => f.id === activeFolderId) : null),
        [folders, activeFolderId]
    );
    const [showAddFolderForm, setShowAddFolderForm] = useState(false);
    const [isDownloadingFiles, setIsDownloadingFiles] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadIndicator, setShowUploadIndicator] = useState(false);
    const [saveFile] = useMutation(SAVE_FILE);
    const [progress, setProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [fileUpload, setFileUpload] = useState(null);
    const [type, setType] = useState('card');
    const [addToFolderFiles] = useMutation(ATTACH_FILE_TO_FOLDER);

    useEffect(() => {
        const parsed = qs.parse(window.location.search);
        if (activeFolderId) {
            parsed.folder = activeFolderId;
        } else {
            delete parsed.folder;
        }
        const stringify = qs.stringify(parsed);
        window.history.pushState('', '', `${window.location.pathname}?${stringify}`);
    }, [activeFolderId]);

    const setActiveFolder = useCallback(
        folder => {
            if (folder?.id) {
                setActiveFolderId(folder.id);
            } else {
                setActiveFolderId(null);
            }
        },
        [setActiveFolderId]
    );

    const history = useHistory();

    const handleSuccessAddFolder = async () => {
        message.destroy();
        message.success('Folder successfully added');
        setShowAddFolderForm(false);
        await refetchRequests();
    };

    const handleShowAddFolderForm = () => {
        setShowAddFolderForm(true);
    };

    const handleClickFile = file => {
        const parsed = qs.parse(window.location.search);
        const stringify = qs.stringify(parsed);
        const back = activeFolderId ? `&folder=${activeFolderId}` : ``;
        history.push(`${FEEDBACK_REQUEST.replace(':id', request.id)}?file=${file.id}${back}`, {
            from: `${window.location.pathname}?${stringify}`,
        });
    };

    const handleZippingFiles = prcnt => {
        console.log(prcnt);
        setDownloadProgress(prcnt);
        if (Math.ceil(prcnt) >= 100) {
            setIsDownloadingFiles(false);
            message.success('Files successfully downloaded');
        }
    };

    const handleDownloadZip = () => {
        setIsDownloadingFiles(true);
        const folderName = `${request?.name}-${activeFolder.name}`;
        downloadFilesAsZip(activeFolder.files, folderName, handleZippingFiles);
    };

    const handleDownloadAllFolders = () => {
        setIsDownloadingFiles(true);
        downloadFoldersAsZip(folders, request.name, handleZippingFiles);
    };

    const allRecentFiles = slice(orderBy([...request?.recentFiles], ['createdAt'], ['desc']), 0, 8);
    const [defaultFolder] = folders ? folders : [];
    const defaultFolderFileIds =
        defaultFolder && defaultFolder?.files && defaultFolder?.files?.length > 0
            ? defaultFolder?.files?.map(f => f.id)
            : null;
    const checkIsDefaultFolder = fileId => {
        if (!defaultFolderFileIds) {
            return false;
        }

        const isUnderDefaultFolder = includes(defaultFolderFileIds, fileId);
        return isUnderDefaultFolder;
    };

    const checkIsFolderNotHidden = fileToCheck => {
        const isFolderNotHidden = !fileToCheck?.folder?.isHidden;
        return isFolderNotHidden;
    };

    const handleUpload = async () => {
        try {
            await addToFolderFiles({ variables: { folderId: activeFolder.id, fileId: uploadFileIds } });
            await refetchRequests();
            uploadFileIds = [];
            message.destroy();
            message.success('File(s) has been uploaded');
            setIsUploading(false);
            setFileUpload(null);
            setProgress(0);
            return true;
        } catch (err) {
            setIsUploading(false);
            console.log(err);
            message.destroy();
            message.error('Error on uploading file(s)');
            return false;
        }
    };

    const handleReadyForUpload = (uploadedFile, totalFiles) => {
        uploadFileIds.push(uploadedFile.response.id);
        // if (uploadFileIds.length === totalFiles) {
        //     handleUpload(uploadFileIds);
        // }
    };

    const customRequest = async options => {
        setIsUploading(true);
        setFileUpload({
            name: options.file.name,
            size: options.file.size,
            type: options.file.type,
        });
        const uploadedFile = await uploadToR2(options.file, setProgress);
        const variables = {
            name: options.file.name,
            size: options.file.size,
            type: options.file.type,
            secret: uploadedFile,
        };

        const res = await saveFile({ variables });
        options.onSuccess(res.data.saveFile);
    };

    const handleUploadChange = info => {
        if (info.file.status === 'done') {
            handleReadyForUpload(info.file, info.fileList.length);
        } else if (info.file.status === 'error') {
            message.destroy();
            message.error('There was an error on uploading your files');
            console.log(info, 'upload files error');
        }
    };

    const handleDropUpload = async dropFiles => {
        message.destroy();
        message.loading('Uploading file(s). Please wait...', 50000);
        setIsUploading(true);
        const fileIdsToSave = [];
        await Promise.all(
            dropFiles.map(async dropFile => {
                setFileUpload({
                    name: dropFile.name,
                    size: dropFile.size,
                    type: dropFile.type,
                });
                const uploadedFile = await uploadToR2(dropFile, setProgress);
                const variables = {
                    name: dropFile.name,
                    size: dropFile.size,
                    type: dropFile.type,
                    secret: uploadedFile,
                };
                const res = await saveFile({ variables });
                fileIdsToSave.push(res.data.saveFile.id);

                return true;
            })
        );
        await addToFolderFiles({ variables: { folderId: activeFolder.id, fileId: fileIdsToSave } });
        setIsUploading(false);
        await refetchRequests();
        message.destroy();
        message.success('File(s) has dropFiles uploaded');
    };

    const isNotDefaultFolder = activeFolder !== null && defaultFolder?.id !== activeFolder?.id;

    const onDrop = (...dropProps) => {
        if (isNotDefaultFolder) {
            setShowUploadIndicator(false);
            handleDropUpload(dropProps[0]);
        }
    };

    const onDragEnter = () => {
        if (isNotDefaultFolder) {
            setShowUploadIndicator(true);
        }
    };

    const onDragLeave = () => {
        if (isNotDefaultFolder) {
            setShowUploadIndicator(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter,
        onDragLeave,
        multiple: true,
        noClick: true,
    });

    return (
        <Box $minH={showUploadIndicator ? '637' : 'auto'} $px="20" $py="16" $pos="relative" {...getRootProps()}>
            {activeFolder !== null ? (
                <>
                    <Box $d="flex" $mb="20" $alignItems="center" $justifyContent="space-between">
                        <Box $d="flex" $alignItems="center">
                            <Button
                                $w="28"
                                $h="28"
                                mobileH="28"
                                type="default"
                                className="ant-btn ant-btn-default"
                                $lineH="1"
                                icon={<ArrowLeftIcon style={{ fontSize: 16 }} />}
                                onClick={() => setActiveFolder(null)}
                            />
                            <Text $textVariant="H6" $pl="20">
                                {activeFolder?.name}
                            </Text>
                        </Box>
                        <Box $d="flex" $alignItems="center">
                            {defaultFolder?.id !== activeFolder?.id && (
                                <Upload
                                    name="images-upload"
                                    showUploadList={false}
                                    multiple
                                    onChange={file => handleUploadChange(file)}
                                    customRequest={file => runSequentially.add(file, customRequest, handleUpload)}
                                >
                                    <Button
                                        $h="34"
                                        type="primary"
                                        icon={<IconUpload style={{ fontSize: 16 }} />}
                                        $fontSize="12"
                                        loading={isUploading}
                                        $mr="10"
                                    >
                                        Upload a file
                                    </Button>
                                </Upload>
                            )}
                            <ListType type={type} setType={setType} $ml="16" />
                        </Box>
                    </Box>
                    {isDownloadingFiles && (
                        <Progress size="small" strokeColor={blue[4]} percent={downloadProgress} showInfo={false} />
                    )}
                    {activeFolder?.files?.length > 0 && (
                        <Box $mb="20" $d="flex" $alignItems="center" $justifyContent="space-between">
                            <Text $textVariant="H6">Files</Text>
                            {!isDownloadingFiles && (
                                <Button
                                    type="ghost"
                                    $colorScheme="cta"
                                    icon={<IconDownloadAlt $fontSize="16px" />}
                                    $textTransform="none"
                                    $px="0"
                                    $h="16"
                                    iscapitalized
                                    onClick={handleDownloadZip}
                                >
                                    Download all files
                                </Button>
                            )}
                        </Box>
                    )}
                    <Box $d="flex" $flexWrap="wrap" $mx="-10">
                        {activeFolder?.files?.map(file => (
                            <Box
                                $mb="20"
                                key={file.id}
                                $mx="10"
                                $w={{
                                    xs: '100%',
                                    sm: '100%',
                                    md: '45%',
                                    lg: type === 'card' ? '167' : '100%',
                                    xl: type === 'card' ? '199' : '100%',
                                    xxl: type === 'card' ? '200' : '100%',
                                }}
                                $flex={{
                                    xs: '1 1 0%',
                                    sm: '1 1 0%',
                                    md: '0 1 45%',
                                    lg: `0 1 ${type === 'card' ? '167px' : '100%'}`,
                                    xl: `0 1 ${type === 'card' ? '199px' : '100%'}`,
                                    xxl: `0 1 ${type === 'card' ? '200px' : '100%'}`,
                                }}
                            >
                                <CardRecentFile
                                    {...file}
                                    isDefaultFolder={activeFolder?.id === defaultFolder?.id}
                                    onClick={() => handleClickFile(file)}
                                    requestName={request.name}
                                    refetchRequests={refetchRequests}
                                    listType={type}
                                    requestId={request.id}
                                />
                            </Box>
                        ))}
                        {isUploading && fileUpload && (
                            <Box
                                $mb="20"
                                key={fileUpload.name}
                                $mx="10"
                                $w={{
                                    xs: '100%',
                                    sm: '100%',
                                    md: '45%',
                                    lg: type === 'card' ? '167' : '100%',
                                    xl: type === 'card' ? '199' : '100%',
                                    xxl: type === 'card' ? '200' : '100%',
                                }}
                                $flex={{
                                    xs: '1 1 0%',
                                    sm: '1 1 0%',
                                    md: '0 1 45%',
                                    lg: `0 1 ${type === 'card' ? '167px' : '100%'}`,
                                    xl: `0 1 ${type === 'card' ? '199px' : '100%'}`,
                                    xxl: `0 1 ${type === 'card' ? '200px' : '100%'}`,
                                }}
                            >
                                <CardRecentFile
                                    {...fileUpload}
                                    isDefaultFolder={activeFolder?.id === defaultFolder?.id}
                                    onClick={() => {}}
                                    requestName={request.name}
                                    refetchRequests={refetchRequests}
                                    isUploading={isUploading}
                                    uploadProgress={progress}
                                    listType={type}
                                />
                            </Box>
                        )}
                    </Box>
                    {activeFolder?.files?.length < 1 && (
                        <Box $textAlign="center" $my="30">
                            <EmptyData
                                title={activeFolder?.id === defaultFolder?.id ? 'No files' : 'Drop files here'}
                                desc={
                                    activeFolder?.id === defaultFolder?.id
                                        ? 'All files will appear here'
                                        : 'You can drag and drop your files here or use the "Upload a File" button'
                                }
                            />
                        </Box>
                    )}
                </>
            ) : (
                <>
                    {isDownloadingFiles && (
                        <Box $mb="10">
                            <Progress size="small" strokeColor={blue[4]} percent={downloadProgress} showInfo={false} />
                        </Box>
                    )}
                    <Box $mb="20" $d="flex" $alignItems="center" $justifyContent="space-between">
                        <Text $textVariant="H6">Folders</Text>
                        <Box $d="flex" $alignItems="center">
                            <Button
                                $h="34"
                                type="primary"
                                icon={<IconAdd style={{ fontSize: 16 }} />}
                                onClick={handleShowAddFolderForm}
                                $fontSize="12"
                                $mr="10"
                            >
                                Add Folder
                            </Button>

                            <Button
                                type="ghost"
                                $colorScheme="cta"
                                icon={<IconDownloadAlt $fontSize="16px" />}
                                $textTransform="none"
                                $px="0"
                                $h="16"
                                $mr="10"
                                iscapitalized
                                onClick={handleDownloadAllFolders}
                            >
                                Download all files
                            </Button>
                            <ListType type={type} setType={setType} />
                        </Box>
                    </Box>
                    <Box $d="flex" $flexWrap="wrap" $mx="-10">
                        {folders?.map(folder => (
                            <Box
                                $mb="20"
                                key={folder.id}
                                $mx="10"
                                $w={{
                                    xs: '100%',
                                    sm: '100%',
                                    md: '45%',
                                    lg: type === 'card' ? '237' : '100%',
                                    xl: type === 'card' ? '270' : '100%',
                                    xxl: type === 'card' ? '270' : '100%',
                                }}
                                $flex={{
                                    xs: '1 1 0%',
                                    sm: '1 1 0%',
                                    md: '0 1 45%',
                                    lg: `0 1 ${type === 'card' ? '237px' : '100%'}`,
                                    xl: `0 1 ${type === 'card' ? '270px' : '100%'}`,
                                    xxl: `0 1 ${type === 'card' ? '270px' : '100%'}`,
                                }}
                            >
                                <CardAttachment
                                    {...folder}
                                    isDefaultFolder={defaultFolder?.id === folder?.id}
                                    isDirectory
                                    textSizeVariant="P5"
                                    imageSize="38"
                                    paddingImage="20"
                                    h={type === 'card' ? '70' : '64'}
                                    onClick={() => setActiveFolder(folder)}
                                    requestName={request.name}
                                    orderId={request.id}
                                    refetchRequests={refetchRequests}
                                    listType={type}
                                    requestId={request.id}
                                />
                            </Box>
                        ))}
                    </Box>
                    {folders?.length < 1 && (
                        <Box $textAlign="center" $mb="8" $mt="10">
                            <EmptyData title="No folders" desc="All files will appear here" />
                        </Box>
                    )}
                    <Text $textVariant="H6" $mb="20">
                        Recent Files
                    </Text>
                    <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                        {allRecentFiles
                            ?.filter(file => !file.isHidden && checkIsFolderNotHidden(file))
                            ?.map(file => (
                                <Box
                                    $mb={['16', '20']}
                                    key={file.id}
                                    $mx={['0', '10']}
                                    $w={{
                                        xs: '100%',
                                        sm: '100%',
                                        md: '45%',
                                        lg: type === 'card' ? '167' : '100%',
                                        xl: type === 'card' ? '199' : '100%',
                                        xxl: type === 'card' ? '200' : '100%',
                                    }}
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 45%',
                                        lg: `0 1 ${type === 'card' ? '167px' : '100%'}`,
                                        xl: `0 1 ${type === 'card' ? '199px' : '100%'}`,
                                        xxl: `0 1 ${type === 'card' ? '200px' : '100%'}`,
                                    }}
                                >
                                    <CardRecentFile
                                        {...file}
                                        imageSize={type === 'card' ? '48' : '32'}
                                        requestId={request.id}
                                        isDefaultFolder={checkIsDefaultFolder(file.id)}
                                        onClick={() => handleClickFile(file)}
                                        requestName={request.name}
                                        refetchRequests={refetchRequests}
                                        listType={type}
                                    />
                                </Box>
                            ))}
                    </Box>
                    {allRecentFiles?.length < 1 && (
                        <Box $textAlign="center" $mt="10" $my="8">
                            <EmptyData title="No files" desc="All files will appear here" />
                        </Box>
                    )}
                </>
            )}
            <Popup
                open={showAddFolderForm}
                $variant="default"
                centered
                destroyOnClose
                title="Add folder"
                footer={null}
                width={420}
                onCancel={() => setShowAddFolderForm(false)}
            >
                <FormAddFolder orderId={request?.id} userId={viewerId} onSuccessSubmit={handleSuccessAddFolder} />
            </Popup>
            <Box
                $w="100%"
                $h="100%"
                $pos="absolute"
                $top="0"
                $left="0"
                $bg="rgba(0, 153, 246, 0.4)"
                $borderW="1"
                $borderStyle="solid"
                $borderColor="cta"
                $d={showUploadIndicator ? 'block' : 'none'}
            >
                <Box
                    $d="flex"
                    $flexDir="column"
                    $alignItems="center"
                    $justifyContent="center"
                    $textAlign="center"
                    $h="100%"
                    $w="100%"
                >
                    <input {...getInputProps()} />
                    <Box $mb="20">
                        <IconUploadRequest />
                    </Box>
                    <Text $textVariant="P4" $colorScheme="primary">
                        Drop your files here
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};
