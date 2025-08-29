import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import { Button } from '@components/Button';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { FEEDBACK_REQUEST } from '@constants/routes';
import orderBy from 'lodash/orderBy';
import slice from 'lodash/slice';
import { useDetailContext } from './DetailContext.js';
import { CardAttachment } from './CardAttachment.jsx';
import { CardRecentFile } from './CardRecentFile.jsx';
import IconNoData from '@components/Svg/IconNoData';
import IconCardView from '@components/Svg/IconCardView';
import IconListView from '@components/Svg/IconListView';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import downloadFoldersAsZip from '@utils/downloadFoldersAsZip';
import message from '@components/Message';
import * as qs from 'query-string';
import { Progress } from '@components/Progress';
import { blue } from '@ant-design/colors';
import { COLOR_CTA } from '@components/Theme/color.js';

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

const ListType = ({ type, setType }) => {
    return (
        <Box $d="flex" $justifyContent="space-between">
            <Box onClick={() => setType('card')} $mr="10" $cursor="pointer">
                <IconCardView isFilled={type === 'card'} />
            </Box>
            <Box onClick={() => setType('list')} $cursor="pointer">
                <IconListView isFilled={type === 'list'} />
            </Box>
        </Box>
    );
};

export const TabFile = () => {
    const { request, folders, activeFolderId, setActiveFolderId } = useDetailContext();
    const activeFolder = useMemo(() => (activeFolderId ? folders.find(f => f.id === activeFolderId) : null), [folders, activeFolderId]);
    const [type, setType] = useState('card');
    const [isDownloadingFiles, setIsDownloadingFiles] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const history = useHistory();

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

    const handleClickFile = file => {
        const parsed = qs.parse(window.location.search);
        const stringify = qs.stringify(parsed);
        const back = activeFolderId ? `&folder=${activeFolderId}` : ``;
        history.push(`${FEEDBACK_REQUEST.replace(':id', request.id)}?file=${file.id}${back}`, { from: `${window.location.pathname}?${stringify}` });
    };

    const allRecentFiles = slice(orderBy([...request?.recentFiles], ['createdAt'], ['desc']), 0, 8);

    const checkIsFolderNotHidden = fileToCheck => {
        const isFolderNotHidden = !fileToCheck?.folder?.isHidden;
        return isFolderNotHidden;
    };

    const handleZippingFiles = prcnt => {
        setDownloadProgress(prcnt);
        if (Math.ceil(prcnt) >= 100) {
            setIsDownloadingFiles(false);
            message.success('Files have been downloaded successfully');
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

    useEffect(() => {
        if (activeFolderId) {
            const [selectedFolder] = folders?.filter(folder => folder.id === activeFolderId);
            if (selectedFolder) {
                setActiveFolder(selectedFolder);
            } else {
                message.destroy();
                message.error('Folder does not exist');
            }
        }
    }, [activeFolderId, request, folders]);

    return (
        <Box $px={['14', '20']} $py="16">
            {activeFolder !== null ? (
                <>
                    <Box $d="flex" $mb="20" $alignItems="center">
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
                            {activeFolder.name}
                        </Text>
                        <Box $ml="auto" $flexDir="row" $d="flex" $alignItems="center" $justifyContent="center">
                            {!isDownloadingFiles && (
                                <Box $mr="20">
                                    <Button
                                        type="ghost"
                                        icon={<IconDownloadAlt color={COLOR_CTA} $fontSize="16px" />}
                                        $textTransform="none"
                                        $px="0"
                                        $h="20"
                                        onClick={handleDownloadZip}
                                        $autoCap
                                        $colorScheme="cta"
                                    >
                                        Download all files
                                    </Button>
                                </Box>
                            )}
                            <ListType type={type} setType={setType} />
                        </Box>
                    </Box>
                    {isDownloadingFiles && (
                        <Box $mb="10" $maxW="95%">
                            <Progress size="small" strokeColor={blue[4]} percent={downloadProgress} showInfo={false} />
                        </Box>
                    )}
                    <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                        {activeFolder.files?.map(
                            file =>
                                !file.isHidden && (
                                    <Box
                                        $mb="20"
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
                                            onClick={() => handleClickFile(file)}
                                            downloadIcon={<IconDownloadAlt />}
                                            downloadIconSize="20"
                                            requestName={request.name}
                                            listType={type}
                                            requestId={request.id}
                                        />
                                    </Box>
                                )
                        )}
                    </Box>
                    {activeFolder.files?.length < 1 && (
                        <Box $textAlign="center" $mt="10" $my="8">
                            <EmptyData title="No files" desc="All files will appear here" />
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
                    <Box $d="flex" $mb="20" $alignItems="center">
                        <Text $textVariant="H6">Folders</Text>
                        <Box $ml="auto" $d="flex" $alignItems="center" $justifyContent="center">
                            <Box $mr="20">
                                <Button
                                    type="ghost"
                                    icon={<IconDownloadAlt color={COLOR_CTA} $fontSize="16px" />}
                                    $textTransform="none"
                                    $px="0"
                                    $h="20"
                                    onClick={handleDownloadAllFolders}
                                    $colorScheme="cta"
                                    $autoCap
                                >
                                    Download all files
                                </Button>
                            </Box>
                            <ListType type={type} setType={setType} />
                        </Box>
                    </Box>
                    <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                        {folders?.map(
                            folder =>
                                !folder.isHidden && (
                                    <Box
                                        $mb={['16', '20']}
                                        key={folder.id}
                                        $mx={['0', '10']}
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
                                            isDirectory
                                            textSizeVariant="P5"
                                            imageSize={type === 'card' ? '48' : '32'}
                                            paddingImage="20"
                                            canDownload
                                            h={type === 'card' ? '70' : '64'}
                                            downloadIcon={<IconDownloadAlt />}
                                            downloadIconSize="20"
                                            onClick={() => setActiveFolder(folder)}
                                            requestName={request.name}
                                            listType={type}
                                            requestId={request.id}
                                        />
                                    </Box>
                                )
                        )}
                    </Box>
                    {folders?.length < 1 && (
                        <Text $textVariant="P4" $colorScheme="secondary" fontStyle="italic" $mt="-10" $mb="8">
                            There are no folders yet.
                        </Text>
                    )}
                    <Text $textVariant="H6">Recent Files</Text>
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
                                        onClick={() => handleClickFile(file)}
                                        downloadIcon={<IconDownloadAlt />}
                                        listType={type}
                                        requestName={request.name}
                                        requestId={request.id}
                                        imageSize={type === 'card' ? '48' : '32'}
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
        </Box>
    );
};
