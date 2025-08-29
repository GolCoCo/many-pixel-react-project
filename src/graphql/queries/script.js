import { gql } from '@apollo/client';

export const USERS_WITHOUT_ASSIGNED_DESIGNERS = gql`
    query {
        displayUnassignedCustomers {
            id
            firstname
            lastname
        }
    }
`;
