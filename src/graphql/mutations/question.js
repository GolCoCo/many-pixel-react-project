import { gql } from '@apollo/client';

export const ADD_QUESTION = gql`
    mutation AddQuestion(
        $title: String!
        $answerType: ANSWER_TYPE!
        $choices: [String!]
        $placeholder: String
        $help: String
        $required: Boolean
        $serviceId: ID!
    ) {
        createQuestion(
            title: $title
            answerType: $answerType
            choices: $choices
            placeholder: $placeholder
            help: $help
            required: $required
            serviceId: $serviceId
        ) {
            id
            index
            title
            answerType
            choices(orderBy: { index: Asc }) {
                id
                index
                label
            }
            placeholder
            help
            required
        }
    }
`;

export const DELETE_QUESTION = gql`
    mutation DeleteQuestion($id: ID!, $serviceId: ID!, $choicesIds: [String!]) {
        deleteQuestion(id: $id, serviceId: $serviceId, choicesIds: $choicesIds) {
            id
        }
    }
`;

export const UPDATE_QUESTION = gql`
    mutation UPDATE_QUESTION(
        $id: ID!
        $title: String!
        $answerType: ANSWER_TYPE!
        $choices: [String!]
        $choicesIds: [String!]
        $placeholder: String
        $help: String
        $required: Boolean
    ) {
        updateQuestion(
            id: $id
            title: $title
            answerType: $answerType
            choices: $choices
            choicesIds: $choicesIds
            placeholder: $placeholder
            help: $help
            required: $required
        ) {
            id
            index
            title
            answerType
            choices(orderBy: { index: Asc }) {
                id
                index
                label
            }
            placeholder
            help
            required
        }
    }
`;
