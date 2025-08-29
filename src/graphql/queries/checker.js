import { gql } from '@apollo/client';

export const CHECKER = gql`
    query CheckerById($id: ID!) {
        Checker(id: $id) {
            id
            checkedAt
            manager {
                id
            }
        }
    }
`;
