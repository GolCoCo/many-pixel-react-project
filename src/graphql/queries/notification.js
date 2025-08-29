import { gql } from '@apollo/client';

export const NB_NOTIFICATIONS_NOT_READ = gql`
    query NotificationNotRead($userId: String!) {
        _allNotificationsMeta(where: { user: $userId, isRead: false, isDelete: false }) {
            count
        }
    }
`;
