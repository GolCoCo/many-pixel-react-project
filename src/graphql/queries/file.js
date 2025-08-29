import { gql } from '@apollo/client';

export const GET_IMAGE = gql`
    query ($id: ID!) {
        File(id: $id) {
            id
            contentType
            secret
        }
    }
`;
