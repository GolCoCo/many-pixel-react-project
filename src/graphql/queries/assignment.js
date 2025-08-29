import { gql } from '@apollo/client';

export const USER_ASSIGNED_DESIGNERS = gql`
    query user($id: ID!) {
        User(id: $id) {
            id
            assignedDesigners {
                id
                type {
                    id
                    name
                }
                designer {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`;

export const DESIGNER_ASSIGNED_CUSTOMERS = gql`
    query user($id: ID!) {
        User(id: $id) {
            id
            assignedCustomers {
                id
                type {
                    id
                    name
                }
                customer {
                    id
                    createdAt
                    lastLogin
                    firstname
                    lastname
                    email
                    picture {
                        id
                        secret
                    }
                    _ordersMeta {
                        count
                    }
                    subscription {
                        id
                        status
                        endAt
                        plan {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;
