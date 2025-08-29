import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
    mutation SendMessage($orderId: Int!, $discussionId: ID!, $text: String!, $isNote: Boolean, $fileIds: [String!], $mentionedIds: [ID!]) {
        sendMessage(orderId: $orderId, discussionId: $discussionId, text: $text, isNote: $isNote, fileIds: $fileIds, mentionedIds: $mentionedIds) {
            id
            text
            createdAt
            isNote
            isAction
            user {
                id
                firstname
                role
            }
            files {
                id
                url
                name
                size
                contentType
            }
            discussion {
                id
                order {
                    id
                    status
                }
            }
        }
    }
`;

export const DELETE_MESSAGE = gql`
    mutation DeleteMessage($messageId: ID!, $fileIds: [ID!], $discussionId: ID!) {
        deleteMessage(messageId: $messageId, fileIds: $fileIds, discussionId: $discussionId) {
            deleted
            messageId
        }
    }
`;

export const EDIT_MESSAGE = gql`
    mutation EditMessage($discussionId: ID!, $messageId: ID!, $text: String, $fileIds: [ID!], $isPin: Boolean) {
        editMessage(discussionId: $discussionId, messageId: $messageId, text: $text, fileIds: $fileIds, isPin: $isPin) {
            id
            text
            createdAt
            isNote
            isAction
            user {
                id
                firstname
                role
            }
            files {
                id
                url
                name
                size
                contentType
            }
            discussion {
                id
                order {
                    id
                    status
                }
            }
        }
    }
`;

export const JOIN_ROOM = gql`
    mutation JoinRoom($discussionId: ID!, $userId: ID!) {
        joinRoom(discussionId: $discussionId, userId: $userId)
    }
`;

export const LEAVE_ROOM = gql`
    mutation LeaveRoom($discussionId: ID!, $userId: ID!) {
        leaveRoom(discussionId: $discussionId, userId: $userId)
    }
`;
