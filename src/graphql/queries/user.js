import { gql } from '@apollo/client';
import Order from './order.js';

export const ALL_MANAGERS = gql`
    query {
        allUsers(where: { role: { equals: "manager" } }) {
            id
            firstname
            lastname
        }
    }
`;

export const USERS_FOR_REQUEST = gql`
    query ($where: UserWhereInput) {
        allUsers(where: $where) {
            id
            firstname
            lastname
        }
    }
`;

export const ALL_USERS = gql`
    query ($where: UserWhereInput) {
        allUsers(where: $where) {
            id
            firstname
            lastname
            company {
                id
                name
            }
            companyRole
            email
            role
            picture {
                id
                url
            }
            archived
            orders {
                id
            }
            requestsOwned {
                id
            }
            specialities {
                id
                name
            }
            teamLeadersTeams {
                id
                name
            }
            designerTeams {
                id
                name
            }
            assignedCustomers {
                id
            }
        }
    }
`;

export const ALL_CUSTOMERS_BY_USERS = gql`
    query AllCustomersByUsers(
        $keyword: String
        $account: String
        $role: String
        $status: String
        $skip: Int
        $first: Int
    ) {
        allCustomersByUsers(
            keyword: $keyword
            account: $account
            role: $role
            status: $status
            skip: $skip
            first: $first
        ) {
            data {
                id
                firstname
                lastname
                email
                company {
                    id
                    name
                    subscription {
                        id
                        status
                        willPause
                        plan {
                            id
                            name
                            interval
                        }
                    }
                    teams {
                        id
                        name
                    }
                }
                companyRole
                lastLogin
                activated
                designerTeams {
                    id
                    name
                }
                teamLeadersTeams {
                    id
                    name
                }
            }
            total
        }
    }
`;

export const ALL_MEMBERS = gql`
    query ($where: UserWhereInput, $skip: Int, $first: Int, $orderBy: UserOrderBy) {
        allUsersForAdmin(where: $where, first: $first, skip: $skip, orderBy: $orderBy) {
            id
            firstname
            lastname
            email
            lastLogin
            role
            archived
            picture {
                id
                url
            }
            designerTeams {
                id
                name
            }
            teamLeadersTeams {
                id
                name
            }
            specialities {
                id
                name
            }
            assignedCustomers {
                id
                type {
                    id
                }
            }
        }
        _allUsersCount(where: $where)
    }
`;

export const ALL_WORKERS = gql`
    query {
        allUsers(where: { role: { equals: "worker" } }) {
            id
            firstname
            lastname
            archived
            role
        }
    }
`;

export const ALL_ACTIVE_WORKERS = gql`
    query {
        allUsers(where: { role: { equals: "worker" }, isArchived: false }) {
            id
            firstname
            lastname
            designerTeams {
                id
                name
            }
        }
    }
`;

export const ALL_ACTIVE_WORKERS_BY_TEAM = gql`
    query AllUsers($where: UserWhereInput) {
        allUsers(where: $where) {
            id
            firstname
            lastname
        }
    }
`;

export const ALL_WORKERS_CUSTOMERS = gql`
    query {
        allUsers(where: { role: { equals: "worker" } }, orderBy: { firstname: Asc }) {
            id
            firstname
            lastname
            specialities {
                id
                name
            }
            picture {
                id
                secret
            }
            customers {
                id
            }
        }
    }
`;

export const ALL_TEAM = gql`
    query {
        allUsers(where: { role: { in: ["owner", "manager", "worker"] } }) {
            id
            firstname
            lastname
            role
            email
            lastLogin
            specialities {
                id
                name
            }
            archived
            picture {
                id
                secret
            }
        }
    }
`;

export const ALL_CUSTOMERS = gql`
    query AllCustomers($first: Int, $skip: Int, $where: UserWhereInput) {
        _allUsersCount(where: $where)
        allUsers(orderBy: { createdAt: Desc }, first: $first, skip: $skip, where: $where) {
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
            _ordersCount
            subscription {
                id
                status
                endAt
                quantity
                plan {
                    id
                    name
                }
            }
        }
    }
`;

export const ALL_CUSTOMERS_DEDICATED_DESIGNER = gql`
    query AllCustomers($first: Int, $skip: Int, $where: UserWhereInput, $orderBy: UserOrderBy) {
        _allUsersCount(where: $where)
        allUsers(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
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
            _ordersCount
            customerTeams {
                name
                id
            }
            assignedDesigners {
                id
                type {
                    name
                }
                designer {
                    id
                    firstname
                    lastname
                }
            }
            subscription {
                id
                status
                endAt
                quantity
                plan {
                    id
                    name
                }
            }
            teams {
                id
                name
            }
        }
    }
`;

export const USER = gql`
    query getCustomer($id: ID!) {
        User(id: $id) {
            id
            role
        }
    }
`;

export const USER_NAME = gql`
    query GetUserPublicInfos($id: ID!) {
        User(id: $id) {
            id
            firstname
            lastname
        }
    }
`;

