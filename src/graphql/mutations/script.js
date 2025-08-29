import { gql } from '@apollo/client';

export const CHECK_USER_QUEUES = gql`
    mutation {
        doesAllCustomersHaveQueueOk
    }
`;

export const SYNC_CANCELLATION_SHEET = gql`
    mutation {
        syncCancellationSheet
    }
`;

export const SYNC_ONBOARDING_SHEET = gql`
    mutation {
        syncOnboardingSheet
    }
`;

export const SYNC_ORDERS_SHEET = gql`
    mutation {
        syncOrdersSheet
    }
`;

export const SYNC_ANALYTICS = gql`
    mutation {
        syncAnalyticsApp
    }
`;
