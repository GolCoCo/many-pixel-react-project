import { gql } from '@apollo/client';

export const UPDATE_COLOR = gql`
    mutation updateColor($id: ID!, $name: String!, $colorValue: String!, $type: String!) {
        updateColor(id: $id, name: $name, colorValue: $colorValue, type: $type) {
            id
            name
            colorValue
            type
        }
    }
`;

export const DELETE_COLOR = gql`
    mutation deleteColor($id: ID!) {
        deleteColor(id: $id) {
            id
        }
    }
`;
