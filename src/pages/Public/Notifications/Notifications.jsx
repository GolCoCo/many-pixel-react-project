import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { ME_NOTIFICATIONS } from '@graphql/queries/userConnected';
import { NB_NOTIFICATIONS_NOT_READ } from '@graphql/queries/notification';
import { READ_NOTIFICATION, MARK_ALL_AS_READ } from '@graphql/mutations/notification';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Pagination } from '@components/Pagination';
import withLoggedUser from '@components/WithLoggedUser';
import NotificationsEmpty from '@components/NotificationsEmpty';
import { Skeleton } from '@components/Skeleton';
import DocumentTitle from '@components/DocumentTitle';
import { notificationsType } from '@constants/enums';
import { timeSince } from '@constants/time';
import Avatar from '@components/Avatar';
import * as qs from 'query-string';
import { useHistory, } from 'react-router-dom';
import IconExternal from '@components/Svg/IconExternal';


const notificationSkeleton = [];
for (let i = 1; i <= 10; i++) {
    notificationSkeleton.push(
        <Box key={i} $d="flex" $borderW="0" $borderStyle="solid" $borderColor="outline-gray" $borderB="1" $py="16">
            <Box $mr="16">
                <Skeleton $variant="avatar" avatarSize="40" />
            </Box>
            <Box $flex="1 1 0%">
                <Skeleton $w="55" $h="16" $mb="3" />
                <Skeleton $w="100%" $h="16" />
            </Box>
        </Box>
    );
}

