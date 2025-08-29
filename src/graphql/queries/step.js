import { gql } from '@apollo/client';

export const PRODUCT_STEP = gql`
    query ServiceStep($id: ID!) {
        ServiceStep(id: $id) {
            id
            name
            items
        }
    }
`;

export const ORDER_STEP = gql`
    query OrderStep($id: ID!) {
        OrderStep(id: $id) {
            id
            name
            status
            updatedAt
            childs(orderBy: { index: Asc }) {
                id
            }
        }
    }
`;
