import { gql } from '@apollo/client';

export const MARK_ALL_AS_READ = gql`
    mutation {
        markMyNotificationsAsRead
    }
`;

export const READ_NOTIFICATION = gql`
    mutation ReadNotification($id: ID!) {
        readNotification(id: $id) {
            id
            isRead
            isDelete
        }
    }
`;

export const DELETE_NOTIFICATION = gql`
    mutation DeleteNotification($id: ID!) {
        deleteNotification(id: $id) {
            id
            isRead
            isDelete
        }
    }
`;