export const USER_INFOS = gql`
    query getCustomer($id: ID!) {
        User(id: $id) {
            id
            createdAt
            firstname
            lastname
            email
            role
            goal
            companyRole
            stripeId
            archived
            picture {
                id
            }
            address {
                id
                address1
                address2
                state
                city
                zipcode
                country
            }
            company {
                id
                name
                website
                nbEmployees
                description
                timezone
            }
            subscription {
                id
                createdAt
                endAt
                quantity
                status
                plan {
                    id
                    name
                }
                status
            }
            timezone
            companyRole
            hasWorkWithDesigner
            previousServices
            heardManyPixelsFrom
            phone
            designFrequencyNeeds
        }
    }
`;

export const USER_BASIC_INFOS = gql`
    query getCustomer($id: ID!) {
        User(id: $id) {
            id
            firstname
            lastname
            email
            picture {
                id
            }
            lastLogin
            subscription {
                id
                endAt
                quantity
                status
                plan {
                    id
                    name
                }
            }
            customerTeams {
                id
                name
            }
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

export const USER_PICTURE = gql`
    query UserPicture($id: ID!) {
        User(id: $id) {
            id
            md5email
            lastLogin
            picture {
                id
                secret
            }
        }
    }
`;

export const USER_SATISFACTION = gql`
    query UserPicture($id: ID!) {
        User(id: $id) {
            id
            orderSatisfaction
            nbFeedbacks: _ordersMeta(where: { feedback: { id_not: null } }) {
                count
            }
        }
    }
`;

export const USER_ORDERS = gql`
    query UserOrder($id: ID!, $where: OrderWhereInput, $orderBy: OrderOrderBy, $first: Int, $skip: Int) {
        User(id: $id) {
            id
            orders(where: $where, orderBy: $orderBy, first: $first, skip: $skip) {
                ...WorkerOrder
            }
            _ordersMeta(where: $where) {
                count
            }
        }
    }
    ${Order.fragment.worker}
`;

export const USER_SPECIALITIES = gql`
    query USER_SPECIALITIES($id: ID!) {
        User(id: $id) {
            id
            specialities {
                id
                name
            }
        }
    }
`;

export const USER_CUSTOMERS = gql`
    query UserCustomers($id: ID!) {
        User(id: $id) {
            id
            customers {
                id
                firstname
                lastname
            }
        }
    }
`;

export const USER_CHECKED_BY = gql`
    query UserCheckedBy($id: ID!) {
        User(id: $id) {
            id
            checkedBy {
                id
                checkedAt
                manager {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`;

export const USER_FREE_ACCESS = gql`
    query UserFreeAccess($id: ID!) {
        User(id: $id) {
            id
            freeAccess
        }
    }
`;

export const CUSTOMER_TEAM = gql`
    query CustomerTeam($id: ID!) {
        User(id: $id) {
            id
            customerTeams {
                id
                name
            }
        }
    }
`;

export const USER_WORK_PROJECTS = gql`
    query UserWorkProject($id: ID!, $first: Int, $skip: Int, $where: OrderWhereInput, $orderBy: OrderOrderBy) {
        User(id: $id) {
            id
            workProjects(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
                ...WorkerOrder
            }
        }
    }
    ${Order.fragment.worker}
`;

export const CUSTOMER_BRANDS_FOR_SEARCH = gql`
    query getCustomer($id: ID!) {
        User(id: $id) {
            company {
                id
                brands {
                    id
                    name
                    logos(take: 1) {
                        url
                    }
                }
            }
        }
    }
`;
export const CUSTOMER_BRANDS = gql`
    query getCustomer($id: ID!) {
        User(id: $id) {
            id
            role
            company {
                id
                brands {
                    id
                    name
                    description
                    industry
                    website
                    logos {
                        id
                        name
                        size
                        url
                        updatedAt
                    }
                    brandGuides {
                        id
                        name
                        size
                        url
                        updatedAt
                    }
                    fonts {
                        id
                        name
                        size
                        url
                        updatedAt
                    }
                    assets {
                        id
                        name
                        size
                        url
                        updatedAt
                    }
                    orders {
                        id
                    }
                }
            }
        }
    }
`;

export const USER_MEMBER_INFO = gql`
    query Member($id: ID!, $where: UserWhereInput, $skip: Int, $first: Int) {
        User(id: $id) {
            id
            firstname
            lastname
            email
            role
            picture {
                id
                url
            }
            teamLeadersTeams {
                id
                name
                designers(where: $where, skip: $skip, first: $first) {
                    id
                    firstname
                    lastname
                    email
                    lastLogin
                    role
                    archived
                    specialities {
                        id
                        name
                    }
                }
                _designersCount(where: $where)
            }
            designerTeams {
                id
                name
            }
            activated
            createdAt
            lastLogin
            specialities {
                id
                name
            }
            archived
            assignedCustomers {
                id
                type {
                    id
                }
            }
        }
    }
`;