const Notifications = ({ viewer }) => {

    const parsed = qs.parse(window.location.search);
    const [page, setPage] = useState(parsed.page ? parseInt(parsed.page) : 1);
    const [nbByPages, setNbByPages] = useState(parsed.pageSize ? parseInt(parsed.pageSize) : 10);

    const offset = (page - 1) * nbByPages
    const { push } = useHistory();

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [hoveredNotification, setHoveredNotification] = useState(null);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
    const [dataSource, setDataSource] = useState(null);

    const changeParams = useCallback((newParams) => {
        const location = window.location;
        const parsed = qs.parse(window.location.search);
        const stringify = qs.stringify(Object.assign(parsed, newParams));
        push({
            pathname: location.pathname,
            search: stringify,
        })
    }, [push])

    const [readNotification] = useMutation(READ_NOTIFICATION, {
        refetchQueries: [{ query: NB_NOTIFICATIONS_NOT_READ, variables: { userId: viewer.id } }],
    });
    const [markAllReadNotification] = useMutation(MARK_ALL_AS_READ, {
        refetchQueries: [{ query: NB_NOTIFICATIONS_NOT_READ, variables: { userId: viewer.id } }],
    });

    const { loading, data = {}, refetch  } = useQuery(ME_NOTIFICATIONS, {
        variables: {
            first: nbByPages,
            skip: offset,
        },
        fetchPolicy: 'cache-and-network'
    });


    const { loading: totalUnreadLoading, data: totalUnreads = {} } = useQuery(NB_NOTIFICATIONS_NOT_READ, {
        variables: { userId: viewer.id },
    });

    useEffect(() => {
        if (!loading) {
            setDataSource({
                notifications: data?.user?.notifications,
                count: data?.user?._notificationsCount,
            });
        }
    }, [data, loading]);

    const handleHoverNotification = id => {
        if (id && hoveredNotification !== id) {
            setHoveredNotification(id);
        } else if (!id) {
            setHoveredNotification(null);
        }
    };

    const handleReadNotification = async (data, openNewTab = false) => {
        if (!data.isRead) {
            setSelectedNotification(data.id);
            await readNotification({ variables: { id: data.id } });
            setSelectedNotification(null);
        }

        if (data.type && data.metaId) {
            const notifType = notificationsType[data.type];
            if (notifType) {
                notifType.action(data.metaId, data.fileId, openNewTab);
            }
        }
    };

    const handleReadAllNotifications = async () => {
        setIsMarkingAllRead(true);
        await markAllReadNotification();
        await refetch();
        setIsMarkingAllRead(false);
    };

    const handleChangePageSize = async num => {
        setNbByPages(num)
        changeParams({ pageSize: num, page: 1 });
    };

    const handleChangePage = async num => {
        setPage(num)
        changeParams({ page: num });
    };

    return (
        <DocumentTitle title="Notifications | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1200">
                    <Box $d="flex" $mb="14" $justifyContent="space-between" $alignItems="center">
                        <Text $textVariant="H3" $colorScheme="headline" hide="mobile">
                            Notifications
                        </Text>
                        <Text $textVariant="H4" $colorScheme="headline" hide="desktop">
                            Notifications
                        </Text>
                        {!totalUnreadLoading && totalUnreads._allNotificationsMeta.count > 0 && (
                            <Text
                                $textVariant="PrimaryButton"
                                $colorScheme={isMarkingAllRead ? 'secondary' : 'cta'}
                                $cursor="pointer"
                                onClick={handleReadAllNotifications}
                            >
                                {isMarkingAllRead && (
                                    <Spin
                                        indicator={
                                            <Icon component={LoadingOutlined} style={{ fontSize: 12, marginRight: 4 }} spin />
                                        }
                                    />
                                )}
                                Mark all as read
                            </Text>
                        )}
                    </Box>
                    <Box>
                        {loading ? (
                            <>
                                {notificationSkeleton}
                                <Box $d="flex" $justifyContent="flex-end" $gap="8px" $mt="20px">
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <Skeleton $w="40" $h="40" />
                                    ))}
                                    <Skeleton $w="87" $h="40" />
                                </Box>
                            </>
                        ) : (
                            <>
                                {dataSource?.notifications.map(notification => (
                                    <Box
                                        key={notification.id}
                                        $d="flex"
                                        $borderW="0"
                                        $borderStyle="solid"
                                        $borderColor="outline-gray"
                                        $borderB="1"
                                        $py="16"
                                        $cursor="pointer"
                                        $pos="relative"
                                        onClick={() => handleReadNotification(notification)}
                                        onMouseOver={() => handleHoverNotification(notification.id)}
                                        onMouseLeave={() => handleHoverNotification(null)}
                                        $bg={hoveredNotification === notification.id ? 'badge-blue' : 'white'}
                                    >
                                        <Box $mr="16">
                                            <Avatar
                                                size={40}
                                                src={notification?.creator?.picture?.url}
                                                name={`${notification?.creator?.firstname ?? ''} ${notification?.creator
                                                    ?.lastname ?? ''}`}
                                            />
                                        </Box>
                                        <Box>
                                            <Box $d="flex" $flexDir="row" $alignItems="center" $justifyContent="space-between" $pr="8">
                                                <Text $textVariant="P5" $colorScheme="secondary">
                                                    {timeSince(notification.createdAt)}
                                                </Text>
                                                <Box
                                                    $fontSize="24"
                                                    $colorScheme="tertiary"
                                                    _hover={{ $colorScheme: 'cta' }}
                                                    hide="desktop"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        handleReadNotification(notification, true)
                                                    }}
                                                    >
                                                    <IconExternal />
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Text
                                                    $d="inline"
                                                    $textVariant="P4"
                                                    $colorScheme={notification.isRead ? 'secondary' : 'primary'}
                                                    dangerouslySetInnerHTML={{ __html: notification.text }}
                                                    $mr="8"
                                                />
                                                {!notification.isRead && selectedNotification !== notification.id && (
                                                    <Box $d="inline-block" $w="10" $h="10" $bg="other-pink" $radii="100%" />
                                                )}
                                                {selectedNotification === notification.id && (
                                                    <Spin
                                                        indicator={
                                                            <Icon component={LoadingOutlined} style={{ fontSize: 12 }} spin />
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <Box
                                            $fontSize="24"
                                            $colorScheme="cta"
                                            _hover={{ $colorScheme: "icon" }}
                                            $pos="absolute"
                                            $right="8"
                                            hide="mobile"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleReadNotification(notification, true)
                                            }}
                                            >
                                            <IconExternal />
                                        </Box>
                                    </Box>
                                ))}
                                {dataSource?.notifications.length < 1 && <NotificationsEmpty />}
                            </>
                        )}
                    </Box>
                    {dataSource?.notifications.length > 0 && (
                        <Box $d="flex" $justifyContent={['center', 'flex-end']} $alignItems="center" $mt="20">
                            <Pagination
                                showLessItems
                                showSizeChanger
                                pageSize={nbByPages}
                                onShowSizeChange={(current, choice) => handleChangePageSize(choice)}
                                current={page}
                                onChange={newPage => handleChangePage(newPage)}
                                total={dataSource?.count ? dataSource?.count : 0}
                            />
                        </Box>
                    )}
                </PageContainer>
            </Basepage>
</DocumentTitle>
    );
};

export default withLoggedUser(Notifications);
