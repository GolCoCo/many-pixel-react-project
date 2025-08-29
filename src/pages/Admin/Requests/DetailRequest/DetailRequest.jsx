import React, { memo, useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { REQUESTS } from '@constants/routes';
import { USER_TYPE_WORKER } from '@constants/account';
import { Link } from '@components/Link';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import * as qs from 'query-string';
import { createGlobalStyle } from 'styled-components';
import withLoggedUser from '@components/WithLoggedUser';
import { Skeleton } from '@components/Skeleton';
import DocumentTitle from '@components/DocumentTitle';
import message from '@components/Message';
import { useHistory } from 'react-router-dom';
import { ORDER } from '@graphql/queries/order';
import { CHANGE_ORDER_STATUS } from '@graphql/mutations/order';
import { USERS_FOR_REQUEST } from '@graphql/queries/user';
import { ORDER_STATUS_LABELS } from '@constants/order';
import ArrowDownIcon from '@components/Svg/ArrowDown';
import { MySkeleton } from '@pages/Customer/Requests/DetailRequest/DetailRequest';
import { Tooltip } from 'antd';
import DetailContent from '../blocks/DetailRequest/DetailContent';
import SubscriptionInactive from '../blocks/SubscriptionInactive';
import { MessageContext } from '../blocks/DetailRequest/MessageContext';
import { DetailContext } from '../blocks/DetailRequest/DetailContext';
import DesignersField from '../blocks/DetailRequest/DesignersField';
import { StatusSelect } from '../blocks/DetailRequest/StatusSelect';

// left: 50%;
// transform: translateY(-100%) translateX(-50%);

const GlobalStyle = createGlobalStyle`
    .ant-tooltip-placement-bottomLeft .ant-tooltip-arrow  {
        left: 50%;
        transform: translateY(-100%) translateX(-50%);
    }
    .ant-tooltip:not(.ant-default-tooltip-overlay) .ant-tooltip-content {
        box-shadow: 4px -7px 8px rgba(0, 0, 0, 0.1);
    }
`;

function toArray(arrayLike) {
    const newArray = [];

    if (arrayLike?.length) {
        for (let x = 0; x < arrayLike.length; x += 1) {
            newArray.push(arrayLike[x]);
        }
    }

    return newArray;
}

const DetailRequest = memo(({ viewer, match }) => {
    const [activeFolderId, setActiveFolderId] = useState(() => {
        const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        return parsed.folder ?? null;
    });

    const statusRef = useRef(null);
    const [activeTab, setTab] = useState(() => {
        const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        return parsed.tab ?? 'messages';
    });

    const setActiveTab = tab => {
        let parsed = qs.parse(window.location.search);
        parsed.tab = tab;
        if (parsed.folder && tab !== 'files') {
            setActiveFolderId(null);
            delete parsed.folder;
        }
        const location = window.location;
        const stringify = qs.stringify(parsed);
        setTab(tab);

        window.history.pushState('', '', `${location.pathname}?${stringify}`);
    };

    const history = useHistory();

    const [refetching, setRefetching] = useState(false);
    const [isOpenStatusSelect, setIsOpenStatusSelect] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const { params } = match;
    const viewerId = viewer?.id;
    const viewerRole = viewer?.role;
    const { data, loading, refetch } = useQuery(ORDER, {
        variables: {
            id: +params?.id,
        },
        fetchPolicy: 'network-only',
    });
    const { data: usersData } = useQuery(USERS_FOR_REQUEST, {
        variables: {
            where: {
                role: { in: ['owner', 'manager', 'worker'] },
                isArchived: false,
                id: {
                    not: {
                        equals: viewerId,
                    },
                },
            },
        },
        fetchPolicy: 'network-only',
    });
    const [updateOrderStatus] = useMutation(CHANGE_ORDER_STATUS);

    const request = {
        ...data?.Order,
    };
    const files = data?.Order?.attachments;
    const size = files ? files.reduce((acc, f) => acc + parseInt(f.size), 0) : 0;

    const previewsFinal = toArray(request.previews);
    previewsFinal.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    const folders = [{ id: 'attachments', size, name: 'Discussion Attachments', files }].concat(previewsFinal);
    if (files?.length) {
        folders[0].createdAt = files[0]?.createdAt;
        folders[0].updatedAt = files[files.length - 1]?.updatedAt;
    }
    const users = usersData?.allUsers ?? [];

    const isSubscriptionActive = true;
    const isSubscriptionPaused = false;

    const designerIds = request?.workers && request?.workers?.length > 0 ? request?.workers?.map(worker => worker.id) : undefined;
    const dateNow = moment().startOf('day');
    const lastPrioritized = request?.prioritizedAt ? moment(request?.prioritizedAt).startOf('day') : null;
    const dateDiff = request?.prioritizedAt ? dateNow.diff(lastPrioritized, 'days') : null;
    const checkOngoingSubmittedStatus = request.status === 'ONGOING_PROJECT' || request.status === 'SUBMITTED' ? 'pointer' : 'default';
    const defaultPointer = viewerRole === USER_TYPE_WORKER ? checkOngoingSubmittedStatus : 'pointer';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleClickOutside = ev => {
            if (statusRef.current instanceof HTMLDivElement && !statusRef.current.contains(ev.target)) {
                setIsOpenStatusSelect(false);
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isOpenStatusSelect]);

    useEffect(() => {
        if (activeFolderId) {
            setActiveTab('files');
        }
    }, [activeFolderId]);

    const refetchRequests = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    const handleShowStatusSelect = bool => {
        if (viewerRole === USER_TYPE_WORKER) {
            if (['ONGOING_PROJECT', 'ONGOING_REVISION', 'SUBMITTED', 'DELIVERED_PROJECT', 'DELIVERED_REVISION'].includes(request.status)) {
                setIsOpenStatusSelect(bool);
            }
        } else {
            setIsOpenStatusSelect(bool);
        }
    };

    const handleChangeOrderStatus = async val => {
        setIsOpenStatusSelect(false);
        setIsUpdatingStatus(true);
        message.destroy();
        message.loading('Updating status...', 50000);
        await updateOrderStatus({
            variables: {
                id: request.id,
                status: val,
            },
        })
            .then(async () => {
                await refetch();
                message.destroy();
                message.success('Status has been updated');
                setIsUpdatingStatus(false);
            })
            .catch(e => {
                console.log(e);
                message.destroy();
                message.error('Error on updating request status');
                setIsUpdatingStatus(false);
            });
    };

    if (!(data?.Order && usersData?.allUsers)) {
        return (
            <Basepage>
                <MySkeleton />
            </Basepage>
        );
    }

    return (
        <DocumentTitle title={`#${+params?.id} ${request?.name ?? ''} | ManyPixels`}>
            <DetailContext.Provider
                value={{
                    folders,
                    request,
                    refetchRequests,
                    activeTab,
                    setActiveTab,
                    isSubscriptionPaused,
                    viewerId,
                    viewerRole,
                    activeFolderId,
                    users,
                    setActiveFolderId,
                }}
            >
                <MessageContext.Provider value={{ messages: [] }}>
                    <Basepage>
                        {loading && !refetching ? (
                            <MySkeleton />
                        ) : (
                            <PageContainer $maxW="1288" $d="flex" $flexDir="row">
                                <Box $pt="4">
                                    <Button
                                        $w="36"
                                        $h="36"
                                        mobileH="36"
                                        type="default"
                                        className="ant-btn ant-btn-default"
                                        onClick={history.goBack}
                                        icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                    />
                                </Box>
                                <Box $pl="20" $flex="1" $h="100%">
                                    <Box>
                                        <Box $d="flex" $alignItems="flex-start" $justifyContent="space-between">
                                            <Tooltip
                                                overlayStyle={{
                                                    paddingTop: '2px',
                                                    minHeight: '32px',
                                                    borderRadius: '4px',
                                                    maxWidth: '100%',
                                                }}
                                                color="white"
                                                title={
                                                    <Text $textVariant="Badge" $whiteSpace="nowrap">
                                                        {request.name}
                                                    </Text>
                                                }
                                                // align={{
                                                //     points: ['tl', 'bl'],
                                                // }}
                                                placement="bottomLeft"
                                                // overlayClassName="ant-default-tooltip-overlay"
                                                trigger="hover"
                                            >
                                                <Text $textVariant="H3" $colorScheme="headline" $mb="12" $cursor="default" $maxW="660" $isTruncate>
                                                    {request.name}
                                                </Text>
                                            </Tooltip>
                                            <GlobalStyle />
                                            <Box $d="flex" $alignItems="center">
                                                <DesignersField
                                                    requestId={request.id}
                                                    designerIds={designerIds}
                                                    requestStatus={request.status}
                                                    isWorker={viewerRole === USER_TYPE_WORKER}
                                                />
                                                {isSubscriptionActive && (
                                                    <Box $pos="relative">
                                                        <Box
                                                            $ml="16"
                                                            $cursor={defaultPointer}
                                                            style={{
                                                                pointerEvents: isUpdatingStatus ? 'none' : 'auto',
                                                            }}
                                                            onClick={() => handleShowStatusSelect(!isOpenStatusSelect)}
                                                        >
                                                            <Badge $variant={ORDER_STATUS_LABELS[request.status]}>
                                                                {ORDER_STATUS_LABELS[request.status]}

                                                                <Box
                                                                    $ml="9"
                                                                    $d="inline-block"
                                                                    $w="20"
                                                                    $h="20"
                                                                    $transform={isOpenStatusSelect ? 'rotate(180deg)' : 'rotate(0deg)'}
                                                                >
                                                                    <ArrowDownIcon />
                                                                </Box>
                                                            </Badge>
                                                        </Box>

                                                        <StatusSelect
                                                            ref={statusRef}
                                                            isOpenStatusSelect={isOpenStatusSelect}
                                                            requestStatus={request.status}
                                                            handleChangeOrderStatus={handleChangeOrderStatus}
                                                            isWorker={viewerRole === USER_TYPE_WORKER}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box $d="flex" $alignItems="center" $mb="16">
                                            <Box>
                                                <Breadcrumb>
                                                    <BreadcrumbItem isFirst as={Link} to={REQUESTS}>
                                                        Requests
                                                    </BreadcrumbItem>
                                                    <BreadcrumbItem>Details</BreadcrumbItem>
                                                </Breadcrumb>
                                            </Box>
                                            <Box $mx="10" $h="20" $w="1" $bg="outline-gray" />
                                            <Box>
                                                <Text $textVariant="H6" $colorScheme="cta" $lineH="20">
                                                    #{request.id}
                                                </Text>
                                            </Box>
                                            {dateDiff !== null && dateDiff < 1 ? (
                                                <>
                                                    <Box $mx="10" $h="20" $w="1" $bg="outline-gray" />
                                                    <Text $textVariant="P4" $colorScheme="other-red">
                                                        Priority Request
                                                    </Text>
                                                </>
                                            ) : null}
                                        </Box>
                                    </Box>
                                    {isSubscriptionActive ? (
                                        <Box>
                                            <DetailContent activeFolderId={activeFolderId} />
                                        </Box>
                                    ) : (
                                        <SubscriptionInactive spaceTop="153">
                                            This request and its associated files have been deleted as you are no longer an active subscriber. To submit new
                                            requests, please subscribe to a plan first.
                                        </SubscriptionInactive>
                                    )}
                                </Box>
                            </PageContainer>
                        )}
                    </Basepage>
                </MessageContext.Provider>
            </DetailContext.Provider>
        </DocumentTitle>
    );
});

export default withLoggedUser(DetailRequest);
