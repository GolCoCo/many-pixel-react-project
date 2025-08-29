import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation SignUpUser(
        $email: String!
        $password: String!
        $firstname: String!
        $lastname: String!
        $companyName: String
        $website: String
        $invitation: String
        $referrer: String
        $companyId: String
        $companyRole: String
        $jobTitle: String
        $role: String
        $teamId: String
        $specialitiesIds: [String!]
        $withEmailSent: Boolean
        $sendOnboardingEmail: Boolean
    ) {
        signup(
            email: $email
            password: $password
            firstname: $firstname
            lastname: $lastname
            invitation: $invitation
            referrer: $referrer
            companyId: $companyId
            companyName: $companyName
            website: $website
            companyRole: $companyRole
            jobTitle: $jobTitle
            role: $role
            teamId: $teamId
            specialitiesIds: $specialitiesIds
            withEmailSent: $withEmailSent
            sendOnboardingEmail: $sendOnboardingEmail
        ) {
            id
            token
            stripeId
        }
    }
`;

export const AUTH_USER = gql`
    mutation AuthenticateUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            token
        }
    }
`;

export const SEND_ACTIVATION_LINK = gql`
    mutation AddTokenUserActivation($email: String!) {
        addTokenUserActivation(email: $email) {
            sent
        }
    }
`;

export const SEND_NEW_EMAIL_ACTIVATION_LINK = gql`
    mutation UpdateEmailTokenUserActivation($email: String!, $userId: ID!) {
        updateEmailTokenUserActivation(email: $email, userId: $userId) {
            sent
        }
    }
`;

export const SEND_RESET_EMAIL = gql`
    mutation RequestAccountResetPassword($email: String!) {
        requestAccountResetPassword(email: $email) {
            sent
        }
    }
`;

export const USER_RESET_PASSWORD = gql`
    mutation UserResetPassword($id: ID!, $password: String!) {
        resetPassword(id: $id, password: $password) {
            updated
        }
    }
`;

export const CONNECT_AS = gql`
    mutation ConnectAs($companyId: ID, $userId: ID) {
        connectAs(companyId: $companyId, userId: $userId) {
            token
        }
    }
`;
