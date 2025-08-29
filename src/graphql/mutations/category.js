import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
    mutation CreateCategory($title: String!, $servicesIds: [String!]!, $categoryImageId: String!, $position: Int!) {
        createCategory(title: $title, servicesIds: $servicesIds, categoryImageId: $categoryImageId, position: $position) {
            id
            title
            slug
            description
            createdAt
            position
            icon {
                id
            }
            services(where: { isActivated: true }) {
                id
            }
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: ID!, $title: String!, $servicesIds: [String!]!, $servicesIdsToDisconnect: [String!], $categoryImageId: String, $position: Int) {
        updateCategory(
            id: $id
            title: $title
            servicesIds: $servicesIds
            servicesIdsToDisconnect: $servicesIdsToDisconnect
            categoryImageId: $categoryImageId
            position: $position
        ) {
            id
            title
            description
            position
            services {
                id
                name
            }
            images {
                id
                url
            }
        }
    }
`;
