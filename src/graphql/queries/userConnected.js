import { gql } from '@apollo/client';
import Order from './order';

const ME = gql`
    query {
        user {
            id
            firstname
            lastname
            tokenHubspot
            role
            job
            email
            md5email
            activated
            freeAccess
            intercomHash
            companyRole
            picture {
                id
                url
            }
            createdAt
            lastNotificationCheck
            company {
                id
                name
                website
                nbEmployees
                description
                timezone
                onboarding
                industry
                subscription {
                    id
                    status
                }
                logo {
                    id
                    url
                }
            }
        }
    }
`;

const ME_CARDS = gql`
    query {
        user {
            id
            firstname
            lastname
            email
            cards
        }
    }
`;

const ME_ORDERS = gql`
    query UserOrder($where: OrderWhereInput, $orderBy: OrderOrderBy, $first: Int, $skip: Int) {
        user {
            id
            orders(where: $where, orderBy: $orderBy, first: $first, skip: $skip) {
                ...CustomerOrder
            }
            _ordersMeta(where: $where) {
                count
            }
        }
    }
    ${Order.fragment.customer}
`;

const ME_ORDERS_AWAITING_FEEDBACK = gql`
    query {
        user {
            id
            orders(where: { status: COMPLETED, feedback: null }, orderBy: { createdAt: Desc }) {
                ...CustomerOrder
            }
        }
    }
    ${Order.fragment.customer}
`;

const ME_COUNT_ORDERS = gql`
    query CountOrder($where: OrderWhereInput) {
        user {
            id
            _ordersMeta(where: $where) {
                count
            }
        }
    }
`;

const ME_WORK_PROJECTS = gql`
    query UserWorkProject($first: Int, $skip: Int, $where: OrderWhereInput) {
        user {
            id
            workProjects(orderBy: { startedAt: Desc }, first: $first, skip: $skip, where: $where) {
                ...WorkerOrder
            }
        }
    }
    ${Order.fragment.worker}
`;

const ME_SUBSCRIBE_NEWS = gql`
    query {
        user {
            id
            subscribeNewsletter
        }
    }
`;

const ME_COMPANY_STRIPE = gql`
    query {
        user {
            id
            company {
                id
                stripeToken
            }
        }
    }
`;

const MY_FILES = gql`
    query {
        user {
            id
            orders {
                id
                name
            }
        }
    }
`;

const ME_FOLDERS = gql`
    query {
        user {
            id
            references {
                id
                name
                createdAt
                updatedAt
                files {
                    id
                    size
                    name
                    url
                }
            }
        }
    }
`;

const ME_SUBSCRIPTION = gql`
    query {
        user {
            id
            company {
                id
                subscription {
                    id
                    quantity
                    status
                    endAt
                    plan {
                        id
                        name
                        maxQuantity
                        interval
                        categories {
                            id
                            title
                        }
                        services {
                            id
                            name
                        }
                        price
                    }
                }
            }
            cards
        }
    }
`;

const ME_NOTIFICATIONS = gql`
    query MeNotifications($first: Int, $skip: Int) {
        user {
            id
            _notificationsCount
            notifications(where: { isDelete: false }, orderBy: { createdAt: Desc }, limit: $first, offset: $skip) {
                text
                createdAt
                metaId
                fileId
                type
                id
                isRead
                isDelete
                creator {
                    picture {
                        url
                    }
                }
            }
        }
    }
`;

const ME_INFOS = gql`
    query MeInfos {
        user {
            id
            firstname
            lastname
            email
            companyRole
            phone
            picture {
                id
            }
            company {
                id
            }
            address {
                id
            }
        }
    }
`;

const ME_REFEREES = gql`
    query MeId {
        user {
            id
            referees {
                id
                createdAt
                description
                paid
                from
                status
                referee {
                    id
                    email
                }
                referrerAmount
            }
        }
    }
`;

const ME_CUSTOMERS = gql`
    query MeCustomers {
        user {
            id
            customers {
                id
                firstname
                lastname
            }
        }
    }
`;

const ME_BRANDS = gql`
    query MeBrands {
        user {
            id
            company {
                id
                brands {
                    id
                    name
                    description
                    colors {
                        hex
                    }
                    logos {
                        name
                        size
                        url
                    }
                }
            }
        }
    }
`;

const ME_DEFAULT_CARD = gql`
    query MeBrands {
        user {
            id
            defaultCard {
                lastDigits
            }
        }
    }
`;

export {
    ME,
    ME_REFEREES,
    ME_INFOS,
    ME_SUBSCRIPTION,
    ME_ORDERS,
    ME_WORK_PROJECTS,
    ME_SUBSCRIBE_NEWS,
    ME_COMPANY_STRIPE,
    ME_ORDERS_AWAITING_FEEDBACK,
    ME_CARDS,
    MY_FILES,
    ME_FOLDERS,
    ME_COUNT_ORDERS,
    ME_NOTIFICATIONS,
    ME_CUSTOMERS,
    ME_BRANDS,
    ME_DEFAULT_CARD,
};
