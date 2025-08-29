import React, { useCallback, useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import message from '@components/Message';
import { ItemMessageDetail } from './ItemMessageDetail.jsx';
import { MessageNewBorder } from './MessageNewBorder.jsx';
import FormInputMessage from './FormInputMessage.jsx';
import { useDetailContext } from './DetailContext.js';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { MessageEditingContext } from './MessageEditingContext.js';
import { NB_NOTIFICATIONS_NOT_READ } from '@graphql/queries/notification';
import { ORDER_STATUS_ON_HOLD, ORDER_STATUS_COMPLETED, ORDER_STATUS_DRAFT } from '@constants/order';
import withLoggedUser from '@components/WithLoggedUser';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { unreadCheck } from '../../utils/unreadCheck.js';
import { ORDER_MESSAGES } from '@graphql/queries/order';
import { READ_ORDER_MESSAGES, UPDATE_ORDER_OWNERS } from '@graphql/mutations/order';
import {
    SUBSCRIBE_DISCUSSION_MESSAGES,
    SUBSCRIBE_DISCUSSION_MESSAGES_DELETED,
    SUBSCRIBE_DISCUSSION_MESSAGES_EDITED,
    SUBSCRIBE_ROOM_USERS,
} from '@graphql/subscriptions/discussion.js';
import { MessageSending } from './MessageSending.jsx';

const initialEditingValues = {
    id: undefined,
    content: undefined,
};

const SHOWN_ITEM = 20;

const skeleton = (
    <Box $d="flex" $mb="16">
        <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
        <Box $flex="1">
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                <Skeleton $w="92" $h="20" />
                <Skeleton $w="74" $h="20" />
            </Box>
            <Skeleton $w="100%" $h="40" />
        </Box>
    </Box>
);

export const TabMessage = withLoggedUser(
    ({ viewer, sendMessage, messages, setMessages, joinRoom, deleteMessage, updateMessage, leaveRoom, isTyping, setSending, userTyping, sending }) => {
        const { request, isSubscriptionPaused, refetchRequests } = useDetailContext();
        const [editingValues, setEditingValues] = useState(initialEditingValues);
        const [usersOnline, setUsersOnline] = useState([]);

        const roomToJoin = useMemo(() => `discussion/${request.discussionId}`, [request]);
        const messagesContainerRef = useRef();
        const messagesEndRef = useRef();
        const [readOrderMessages] = useMutation(READ_ORDER_MESSAGES);
        const [updateOrderOwners] = useMutation(UPDATE_ORDER_OWNERS);

        const scrollToBottom = () => {
            const scrollY = messagesContainerRef.current.scrollHeight;
            messagesContainerRef.current.scrollTo({
                top: scrollY,
                behavior: 'smooth',
            });
        };

        const [page, setPage] = useState(1);

        const pageChange = useRef(false);
        const isFirstLoad = useRef(false);
        const prevContainerHeight = useRef(0);

        const { loading, data = {} } = useQuery(ORDER_MESSAGES, {
            variables: {
                id: request.id,
                last: SHOWN_ITEM,
                skip: (page - 1) * SHOWN_ITEM,
            },
            fetchPolicy: 'network-only',
        });

        const handleMessageSent = async data => {
            if (!data.isNote) {
                setSending(false);
                pageChange.current = false;
                setMessages(msg => {
                    return [...msg, data];
                });
                await refetchRequests();
            }
        };

        const handleMessageDeleted = deleted => {
            setMessages(msgs => msgs.filter(message => message.id !== deleted.id));
        };

        const handleMessageUpdated = data => {
            setMessages(msgs =>
                msgs.map(msg => {
                    return msg.id === data.id ? { ...msg, text: data.text, files: data.files } : msg;
                })
            );
        };

        useSubscription(SUBSCRIBE_DISCUSSION_MESSAGES, {
            onData: res => {
                if (res.data.data) {
                    handleMessageSent(res.data.data.getMessage);
                }
            },
            variables: {
                discussionId: request.discussionId,
            },
        });

        useSubscription(SUBSCRIBE_DISCUSSION_MESSAGES_EDITED, {
            onData: res => {
                if (res.data.data) {
                    handleMessageUpdated(res.data.data.editMessage);
                }
            },
            variables: {
                discussionId: request.discussionId,
            },
        });

        useSubscription(SUBSCRIBE_DISCUSSION_MESSAGES_DELETED, {
            onData: res => {
                if (res.data.data) {
                    handleMessageDeleted(res.data.data.deleteMessage);
                }
            },
            variables: {
                discussionId: request.discussionId,
            },
        });

        useSubscription(SUBSCRIBE_ROOM_USERS, {
            onData: res => {
                if (res.data.data) {
                    setUsersOnline(res.data.data.roomUsers);
                }
            },
            variables: {
                discussionId: request?.discussionId,
            },
        });

        useEffect(() => {
            const handleClickWindow = async () => {
                try {
                    if (request?.unreadMessages > 0 && request?.id) {
                        await readOrderMessages({
                            variables: {
                                id: request?.id,
                            },
                        });
                        setMessages(oldMessages =>
                            oldMessages.map(msg => {
                                return {
                                    ...msg,
                                    readBy: Array.isArray(msg.readBy) ? [...msg.readBy, { id: viewer.id }] : [{ id: viewer.id }],
                                };
                            })
                        );
                        await refetchRequests();
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            window.addEventListener('click', handleClickWindow);
            return () => {
                window.removeEventListener('click', handleClickWindow);
            };
        }, [setMessages, viewer, refetchRequests, readOrderMessages, request]);

        useEffect(() => {
            setMessages(old => [...(data?.Order?.discussion?.messages ?? []), ...old]);
            // eslint-disable-next-line
        }, [data?.Order?.id]);

        useEffect(() => {
            joinRoom(request?.discussionId, viewer.id).then(results => {
                setUsersOnline(results.data.joinRoom);
            });

            return () => {
                leaveRoom(request?.discussionId, viewer.id);
            };
        }, []);
        useEffect(() => {
            const handleTabClose = event => {
                // Call leaveRoomMutate when tab is closing
                leaveRoom(request?.discussionId, viewer.id);
            };
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    // User has returned to the tab
                    joinRoom(request?.discussionId, viewer.id);
                }
            };

            window.addEventListener('beforeunload', handleTabClose);
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Cleanup listener when component unmounts
            return () => {
                window.removeEventListener('beforeunload', handleTabClose);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }, [leaveRoom, joinRoom]);

        useEffect(() => {
            if (messages.length > 0) {
                if (!isFirstLoad.current) {
                    isFirstLoad.current = true;
                }
                if (pageChange.current) {
                    pageChange.current = false;
                    const newHeight = messagesContainerRef.current.scrollHeight;
                    const scrollY = newHeight - prevContainerHeight.current - messagesContainerRef.current.clientHeight;
                    messagesContainerRef.current.scrollTo(0, scrollY);
                } else {
                    scrollToBottom();
                }
                prevContainerHeight.current = messagesContainerRef.current.scrollHeight;
            }
        }, [messages.length, sending]);

        const handleSubmit = useCallback(
            async (content, fileIds, mentionedIds) => {
                pageChange.current = false;
                // typingMessage(roomToJoin);

                // For mobile
                if (editingValues.id) {
                    updateMessage({
                        discussionId: request?.discussionId,
                        messageId: editingValues.id,
                        text: content,
                        fileIds,
                        orderId: request.id,
                        mentionedIds,
                    });
                    setEditingValues(initialEditingValues);
                } else {
                    setSending(true);
                    setTimeout(() => {
                        sendMessage({
                            orderId: request.id,
                            text: content,
                            discussionId: request.discussionId,
                            userId: viewer?.id,
                            fileIds,
                            mentionedIds,
                        });
                    }, 100);

                    const currentOwners = request.owners?.map(({ id }) => id) ?? [];
                    if (currentOwners.indexOf(viewer.id) < 0) {
                        const newOwnerIds = [...currentOwners, viewer.id];
                        await updateOrderOwners({
                            variables: {
                                orderId: request.id,
                                ownerIds: newOwnerIds,
                                ownersToDisconnectIds: [],
                            },
                        });
                        await refetchRequests();
                        message.destroy();
                        message.success('Your messages has been sent. You are now the owner of this request.');
                    }
                }
            },
            [request, sendMessage, roomToJoin, viewer.id, editingValues, updateMessage, refetchRequests, updateOrderOwners]
        );

        const handleScroll = useCallback(
            ev => {
                if (messagesContainerRef.current.scrollTop === 0 && !pageChange.current && !loading) {
                    pageChange.current = true;
                    setPage(old => old + 1);
                }
            },
            [loading]
        );

        const renderedMessage = useMemo(() => {
            if (Array.isArray(messages)) {
                let alreadyRenderUnread = false;
                const result = [];
                for (let i = 0; i < messages.length; i++) {
                    const msg = messages[i];

                    const isUnread = msg.actionType !== 'SUBMITTED_BOT' ? unreadCheck(msg, viewer) : false;
                    result.push(
                        <Fragment key={i}>
                            {isUnread && !alreadyRenderUnread && <MessageNewBorder />}
                            <ItemMessageDetail
                                isAction={msg.isAction}
                                isNote={msg.isNote}
                                message={msg}
                                usersOnline={usersOnline}
                                deleteMessage={deleteMessage}
                                updateMessage={updateMessage}
                            />
                        </Fragment>
                    );

                    if (isUnread) {
                        alreadyRenderUnread = true;
                    }
                }
                return result;
            }
            return null;
        }, [messages, deleteMessage, updateMessage, viewer, usersOnline]);

        // const handleChange = useCallback(
        //     editorState => {
        //         if (editorState.getCurrentContent().hasText()) {
        //             typingMessage(roomToJoin, `${viewer.firstname} ${viewer.lastname}`);
        //         }
        //     },
        //     [viewer.firstname, viewer.lastname, typingMessage, roomToJoin]
        // );

        const isComplete = request.status === ORDER_STATUS_COMPLETED;
        const isDraft = request.status === ORDER_STATUS_DRAFT;
        const isPaused = request.status === ORDER_STATUS_ON_HOLD;

        let content = (
            <FormInputMessage
                sending={sending}
                editingValues={editingValues}
                onSubmit={handleSubmit}
                onCloseEdit={() => setEditingValues(initialEditingValues)}
            />
        );
        if (!editingValues.id) {
            if (isSubscriptionPaused) {
                content = (
                    <Text $textVariant="P4" $fontWeight="300">
                        Your subscription is currently on pause. Please resume your subscription before requesting revisions.
                    </Text>
                );
            } else if (isComplete) {
                content = (
                    <Text $textVariant="P4" $p={['8', '0']} $fontWeight="300">
                        Your request has been marked as complete. Please re-open request before sending a new message.
                    </Text>
                );
            } else if (isDraft) {
                content = (
                    <Text $textVariant="P4" $p={['8', '0']} $fontWeight="300">
                        You must submit your request before you can send a message.
                    </Text>
                );
            } else if (isPaused) {
                content = (
                    <Text $textVariant="P4" $p={['8', '0']} $fontWeight="300">
                        You must resume your request before you can send a new message.
                    </Text>
                );
            }
        }

        return (
            <MessageEditingContext.Provider value={{ editingValues, setEditingValues }}>
                <Box $d="flex" $flexDir="column" $maxH={['calc(100vh - 289px)', 'calc(100vh - 244px)']} $h="100%">
                    <Box
                        ref={messagesContainerRef}
                        $overflowY="auto"
                        $scrollbarC="#D5D6DD transparent"
                        $overflowX="hidden"
                        $pt="8"
                        $flex="1 1 100vh"
                        $d="flex"
                        $flexDir="column"
                        onScroll={handleScroll}
                        className={`custom-text`}
                    >
                        {loading && !isFirstLoad.current && (
                            <Box $px="16" $py="8">
                                {skeleton}
                                {skeleton}
                                {skeleton}
                                {skeleton}
                            </Box>
                        )}
                        {loading && isFirstLoad.current && (
                            <Box $d="flex" $flexDir="row" $alignItems="center" $justifyContent="center" $pb="8">
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 18, marginRight: 17 }} spin />} />
                                <Text $colorScheme="cta" $textVariant="Badges">
                                    Load more
                                </Text>
                            </Box>
                        )}
                        {renderedMessage}
                        {sending && <MessageSending text={'...'} user={viewer} />}
                        <Box ref={messagesEndRef} />
                    </Box>
                    <Box
                        $px={['10', '20']}
                        $py={['8', '14']}
                        $borderT={isComplete || isDraft || isPaused ? '1' : '0'}
                        $borderTopStyle="solid"
                        $borderTopColor="outline-gray"
                    >
                        {isTyping && (
                            <Box $mb="2">
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    {userTyping} is typing...
                                </Text>
                            </Box>
                        )}
                        {content}
                    </Box>
                </Box>
            </MessageEditingContext.Provider>
        );
    }
);
