import { gql } from '@apollo/client';

export const CREATE_REFERRAL_BY_EMAIL = gql`
    mutation CreateReferralByEmail($email: String!) {
        createReferralByEmail(email: $email) {
            id
            email
        }
    }
`;
