import React, { useCallback, useEffect, useState } from 'react';
import * as qs from 'query-string';
import { useQuery, useMutation } from '@apollo/client';
import { Badge } from '@components/Badge';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import IconFeedback from '@components/Svg/IconFeedback';
import IconFiles from '@components/Svg/IconFiles';
import IconLeftArrow from '@components/Svg/IconLeftArrow';
import { Tabs } from '@components/Tabs';
import { Text } from '@components/Text';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from '@constants/routes';
import { ORDER_FILES } from '@graphql/queries/order';
import { DOWNLOAD_FILE } from '@graphql/mutations/file';
import { ADD_COMMENT, CREATE_FEEDBACK, DELETE_COMMENT, DELETE_FEEDBACK, EDIT_COMMENT, EDIT_FEEDBACK, READ_FEEDBACK } from '@graphql/mutations/fileFeedback';
import downloadSingleFile from '@utils/downloadSingleFile';
import message from '@components/Message';
import { Skeleton } from '@components/Skeleton';
import withLoggedUser from '@components/WithLoggedUser';
import DocumentTitle from '@components/DocumentTitle';

import { withResponsive } from '@components/ResponsiveProvider';
import IconDownload from '@components/Svg/IconDownload';
import { Popup } from '@components/Popup';
import FormRequestComplete from '@pages/Admin/Requests/blocks/DetailRequest/FormRequestComplete';
import FormDeliveredRevision from '@pages/Admin/Requests/blocks/DetailRequest/FormDeliveredRevision';
import FormReopenRequest from '@pages/Admin/Requests/blocks/DetailRequest/FormReopenRequest';
import { USER_TYPE_CUSTOMER } from '@constants/account';
import {
    ORDER_STATUS_COMPLETED,
    ORDER_STATUS_DELIVERED_PROJECT,
    ORDER_STATUS_DELIVERED_REVISION,
    ORDER_STATUS_ONGOING_REVISION,
    ORDER_STATUS_ON_HOLD,
} from '@constants/order';
import { CHANGE_ORDER_STATUS, MARK_AS_COMPLETE, REOPEN_ORDER, UPDATE_ORDERS_PRIORITY } from '@graphql/mutations/order';
import FormResumeRequest from '@pages/Admin/Requests/blocks/DetailRequest/FormResumeRequest';
import downloadUrlWithProgressToBlob from '@utils/downloadUrlWithProgressToBlob';
import { saveAs } from 'file-saver';
import { useHistory } from 'react-router-dom';
import { Progress } from '@components/Progress';
import { blue } from '@constants/colors';
import CloseIcon from '@components/Svg/Close';
import { FeedbackTabFile } from '../blocks/FeedbackRequest/FeedbackTabFile';
import { FeedbackTabFeedback } from '../blocks/FeedbackRequest/FeedbackTabFeedback';
import { FeedbackCanvas } from '../blocks/FeedbackRequest/FeedbackCanvas';
import { unreadCheck } from '../utils/unreadCheck';
import { FeedbackAside, FeedbackLayout, FeedbackWorkspace } from '../blocks/FeedbackRequest/FeedbackLayout';

function toArray(arrayLike) {
    const newArray = [];

    if (arrayLike?.length) {
        for (let x = 0; x < arrayLike.length; x += 1) {
            newArray.push(arrayLike[x]);
        }
    }

    return newArray;
}

