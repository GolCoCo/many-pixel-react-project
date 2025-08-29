import { gql } from '@apollo/client';

export const SUBSCRIBE_DISCUSSION_MESSAGES = gql`
    subscription messageFromDiscussion($discussionId: ID!) {
        getMessage(discussionId: $discussionId) {
            id
            createdAt
            updatedAt
            user {
                id
                firstname
                lastname
                picture {
                    url
                    id
                }
            }
            isNote
            isAction
            isPin
            actionType
            actionMeta
            text
            readBy {
                userId
            }
            files {
                id
                name
                size
                url
                isHidden
                contentType
                feedback {
                    id
                }
                folder {
                    id
                    isHidden
                }
            }
            actionFile {
                id
                name
                size
                url
                contentType
                feedback {
                    id
                }
            }
        }
    }
`;

export const SUBSCRIBE_DISCUSSION_MESSAGES_DELETED = gql`
    subscription deletedMessageFromDiscussion($discussionId: ID!) {
        deleteMessage(discussionId: $discussionId) {
            id
        }
    }
`;

export const SUBSCRIBE_DISCUSSION_MESSAGES_EDITED = gql`
    subscription editedMessageFromDiscussion($discussionId: ID!) {
        editMessage(discussionId: $discussionId) {
            id
            text
            isPin
            files {
                id
                name
                size
                url
                isHidden
                contentType
                feedback {
                    id
                    comments {
                        id
                        readBy {
                            userId
                        }
                    }
                    readBy {
                        userId
                    }
                }
                folder {
                    id
                    isHidden
                }
            }
            actionFile {
                id
                name
                size
                url
                contentType
                feedback {
                    id
                    comments {
                        id
                        readBy {
                            userId
                        }
                    }
                    readBy {
                        userId
                    }
                }
            }
        }
    }
`;

export const SUBSCRIBE_ROOM_USERS = gql`
    subscription RoomUsers($discussionId: ID!) {
        roomUsers(discussionId: $discussionId)
    }
`;
