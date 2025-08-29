import { gql } from '@apollo/client';

export const DISCUSSION = gql`
    query Discussion($id: ID!) {
        Discussion(id: $id) {
            id
            messages {
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
            }
        }
    }
`;

export const MESSAGES_DISCUSSION = gql`
    query discussionMessage($discussionId: ID!, $isNote: Boolean, $last: Int, $skip: Int) {
        allMessages(where: { isNote: $isNote, discussion: { id: $discussionId } }, orderBy: { createdAt: Asc }, last: $last, skip: $skip) {
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
                contentType
                size
            }
        }
    }
`;
