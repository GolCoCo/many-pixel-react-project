import React, { useCallback, useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { ORDER_STATUS_ON_HOLD, ORDER_STATUS_COMPLETED, ORDER_STATUS_DRAFT } from '@constants/order';
import withLoggedUser from '@components/WithLoggedUser';
import { Popover, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ADMIN_ORDER_MESSAGES } from '@graphql/queries/order';
import { READ_ORDER_MESSAGES } from '@graphql/mutations/order';
import { ItemMessageDetail } from './ItemMessageDetail.jsx';
import { MessageNewBorder } from './MessageNewBorder.jsx';
import FormInputMessage from './FormInputMessage.jsx';
import { useDetailContext } from './DetailContext.js';
import { MessageEditingContext } from './MessageEditingContext.js';
import { unreadCheck } from '../../utils/unreadCheck.js';
import { MessageTypeDefault } from './MessageTypeDefault.jsx';
import IconPin from '@components/Svg/IconPin';
import CloseIcon from '@components/Svg/Close';
import moment from 'moment';
import { WysiwygRenderer } from '@components/Wysiwyg';
import Avatar from '@components/Avatar';
import ArrowRightIcon from '@components/Svg/ArrowRight';
import { CardAttachment } from './CardAttachment.jsx';
import { useHistory } from 'react-router-dom';
import { FEEDBACK_REQUEST } from '@constants/routes';
import {
    SUBSCRIBE_DISCUSSION_MESSAGES,
    SUBSCRIBE_DISCUSSION_MESSAGES_DELETED,
    SUBSCRIBE_DISCUSSION_MESSAGES_EDITED,
    SUBSCRIBE_ROOM_USERS,
} from '@graphql/subscriptions/discussion.js';

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
    ({
        viewer,
        sendMessage,
        messages,
        setMessages,
        joinRoom,
        deleteMessage,
        updateMessage,
        leaveRoom,
        setSending,
        typingMessage,
        userTyping,
        sending,
        pinnedMessages,
        setPinnedMessages,
    }) => {
        const { request, isSubscriptionPaused, refetchRequests } = useDetailContext();
        const [clicked, setClicked] = useState(false);
        const [usersOnline, setUsersOnline] = useState([]);
        const [editingValues, setEditingValues] = useState(initialEditingValues);
        const roomToJoin = useMemo(() => `discussion/${request?.discussionId}`, [request]);
        const messagesContainerRef = useRef();
        const messagesEndRef = useRef();
        const [readOrderMessages] = useMutation(READ_ORDER_MESSAGES);

        const scrollToBottom = () => {
            const scrollY = messagesContainerRef.current.scrollHeight;
            messagesContainerRef.current.scrollTo({
                top: scrollY,
                behavior: 'smooth',
            });
        };
        const [page, setPage] = useState(1);
        const history = useHistory();

        const pageChange = useRef(false);
        const isFirstLoad = useRef(false);
        const prevContainerHeight = useRef(0);

        const hide = () => {
            setClicked(false);
        };
        const handleClickChange = open => {
            setClicked(open);
        };

        const {
            loading,
            data = {},
            subscribeToMore,
        } = useQuery(ADMIN_ORDER_MESSAGES, {
            variables: {
                id: request.id,
                last: SHOWN_ITEM,
                skip: (page - 1) * SHOWN_ITEM,
            },
            fetchPolicy: 'network-only',
        });

        const type = 'list';

        const handleMessageSent = async data => {
            setSending(false);
            pageChange.current = false;
            setMessages(msg => [...msg, data]);
            await refetchRequests();
        };

        const handleMessageDeleted = data => {
            setMessages(msgs => msgs.filter(message => message.id !== data.id));
        };

        const handleMessageUpdated = data => {
            setMessages(msgs =>
                msgs.map(msg => {
                    return msg.id === data.id ? { ...msg, text: data.text, isPin: data.isPin } : msg;
                })
            );
            if (data.isPin) {
                setPinnedMessages(msgs => [...msgs, data]);
            } else {
                setPinnedMessages(msgs => msgs.filter(message => message.id !== data.id));
            }
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
            setPinnedMessages(old => [...(data?.Order?.discussion?.pinnedMessages ?? [])]);
            // eslint-disable-next-line
        }, [data?.Order?.discussion?.pinnedMessages]);

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
        }, [messages.length]);

        const handleUnPin = useCallback(
            id => {
                updateMessage({
                    discussionId: request?.discussionId,
                    messageId: id,
                    isPin: false,
                });
            },
            [updateMessage, roomToJoin]
        );

        const handleSubmit = useCallback(
            async (content, fileIds, activeMessageType, mentionedIds) => {
                pageChange.current = false;
                //typingMessage(roomToJoin);

                // For mobile
                if (editingValues.id) {
                    updateMessage({
                        messageId: editingValues.id,
                        text: content,
                        fileIds,
                        discussionId: request.discussionId,
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
                            isNote: activeMessageType === 'NOTES',
                            mentionedIds,
                        });
                    }, 100);
                    scrollToBottom();
                }
            },
            [editingValues.id, request.discussionId, request.id, roomToJoin, sendMessage, updateMessage, viewer.id]
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
                        <Fragment key={msg.id}>
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

        let content = <FormInputMessage editingValues={editingValues} onSubmit={handleSubmit} onCloseEdit={() => setEditingValues(initialEditingValues)} />;

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
                <Box $d="flex" $flexDir="column" $maxH={['calc(100vh - 289px)', 'calc(100vh - 244px)']} $h="100%" position="relative">
                    {pinnedMessages && pinnedMessages?.length > 0 && (
                        <Box position="sticky" $px="20" $minH="52" $d="flex" $borderW="0" $borderT="1" $borderB="1" $borderColor="outline-gray" $borderStyle="solid">
                            <Popover
                                style={{ scrollbarWidth: 'thin' }}
                                open={clicked}
                                onOpenChange={handleClickChange}
                                overlayClassName="custom-popover"
                                title={
                                    <Box $d="flex" $flexDir="row" $w="100%" $justifyContent="space-between" $alignItems="center">
                                        <Text>Pinned Messages</Text>
                                        <Box
                                            $colorScheme="tertiary"
                                            _hover={{ $colorScheme: 'cta' }}
                                            onClick={() => console.log("zzz")}
                                            $cursor="pointer"
                                            $ml="auto"
                                        >
                                            <Popover
                                                placement="bottom"
                                                trigger="hover"
                                            >
                                                <CloseIcon style={{ fontSize: 16 }} onClick={hide} />
                                            </Popover>
                                        </Box>
                                    </Box>
                                }
                                content={
                                    <Box className="boxScroll" $w={['100%', '400px']} $bg="bg-gray" $px="10" $py="16" $maxH="498" $overflowY="scroll">
                                        {pinnedMessages.map(({ user, text, createdAt, files, ...m }) => {
                                            return (
                                                <Box
                                                    $borderW="1"
                                                    $borderStyle="solid"
                                                    $borderColor="outline-gray"
                                                    $d="flex"
                                                    $flexDir="row"
                                                    key={`${createdAt}-${text}`}
                                                    $mb="16"
                                                    $bg="white"
                                                    _hover={{ $bg: 'bg-light-blue' }}
                                                    style={{ borderRadius: '10px' }}
                                                >
                                                    <Box $flex={1} $px="16" $py="8" $w="100%">
                                                        <Box $d="flex" $alignItems="center" $flexWrap="wrap">
                                                            <Avatar
                                                                src={user?.picture?.url}
                                                                size={24}
                                                                $fontSize={12}
                                                                name={user?.firstname}
                                                                isActive={false}
                                                                showActive={false}
                                                                $textVariant="SmallTitle"
                                                            />
                                                            <Text $mx="8" $textVariant="H6" $colorScheme="primary">
                                                                {user?.firstname}
                                                            </Text>
                                                            <Text $textVariant="P5" $colorScheme="secondary" $fontWeight="300">
                                                                {moment(createdAt).format('DD MMM YY')}
                                                            </Text>
                                                            <Box
                                                                $colorScheme="tertiary"
                                                                _hover={{ $colorScheme: 'cta' }}
                                                                onClick={() => handleUnPin(m.id)}
                                                                $cursor="pointer"
                                                                $ml="auto"
                                                            >
                                                                <Popover
                                                                    content={
                                                                        <Box $p="16">
                                                                            <Text $textVariant="P4">Unpin this message</Text>
                                                                        </Box>
                                                                    }
                                                                    placement="bottom"
                                                                    trigger="hover"
                                                                >
                                                                    <CloseIcon style={{ fontSize: 16 }} />
                                                                </Popover>
                                                            </Box>
                                                        </Box>
                                                        <Box $mt="8">
                                                            <WysiwygRenderer content={text} padding="0" />
                                                        </Box>
                                                        <Box $d="flex" $flexWrap="wrap" $mx="-10">
                                                            {files?.map((file, index) => (
                                                                <Box
                                                                    $mb="20"
                                                                    key={index}
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
                                                                        {...file}
                                                                        downloadIcon={<ArrowRightIcon />}
                                                                        onClick={() =>
                                                                            history.push(`${FEEDBACK_REQUEST.replace(':id', request.id)}?file=${file.id}`)
                                                                        }
                                                                        pl="14"
                                                                        pr="14"
                                                                        py="14"
                                                                        h="60"
                                                                        maxNW="230"
                                                                        _hover={{
                                                                            $bg: 'white',
                                                                        }}
                                                                        requestId={request.id}
                                                                    />
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                }
                                arrowPointAtCenter={true}
                                placement="bottomLeft"
                                trigger="click"
                            >
                                <Box
                                    $d="inline-flex"
                                    $flexDir="row"
                                    $cursor="pointer"
                                    $alignItems="center"
                                    $colorScheme="secondary"
                                    _hover={{ $colorScheme: 'cta' }}
                                >
                                    <IconPin />
                                    <Text $textVariant="P4" $ml="8">
                                        {pinnedMessages.length} Pinned
                                    </Text>
                                </Box>
                            </Popover>
                        </Box>
                    )}
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
                        {sending && <MessageTypeDefault text="..." user={viewer} usersOnline={usersOnline} />}
                        <Box ref={messagesEndRef} />
                    </Box>
                    <Box
                        $px={['10', '20']}
                        $py={['8', '14']}
                        $borderT={isComplete || isDraft || isPaused ? '1' : '0'}
                        $borderTopStyle="solid"
                        $borderTopColor="outline-gray"
                    >
                        {/* {isTyping && (
                            <Box $mb="2">
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    {userTyping} is typing...
                                </Text>
                            </Box>
                        )} */}
                        {content}
                    </Box>
                </Box>
            </MessageEditingContext.Provider>
        );
    }
);
