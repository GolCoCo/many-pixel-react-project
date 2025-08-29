import { gql } from '@apollo/client';

export const SERVICE_BY_ID = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            name
            type {
                id
                name
            }
            howToFillUpLink
            deliverables
            icon {
                id
                url
            }
            isActivated
            questions(orderBy: { index: Asc }) {
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
    }
`;

export const SERVICE_DEADLINES = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            price
            deadlines {
                id
                hours
                percent
                modifier
            }
        }
    }
`;

export const SERVICE_PRODUCT_STEPS = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            steps {
                id
            }
        }
    }
`;

export const SERVICE_QUESTIONS = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            questions(orderBy: { index: Asc }) {
                id
                index
                title
                answerType
                canUploadFile
                required
                help
                placeholder
                choices(orderBy: { index: Asc }) {
                    id
                    label
                    index
                    file {
                        id
                    }
                }
                files {
                    id
                }
            }
        }
    }
`;

export const SERVICE_PRICE = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            price
        }
    }
`;

export const SERVICE_DESCRIPTION = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            description
        }
    }
`;

export const SERVICE_ACTIVATION = gql`
    query Service($id: ID!) {
        Service(id: $id) {
            id
            isActivated
        }
    }
`;

export const ALL_SERVICES = gql`
    query allServices($activated: Boolean, $orderBy: ServiceOrderBy) {
        allServices(where: { isActivated: $activated }, orderBy: $orderBy) {
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
                url
            }
            isActivated
            questions(orderBy: { index: Asc }) {
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
    }
`;

export const ALL_ACTIVATED_SERVICES = gql`
    query {
        allActivatedServices(where: { isActivated: true }, orderBy: { createdAt: Desc }) {
            id
            name
            position
            createdAt
            description
            isActivated
            icon {
                id
                secret
            }
        }
    }
`;

export const SERVICE_ICON = gql`
    query ServiceIcon($id: ID!) {
        Service(id: $id) {
            id
            icon {
                id
            }
        }
    }
`;
