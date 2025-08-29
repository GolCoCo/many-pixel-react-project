import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Drawer } from '@components/Drawer';
import { ME_NOTIFICATIONS } from '@graphql/queries/userConnected';
import { NB_NOTIFICATIONS_NOT_READ } from '@graphql/queries/notification';
import { READ_NOTIFICATION, MARK_ALL_AS_READ } from '@graphql/mutations/notification';
import { NOTIFICATIONS } from '@constants/routes';
import { Link } from '@components/Link';
import NotificationsEmpty from '@components/NotificationsEmpty';
import { Skeleton } from '@components/Skeleton';
import { notificationsType } from '@constants/enums';
import { timeSince } from '@constants/time';
import IconExternal from '@components/Svg/IconExternal';
import { SUBSCRIBE_NB_NOTIFICATIONS_NOT_READ } from '@graphql/subscriptions/notification';
import blueRightArrow from '@public/assets/icons/blue-right-arrow.svg';
import { useCustomSubscription } from '@utils/useCustomSubscription';

const notificationSkeleton = [];
for (let i = 1; i <= 10; i += 1) {
    notificationSkeleton.push(
        <Box key={i} $pt="12" $pr="20" $ml="20" $borderW="0" $borderStyle="solid" $borderColor="outline-gray" $borderB="1">
            <Skeleton $w="57" $h="18" $mb="6" />
            <Skeleton $w="100%" $h="40" $mb="12" />
        </Box>
    );
}

const NotificationsDrawer = ({ handleNotificationsVisible, showNotificationsDrawer, userId }) => {
    const {
        loading,
        data = {},
        refetch,
        updateQuery,
    } = useQuery(ME_NOTIFICATIONS, {
        variables: {
            first: 10,
        },
        fetchPolicy: 'cache-and-network',
    });
    const {
        loading: totalUnreadLoading,
        data: totalUnreads = {},
        refetch: unreadRefetch,
    } = useQuery(NB_NOTIFICATIONS_NOT_READ, {
        variables: { userId },
    });

    const subscription = useCustomSubscription({
        query: SUBSCRIBE_NB_NOTIFICATIONS_NOT_READ,
        variables: { viewerId: userId },
        handleNext: data => {
            if (!data) return;
            refetch();
            updateQuery(result => {
                return {
                    ...result,
                    user: {
                        ...result.user,
                        notifications: [...result.user?.notifications, data.data.receiveNotification].slice(1),
                    },
                };
            });
        },
    });

    useEffect(() => {
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const [readNotification] = useMutation(READ_NOTIFICATION);
    const [markAllReadNotification] = useMutation(MARK_ALL_AS_READ);

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

    const handleReadNotification = async (data, openNewTab = false) => {
        if (!data.isRead) {
            setSelectedNotification(data.id);
            await readNotification({ variables: { id: data.id } });
            await unreadRefetch();
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
        await unreadRefetch();
        setIsMarkingAllRead(false);

        // The vignette can be display none instead of just refetching the entire data
        // This is certainly not the best way but that the simplest and the less costly for the server
        const vignetteElements = document.querySelectorAll('.vignette');
        vignetteElements.forEach(element => {
            const el = element;
            el.style.display = 'none';
        });
    };

    return (
        <Drawer
            width={420}
            title={
                <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                    <Box $d="flex" $alignItems="center">
                        <Text $textVariant="H5" $colorScheme="black" $mr="8">
                            Notifications
                        </Text>
                        {!totalUnreadLoading && totalUnreads._allNotificationsMeta.count > 0 && (
                            <Box
                                $d="inline-block"
                                $bg="other-pink"
                                $colorScheme="white"
                                $radii="12"
                                $textAlign="center"
                                $textVariant="SmallTitle"
                                $py="3"
                                $px="7"
                                $minW="29"
                                $minH="20"
                            >
                                {totalUnreads._allNotificationsMeta.count}
                            </Box>
                        )}
                    </Box>
                    {!totalUnreadLoading && totalUnreads._allNotificationsMeta.count > 0 && (
                        <Text $textVariant="H6" $colorScheme={isMarkingAllRead ? 'secondary' : 'cta'} $cursor="pointer" onClick={handleReadAllNotifications}>
                            {isMarkingAllRead && <Spin indicator={<Icon component={LoadingOutlined} style={{ fontSize: 12, marginRight: 4 }} spin />} />}
                            Mark all as read
                        </Text>
                    )}
                </Box>
            }
            placement="right"
            onClose={handleNotificationsVisible}
            open={showNotificationsDrawer}
        >
            <Box $pos="relative" $pb="51">
                {loading ? (
                    <>{notificationSkeleton}</>
                ) : (
                    <>
                        {data?.user?.notifications.map(notification => (
                            <Box key={notification.id} $bg="white" $cursor="pointer" className="hover-blue" onClick={() => handleReadNotification(notification)}>
                                <Box $pt="12" $pr="20" $ml="20" $borderW="0" $borderStyle="solid" $borderColor="outline-gray" $borderB="1">
                                    <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="6">
                                        <Box $d="flex" $justifyContent="space-between" $alignItems="center" $w="23%">
                                            <Text $textVariant="P5" $colorScheme="secondary">
                                                {timeSince(notification.createdAt)}
                                            </Text>
                                            {!notification.isRead && selectedNotification !== notification.id && (
                                                <Box $w="10" $h="10" $bg="other-pink" $radii="100%" />
                                            )}
                                            {selectedNotification === notification.id && (
                                                <Spin indicator={<Icon component={LoadingOutlined} style={{ fontSize: 12 }} spin />} />
                                            )}
                                        </Box>
                                        <Box
                                            $fontSize="16"
                                            $colorScheme="cta"
                                            _hover={{ $colorScheme: 'icon' }}
                                            onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleReadNotification(notification, true);
                                            }}
                                        >
                                            <IconExternal />
                                        </Box>
                                    </Box>
                                    <Text
                                        $textVariant="P4"
                                        $colorScheme={notification.isRead ? 'secondary' : 'primary'}
                                        $mb="12"
                                        dangerouslySetInnerHTML={{ __html: notification.text }}
                                    />
                                </Box>
                            </Box>
                        ))}
                        {data?.user?.notifications.length > 0 && (
                            <Box $textAlign="right" $px="20" $py="15" $boxShadow="0px -2px 8px rgba(0, 0, 0, 0.1)" $pos="fixed" $w="420" $bottom="0" $bg="white">
                                <Text as={Link} to={NOTIFICATIONS} $d="inline-block" $textVariant="Badge" $colorScheme="cta" $cursor="pointer">
                                    <Box $d="inline-block" $mr="12">
                                        See all notifications
                                    </Box>
                                    <img src={blueRightArrow} alt="Blue right arrow" />
                                </Text>
                            </Box>
                        )}
                        {data?.user?.notifications.length < 1 && (
                            <Box $px="19" $py="19">
                                <NotificationsEmpty />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default NotificationsDrawer;