const SkeletonWorkspaceContent = ({ isMobile }) => (
    <>
        <Box $h="54" $px="14" $d="flex" $flexDir="row" $alignItems="center" $bg="bg-gray" $zIndex="2">
            {!isMobile && (
                <>
                    <Box $pl="6" />
                    <Box $ml="auto">
                        <Box $d="flex" $flexDir="row" $alignItems="center">
                            <Skeleton $w="44" $h="20" $mr="10" />
                            <Box>
                                <Skeleton $d="inline-block" $w="26" $h="26" $mr="6" />
                                <Skeleton $d="inline-block" $w="26" $h="26" />
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
        <Box $px="14" $flex={1} $bg="bg-gray" $h="100%" $zIndex="1" $overflow="hidden" $userSelect="none">
            <Skeleton $w="100%" $h="100%" $maxW="748" $maxH="70vh" $mx="auto" $my="0" />
        </Box>
    </>
);

const SkeletonCommentItem = ({ hasReply }) => (
    <Box $mb="20">
        <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="18">
            <Box $d="flex" $alignItems="center">
                <Skeleton $w="20" $h="20" $mr="14" />
                <Skeleton $w="103" $h="20" />
            </Box>
            <Skeleton $w="74" $h="20" />
        </Box>
        <Skeleton $w="100%" $h="100" />
        {hasReply && <Skeleton $w="52" $h="20" $mt="20" />}
    </Box>
);

const FeedbackRequest = ({ match, location, viewer, windowWidth }) => {
    const { data, loading, refetch } = useQuery(ORDER_FILES, {
        variables: {
            id: +match?.params?.id,
        },
    });

    const [activeTab, setActiveTab] = useState('feedback');
    const [abrt, setAbrt] = useState(null);
    const [refetching, setRefetching] = useState(false);
    const [activeComment, setActiveComment] = useState(null);
    const [isDownloadingFile, setIsDownloadingFile] = useState(false);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [query, setQuery] = useState(qs.parse(location.search));
    const [isShowComplete, setIsShowComplete] = useState(false);
    const [isShowReopen, setIsShowReopen] = useState(false);
    const [isShowRevision, setIsShowRevision] = useState(false);
    const [isShowResume, setIsShowResume] = useState(false);
    const [savedValues, setSavedValues] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const [addComment] = useMutation(ADD_COMMENT);
    const [createFeedback] = useMutation(CREATE_FEEDBACK);
    const [downloadFile] = useMutation(DOWNLOAD_FILE);
    const [readFeedback] = useMutation(READ_FEEDBACK);
    const [editFeedback] = useMutation(EDIT_FEEDBACK);
    const [editComment] = useMutation(EDIT_COMMENT);
    const [deleteFeedback] = useMutation(DELETE_FEEDBACK);
    const [deleteComment] = useMutation(DELETE_COMMENT);
    const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
    const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS);
    const [updateOrdersPriority] = useMutation(UPDATE_ORDERS_PRIORITY);
    const [reopenOrder] = useMutation(REOPEN_ORDER);

    const history = useHistory();

    const refetchFeedback = useCallback(async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    }, [refetch, setRefetching]);

    useEffect(() => {
        const updateReadBy = async () => {
            try {
                await readFeedback({
                    variables: {
                        fileFeedbackId: activeComment.id,
                    },
                });
                await refetchFeedback();
            } catch (err) {
                console.log(err);
            }
        };

        if (activeComment !== null) {
            const unreadDetailsComments = activeComment.comments?.filter(comment => unreadCheck(comment, viewer));
            const unreadCommentCount = unreadDetailsComments?.length ?? 0;
            const unreadFeedbackCount = unreadCheck(activeComment, viewer) ? 1 : 0;
            if (unreadCommentCount + unreadFeedbackCount > 0) {
                updateReadBy();
            }
        }
    }, [activeComment, viewer, refetchFeedback, readFeedback]);

    const getIsControlDisabled = useCallback(() => {
        const isCustomer = viewer?.role === USER_TYPE_CUSTOMER;
        const isRequestPaused = data?.Order?.status === ORDER_STATUS_ON_HOLD;
        const isRequestCompleted = data?.Order?.status === ORDER_STATUS_COMPLETED;
        const isRequestDelivered = [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION].indexOf(data?.Order?.status) > -1;
        const isControlDisabled = !isCustomer && (isRequestCompleted || isRequestPaused);
        return { isControlDisabled, isCustomer, isRequestCompleted, isRequestPaused, isRequestDelivered };
    }, [viewer, data]);

    const submitFeedbackOrComment = useCallback(async () => {
        const { _type, ...variables } = savedValues;
        if (_type === 'comment') {
            await addComment({
                variables,
            });
        } else {
            await createFeedback({
                variables,
            });
        }
        await refetchFeedback();
        setSavedValues(null);
    }, [addComment, createFeedback, refetchFeedback, savedValues]);

    const handleRequestReopen = useCallback(
        async values => {
            message.destroy();
            message.loading('Reopening request...', 50000);

            const variables = {
                // message: toHtml(values?.message),
                move: values.move,
                fileIds: values.fileIds,
                id: data?.Order?.id,
                status: ORDER_STATUS_ONGOING_REVISION,
            };

            await reopenOrder({ variables });
            await submitFeedbackOrComment();
            setIsShowReopen(false);

            message.destroy();
            message.success('Your request has been reopened');
        },
        [data, reopenOrder, submitFeedbackOrComment]
    );

    const handleRequestComplete = useCallback(
        async values => {
            message.destroy();
            message.loading('Completing request...', 50000);

            const variables = {
                ...values,
                id: data?.Order?.id,
                status: ORDER_STATUS_COMPLETED,
            };
            await markAsComplete({ variables });
            await submitFeedbackOrComment();
            setIsShowComplete(false);

            message.destroy();
            message.success('Request completed. Your feedback has been submitted');
        },
        [data, submitFeedbackOrComment, markAsComplete]
    );

    const handleRequestMove = useCallback(
        async value => {
            message.destroy();
            message.loading('Changing request...', 50000);

            await changeOrderStatus({
                variables: {
                    id: data?.Order?.id,
                    status: ORDER_STATUS_ONGOING_REVISION,
                },
            });

            await updateOrdersPriority({
                variables: {
                    orders: [{ id: data?.Order.id, priority: value === 'top' ? 1 : 499 }],
                },
            });
            await submitFeedbackOrComment();
            setIsShowReopen(false);
            setIsShowResume(false);
            setIsShowRevision(false);

            message.destroy();
            message.success('Your request status has been updated');
        },
        [data, changeOrderStatus, updateOrdersPriority, submitFeedbackOrComment]
    );

    const handleRevisionClickComplete = useCallback(() => {
        setIsShowRevision(false);
        setIsShowComplete(true);
    }, []);

    const handleCreateComment = useCallback(
        async values => {
            try {
                const { isCustomer, isRequestPaused, isRequestCompleted, isRequestDelivered } = getIsControlDisabled();

                if (isCustomer && (isRequestCompleted || isRequestPaused || isRequestDelivered)) {
                    setSavedValues({
                        ...values,
                        fileId: query.file,
                        orderId: +match?.params?.id,
                        _type: 'comment',
                    });
                    if (isRequestCompleted) {
                        setIsShowReopen(true);
                    }
                    if (isRequestPaused) {
                        setIsShowResume(true);
                    }
                    if (isRequestDelivered) {
                        setIsShowRevision(true);
                    }
                } else {
                    await addComment({
                        variables: {
                            ...values,
                            fileId: query.file,
                            orderId: +match?.params?.id,
                        },
                    });
                    await refetchFeedback();
                }
            } catch (err) {
                console.log(err);
            }
        },
        [addComment, refetchFeedback, getIsControlDisabled, query.file, match]
    );

    const handleCreateFeedback = useCallback(
        async values => {
            try {
                const { isCustomer, isRequestPaused, isRequestCompleted, isRequestDelivered } = getIsControlDisabled();

                if (isCustomer && (isRequestCompleted || isRequestPaused || isRequestDelivered)) {
                    setSavedValues({
                        ...values,
                        fileId: query.file,
                        orderId: +match?.params?.id,
                        _type: 'feedback',
                    });
                    if (isRequestCompleted) {
                        setIsShowReopen(true);
                    }
                    if (isRequestPaused) {
                        setIsShowResume(true);
                    }
                    if (isRequestDelivered) {
                        setIsShowRevision(true);
                    }
                } else {
                    await createFeedback({
                        variables: {
                            ...values,
                            fileId: query.file,
                            orderId: +match?.params?.id,
                        },
                    });
                    await refetchFeedback();
                }
            } catch (err) {
                console.log(err);
            }
        },
        [createFeedback, refetchFeedback, getIsControlDisabled, query.file, match]
    );

    const handleEditComment = useCallback(
        async values => {
            try {
                await editComment({
                    variables: values,
                });
                await refetchFeedback();
            } catch (err) {
                console.log(err);
            }
        },
        [editComment, refetchFeedback]
    );

    const abort = useCallback(() => {
        if (abrt) {
            abrt();
        }
        setDownloadProgress(0);
        setIsDownloadingFile(false);
    }, [abrt]);

    const handleEditFeedback = useCallback(
        async values => {
            try {
                await editFeedback({
                    variables: values,
                });
                await refetchFeedback();
            } catch (err) {
                console.log(err);
            }
        },
        [editFeedback, refetchFeedback]
    );

    const handleDownload = prcnt => {
        if (prcnt >= 100) {
            setIsDownloadingFile(false);
        } else {
            setDownloadProgress(prcnt);
        }
    };

    const handleDeleteComment = useCallback(
        async id => {
            try {
                await deleteComment({
                    variables: { id },
                });
                await refetchFeedback();
            } catch (err) {
                console.log(err);
            }
        },
        [deleteComment, refetchFeedback]
    );

    const handleDeleteFeedback = useCallback(
        async id => {
            try {
                await deleteFeedback({
                    variables: {
                        id,
                    },
                });
                await refetchFeedback();
            } catch (err) {
                console.log(err);
            }
        },
        [deleteFeedback, refetchFeedback]
    );

    const handleChangeActive = async comment => {
        setActiveComment(old => (old === null || old?.id !== comment.id ? comment : null));
    };

    const handleViewFile = fileId => {
        const requestId = data?.Order?.id;
        window.history.pushState('', '', `${FEEDBACK_REQUEST.replace(':id', requestId)}?file=${fileId}`);
        setQuery({ file: fileId });
        setIsLoadingFile(true);
        setTimeout(() => {
            setIsLoadingFile(false);
        }, 1000);
    };

    const isMobile = windowWidth <= 768;

    if (loading && !refetching) {
        return (
            <FeedbackLayout>
                <FeedbackWorkspace isMobile={isMobile}>
                    <Box
                        $px="20"
                        $py="14"
                        $d="flex"
                        $flexDir="row"
                        $borderB="1"
                        $borderBottomStyle="solid"
                        $borderBottomColor="outline-gray"
                        $alignItems={['center', 'flex-start']}
                    >
                        <Box $alignSelf="center" $pr="20">
                            <Skeleton $w="36" $h="36" />
                        </Box>
                        <Box $flex="1">
                            <Skeleton $w="100%" $maxW="300" $h="36" />
                            {!isMobile && <Skeleton $w="100%" $maxW="311" $mt="5" $h="20" />}
                        </Box>
                        <Box $ml="auto" $alignSelf="center" $pl="16">
                            <Skeleton $w={isMobile ? '34' : '190'} $h="34" />
                        </Box>
                    </Box>
                    <SkeletonWorkspaceContent isMobile={isMobile} />
                </FeedbackWorkspace>
                {!isMobile && (
                    <FeedbackAside isLoading={loading && !refetching}>
                        <Box
                            $d="flex"
                            $alignItems="center"
                            $justifyContent="space-between"
                            $px="20"
                            $pt="22"
                            $pb="13"
                            $borderB="1"
                            $borderBottomStyle="solid"
                            $borderBottomColor="outline-gray"
                        >
                            <Box $d="flex" $alignItems="center">
                                <Skeleton $w="67" $h="20" $mr="26" />
                                <Skeleton $w="67" $h="20" />
                            </Box>
                            <Skeleton $w="20" $h="20" />
                        </Box>
                        <Box $overflow="hidden" $px="34" $pt="32">
                            <SkeletonCommentItem />
                            <SkeletonCommentItem />
                            <SkeletonCommentItem hasReply />
                            <SkeletonCommentItem hasReply />
                            <SkeletonCommentItem />
                            <SkeletonCommentItem />
                        </Box>
                    </FeedbackAside>
                )}
            </FeedbackLayout>
        );
    }
    const previews = data?.Order?.previews ?? [];
    const allFiles = previews.reduce((prev, { files }) => [...prev, ...files], []).concat(data?.Order?.attachments);
    const file = allFiles.find(({ id }) => query.file === id);
    const requestName = data?.Order?.name;
    const files = toArray(data?.Order?.attachments);
    const size = files ? files.reduce((acc, f) => acc + parseInt(f.size), 0) : 0;

    const previewsFinal = toArray(previews);

    previewsFinal.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    const updatedAttachment = files.length ? files.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)) : [];

    const folders = [{ size, id: 'attachments', updatedAt: updatedAttachment.updatedAt, name: 'Discussion Attachments', files }].concat(previewsFinal);
    const handleClickDownload = async () => {
        setIsDownloadingFile(true);
        if (!file?.url.includes('.cloudfront.net')) {
            await downloadFile({ variables: { id: file.id } })
                .then(({ data }) => {
                    downloadSingleFile(data?.downloadFile?.signedURL, file.name, requestName, 'file', handleDownload, setAbrt);
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
                const downloadFile = await downloadUrlWithProgressToBlob(file.url, ({ received, total }) => handleDownload((received / total) * 100), setAbrt);
                saveAs(downloadFile, file.name);
            } catch (err) {
                if (!err.name === 'AbortError') {
                    console.log(err);
                    message.destroy();
                    message.error(err);
                }
            }
        }
    };

    const handleBackNavigation = () => {
        // Get information from URL
        const parsed = qs.parse(window.location.search);
        const requestId = data?.Order?.id;

        // Go back in folder if url has folder
        if (parsed?.folder) {
            history.push(`${DETAIL_REQUEST.replace(':id', requestId)}?folder=${parsed?.folder}&tab=files`);
        } else {
            history.push(`${DETAIL_REQUEST.replace(':id', requestId)}?tab=files`);
        }
    };

    const unreadFeedback = Array.isArray(file?.feedback)
        ? file.feedback.filter(feed => {
              const unreadDetailsComments = feed.comments?.filter(comment => unreadCheck(comment, viewer));
              const unreadCommentCount = unreadDetailsComments?.length ?? 0;
              const unreadFeedbackCount = unreadCheck(feed, viewer) ? 1 : 0;
              return unreadCommentCount + unreadFeedbackCount > 0;
          }).length
        : 0;

    return (
        <DocumentTitle title={`#${+match?.params?.id} ${file?.name ?? ''} | ManyPixels`}>
            <FeedbackLayout>
                <Popup
                    open={isShowResume}
                    onCancel={() => setIsShowResume(false)}
                    $variant="default"
                    title="Resume request"
                    width={500}
                    destroyOnClose
                    centered
                    footer={null}
                >
                    <FormResumeRequest onChange={handleRequestMove} />
                </Popup>
                <Popup
                    open={isShowReopen}
                    onCancel={() => setIsShowReopen(false)}
                    $variant="default"
                    width={500}
                    title="Reopen request"
                    destroyOnClose
                    centered
                    footer={null}
                >
                    <FormReopenRequest hideInputMessage onSuccessSubmit={handleRequestReopen} />
                </Popup>
                <Popup
                    open={isShowComplete}
                    onCancel={() => setIsShowComplete(false)}
                    $variant="default"
                    width={500}
                    destroyOnClose
                    centered
                    closable={false}
                    footer={null}
                >
                    <FormRequestComplete onSuccessSubmit={handleRequestComplete} />
                </Popup>
                <Popup
                    open={isShowRevision}
                    onCancel={() => setIsShowRevision(false)}
                    $variant="default"
                    width={500}
                    title="Revisions needed?"
                    destroyOnClose
                    centered
                    footer={null}
                >
                    <FormDeliveredRevision onChangeMove={handleRequestMove} onClickComplete={handleRevisionClickComplete} />
                </Popup>
                <FeedbackWorkspace isMobile={isMobile}>
                    <Box $d="flex" $flexDir="column" $borderB="1" $borderBottomStyle="solid" $borderBottomColor="outline-gray">
                        <Box $px="20" $py="14" $d="flex" $flexDir="row">
                            <Box $alignSelf="center" $pr="20">
                                <Button
                                    $w="36"
                                    $h="36"
                                    mobileH="36"
                                    type="default"
                                    className="ant-btn ant-btn-default"
                                    // as={Link}
                                    onClick={handleBackNavigation}
                                    icon={<IconLeftArrow />}
                                />
                            </Box>
                            <Box $minW="0">
                                <Text $isTruncate $textVariant="H4">
                                    {file?.name}
                                </Text>
                                {!isDownloadingFile && (
                                    <Text hide="mobile" $textVariant="P4" $colorScheme="secondary">
                                        Click anywhere on the design to leave a comment.
                                    </Text>
                                )}
                            </Box>
                            <Box $ml="auto" $alignSelf="center" $pl="16">
                                {!isDownloadingFile &&
                                    (isMobile ? (
                                        <Button icon={<IconDownload />} loading={isDownloadingFile} onClick={handleClickDownload} />
                                    ) : (
                                        <Button type="primary" loading={isDownloadingFile} onClick={handleClickDownload}>
                                            Download
                                        </Button>
                                    ))}
                                {isDownloadingFile && (
                                    <Box
                                        $fontSize="30"
                                        $colorScheme="tertiary"
                                        _hover={{ $colorScheme: 'cta' }}
                                        onClick={e => {
                                            e.preventDefault();
                                            abort();
                                        }}
                                    >
                                        <CloseIcon />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        {isDownloadingFile && (
                            <Box $pr="20" $pl="75" $pb="14" $d="flex" $flexDir="row" $flexWrap="wrap">
                                <Progress showInfo={false} size="small" strokeColor={blue[4]} percent={downloadProgress} />
                            </Box>
                        )}
                    </Box>
                    {isLoadingFile ? (
                        <SkeletonWorkspaceContent />
                    ) : (
                        <FeedbackCanvas
                            name={file?.name}
                            src={file?.url}
                            comments={file?.feedback ?? []}
                            activeComment={activeComment}
                            onCreateComment={handleCreateComment}
                            onCreateFeedback={handleCreateFeedback}
                            onEditComment={handleEditComment}
                            onEditFeedback={handleEditFeedback}
                            onDeleteComment={handleDeleteComment}
                            onDeleteFeedback={handleDeleteFeedback}
                            onActiveCommentChange={setActiveComment}
                            onClickDownload={handleClickDownload}
                            isDownloadingFile={isDownloadingFile}
                            viewer={viewer}
                            isMobile={isMobile}
                            isControlDisabled={getIsControlDisabled().isControlDisabled}
                        />
                    )}
                </FeedbackWorkspace>
                {!isMobile && (
                    <FeedbackAside
                        minimized={({ setOpen }) => (
                            <>
                                <Button
                                    type="ghost"
                                    icon={
                                        <Box $fontSize="24" $lineH="1" $pos="relative" $colorScheme="primary">
                                            {unreadFeedback > 0 && (
                                                <Box $pos="absolute" $top="-50%" $right="-50%">
                                                    <Badge $isNotification>{unreadFeedback}</Badge>
                                                </Box>
                                            )}
                                            <IconFeedback />
                                        </Box>
                                    }
                                    $mb="28"
                                    onClick={() => {
                                        setOpen(true);
                                        setActiveTab('feedback');
                                    }}
                                />
                                <Button
                                    type="ghost"
                                    icon={
                                        <Box $fontSize="24" $lineH="1" $colorScheme="primary">
                                            <IconFiles />
                                        </Box>
                                    }
                                    onClick={() => {
                                        setOpen(true);
                                        setActiveTab('files');
                                    }}
                                />
                            </>
                        )}
                    >
                        <Tabs
                            activeKey={activeTab}
                            renderTabBar={(props, DefaultTabBar) => {
                                return (
                                    <Box
                                        $px={['14', '20']}
                                        $h="55"
                                        $d="flex"
                                        $alignItems="flex-end"
                                        $borderB="1"
                                        $borderBottomStyle="solid"
                                        $borderBottomColor="outline-gray"
                                    >
                                        <DefaultTabBar {...props} />
                                    </Box>
                                );
                            }}
                            onChange={setActiveTab}
                        >
                            <Tabs.TabPane
                                key="feedback"
                                tab={
                                    <Text $d="inline-flex" $alignItems="center">
                                        Feedback{' '}
                                        {unreadFeedback > 0 && (
                                            <Badge $isNotification $ml="6">
                                                {unreadFeedback}
                                            </Badge>
                                        )}
                                    </Text>
                                }
                            >
                                <FeedbackTabFeedback
                                    viewer={viewer}
                                    activeComment={activeComment}
                                    comments={file?.feedback ?? []}
                                    onChangeActive={handleChangeActive}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane key="files" tab="Files">
                                <FeedbackTabFile
                                    requestName={requestName}
                                    folders={folders}
                                    selectedFile={file}
                                    onViewFile={handleViewFile}
                                    viewer={viewer}
                                    request={data?.Order}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </FeedbackAside>
                )}
            </FeedbackLayout>
        </DocumentTitle>
    );
};

export default withLoggedUser(withResponsive(FeedbackRequest));
