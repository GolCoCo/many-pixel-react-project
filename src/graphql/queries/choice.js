import { gql } from '@apollo/client';

export const CHOICE = gql`
    query ChoiceById($id: ID!) {
        Choice(id: $id) {
            id
            label
            file {
                id
            }
        }
    }
`;
