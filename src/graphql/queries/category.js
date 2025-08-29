import { gql } from '@apollo/client';

export const CATEGORY = gql`
    query Category($id: ID!) {
        Category(id: $id) {
            id
            title
            slug
            description
            createdAt
            icon {
                id
                url
            }
            services {
                id
                name
            }
        }
    }
`;

export const CATEGORY_BY_SLUG = gql`
    query CategoryBySlug($slug: String!) {
        Category(slug: $slug) {
            id
            title
            slug
            description
            createdAt
            icon {
                id
            }
            services(where: { isActivated: true }) {
                id
                name
            }
            images {
                id
                url
                name
            }
        }
    }
`;

export const ALL_CATEGORIES = gql`
    query AllCategories($where: CategoryWhereInput, $orderBy: CategoryOrderBy) {
        allCategories(where: $where, orderBy: $orderBy) {
            id
            title
            slug
            description
            createdAt
            position
            icon {
                id
                secret
                url
            }
            services(where: { isActivated: true }, orderBy: { position: Asc }) {
                id
                name
                icon {
                    id
                    secret
                    url
                }
                questions {
                    id
                    answerType
                    placeholder
                    title
                    choices {
                        id
                        index
                        label
                    }
                }
                deliverables
                questions {
                    id
                    answerType
                    choices {
                        id
                        label
                        index
                    }
                    title
                    index
                    required
                }
            }
            images {
                id
                url
            }
        }
    }
`;

export const ALL_CATEGORIES_CUSTOMER = gql`
    query ALL_CATEGORIES($userId: ID!) {
        allCategories(where: { plans_some: { customerSubscriptions_some: { user: { id: $userId } } } }) {
            slug
        }
    }
`;

export const ALL_CATEGORIES_SEARCH = gql`
    query {
        allCategories {
            id
            slug
            title
        }
    }
`;
