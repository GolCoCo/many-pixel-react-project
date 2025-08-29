import { gql } from '@apollo/client';

export const ADD_CHOICE = gql`
    mutation addChoice($label: String, $fileId: ID, $questionId: ID, $index: Int) {
        addChoice(label: $label, fileId: $fileId, questionId: $questionId, index: $index) {
            id
        }
    }
`;
