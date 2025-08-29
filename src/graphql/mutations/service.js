import { gql } from '@apollo/client';

export const ADD_SERVICE = gql`
    mutation AddService(
        $name: String!
        $type: String!
        $howToFillUpLink: String
        $deliverables: [OrderDeliverable!]!
        $productImageId: String!
        $position: Int
        $questions: [QuestionInput!]
    ) {
        createService(
            name: $name
            type: $type
            howToFillUpLink: $howToFillUpLink
            deliverables: $deliverables
            productImageId: $productImageId
            questions: $questions
            position: $position
        ) {
            id
            name
            position
            type {
                id
                name
            }
            howToFillUpLink
            deliverables
            icon {
                id
                secret
                url
            }
            questions {
                id
            }
        }
    }
`;

export const UPDATE_SERVICE = gql`
    mutation updateService(
        $id: ID!
        $name: String!
        $type: String!
        $howToFillUpLink: String
        $deliverables: [OrderDeliverable!]!
        $isActivated: Boolean
        $productImageId: String
        $position: Int
    ) {
        updateService(
            id: $id
            name: $name
            type: $type
            howToFillUpLink: $howToFillUpLink
            deliverables: $deliverables
            isActivated: $isActivated
            productImageId: $productImageId
            position: $position
        ) {
            id
            name
            position
            type {
                id
                name
            }
            howToFillUpLink
            deliverables
            icon {
                id
                secret
                url
            }
            questions {
                id
            }
        }
    }
`;
