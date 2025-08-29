import { gql } from '@apollo/client';

export const UPDATE_PREFERENCES = gql`
    mutation UpdatePreferences($id: ID!, $showDescriptions: Boolean, $showPictures: Boolean) {
        updateWizard(id: $id, showDescriptions: $showDescriptions, showPictures: $showPictures) {
            id
        }
    }
`;
