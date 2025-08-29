import { gql } from '@apollo/client';

export const UPDATE_STEP = gql`
    mutation UpdateServiceStep($id: ID!, $name: String, $items: [String!]) {
        updateServiceStep(id: $id, name: $name, items: $items) {
            id
            name
            items
        }
    }
`;

export const DELETE_STEP = gql`
    mutation DeleteStep($id: ID!) {
        deleteServiceStep(id: $id) {
            id
        }
    }
`;

export const UPDATE_ORDER_STEP = gql`
    mutation UpdateOrderStep($id: ID!, $status: ORDER_STATUS) {
        updateOrderStep(id: $id, status: $status) {
            id
            status
        }
    }
`;
