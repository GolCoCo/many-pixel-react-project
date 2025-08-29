import { gql } from '@apollo/client';

export const ADD_DESIGN_TYPE = gql`
    mutation createDesignType($name: String!) {
        createDesignType(name: $name) {
            id
            name
        }
    }
`;

export const EDIT_DESIGN_TYPE = gql`
    mutation updateDesignType($id: ID!, $name: String!) {
        updateDesignType(id: $id, name: $name) {
            id
            name
        }
    }
`;
