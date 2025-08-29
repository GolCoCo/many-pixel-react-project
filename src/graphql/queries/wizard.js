import { gql } from '@apollo/client';

export const WIZARD = gql`
    query Wizard($id: ID!) {
        Wizard(id: $id) {
            id
            showPictures
            showDescriptions
            categories {
                id
            }
        }
    }
`;

export const WIZARD_PREFERENCES = gql`
    query Wizard($id: ID!) {
        Wizard(id: $id) {
            id
            showPictures
            showDescriptions
        }
    }
`;
