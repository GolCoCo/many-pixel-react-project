import { gql } from '@apollo/client';

export const SUBSCRIBE_NB_NOTIFICATIONS_NOT_READ = gql`
    subscription ($viewerId: ID!) {
        receiveNotification(viewerId: $viewerId) {
            text
            createdAt
            metaId
            fileId
            type
            id
            isRead
            isDelete
            creator {
                picture {
                    url
                }
            }
        }
    }
`;
