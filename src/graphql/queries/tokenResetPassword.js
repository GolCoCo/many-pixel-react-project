import { gql } from '@apollo/client';

export const RESET_PASSWORD_TOKEN = gql`
    query tokenResetPassword($id: ID!) {
        getTokenResetPassword(id: $id) {
            id
            email
        }
    }
`;
