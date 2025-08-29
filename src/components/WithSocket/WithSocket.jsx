import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_MESSAGE, EDIT_MESSAGE, JOIN_ROOM, LEAVE_ROOM, SEND_MESSAGE } from '@graphql/mutations/message';

const withSocket = WrappedComponent => props => {
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);

    const [sending, setSending] = useState(false);
    const [isTypingAndUser, setIsTypingAndUser] = useState({
        isTyping: false,
        userTyping: null,
    });

    const [joinRoomMutate] = useMutation(JOIN_ROOM);
    const [leaveRoomMutate] = useMutation(LEAVE_ROOM);
    const [sendMessageMutate] = useMutation(SEND_MESSAGE);
    const [editMessageMutate] = useMutation(EDIT_MESSAGE);
    const [deleteMessageMutate] = useMutation(DELETE_MESSAGE);

    const joinRoom = useCallback((discussionId, userId) => {
        return joinRoomMutate({
            variables: {
                discussionId,
                userId,
            },
        });
    }, []);

    const sendMessage = useCallback(
        messageData => {
            setSending(true);
            sendMessageMutate({ variables: messageData, fetchPolicy: 'network-only' });
        },
        [sendMessageMutate]
    );

    const updateMessage = useCallback(messageData => {
        editMessageMutate({ variables: messageData, fetchPolicy: 'network-only' });
    }, []);

    const deleteMessage = useCallback(messageData => {
        deleteMessageMutate({ variables: messageData, fetchPolicy: 'network-only' });
    }, []);

    const typingMessage = useCallback((room, user) => {
        // socket.emit('typingMessage', { room, user });
    }, []);

    const leaveRoom = useCallback((discussionId, userId) => {
        leaveRoomMutate({
            variables: {
                discussionId,
                userId,
            },
        });
    }, []);

    return (
        <WrappedComponent
            {...{
                ...props,
                sendMessage,
                updateMessage,
                deleteMessage,
                joinRoom,
                setMessages,
                setSending,
                messages,
                typingMessage,

                ...isTypingAndUser,
                leaveRoom,
                sending,
                pinnedMessages,
                setPinnedMessages,
            }}
        />
    );
};

export default withSocket;
