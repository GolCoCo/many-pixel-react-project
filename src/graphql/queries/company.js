import { gql } from '@apollo/client';

export const COMPANY = gql`
    query Company($id: ID!) {
        Company(id: $id) {
            id
            name
            logo {
                id
            }
        }
    }
`;

export const ALL_ACTIVE_COMPANIES = gql`
    query ($where: CompanyWhereInput) {
        allActiveCompanies(where: $where) {
            id
            name
        }
    }
`;
export const ALL_COMPANIES = gql`
    query {
        allCompanies(where: { name: { not: { contains: "ManyPixels" }, mode: Insensitive } }) {
            id
            name
        }
    }
`;

export const ALL_CUSTOMERS_BY_COMPANIES = gql`
    query AllCustomersByCompanies($keyword: String, $plan: String, $team: String, $status: String, $skip: Int, $first: Int) {
        allCustomersByCompanies(keyword: $keyword, plan: $plan, team: $team, status: $status, skip: $skip, first: $first) {
            data {
                id
                name
                createdAt
                users {
                    id
                    email
                }
                subscription {
                    id
                    willPause
                    endAt
                    status
                    user {
                        id
                        email
                    }
                    plan {
                        id
                        name
                        interval
                    }

                    statusFinal
                }
                teams {
                    id
                    name
                }
                assignedDesigners {
                    designer {
                        id
                        firstname
                        lastname
                    }
                }
            }
            total
        }
    }
`;

export const ALL_COMPANIES_REQUESTS = gql`
    query AllCompaniesRequests($team: String, $keyword: String, $designer: String, $offset: Int, $limit: Int) {
        allCompaniesRequests(team: $team, keyword: $keyword, designer: $designer, offset: $offset, limit: $limit) {
            data {
                id
                name
                teams {
                    id
                    name
                }
                subscription {
                    id
                    status
                    endAt
                    willPause
                    plan {
                        id
                        name
                        interval
                        dailyOutput
                        type
                    }
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
                orders {
                    id
                }
                checkedBy {
                    id
                    checkedAt
                    manager {
                        id
                        firstname
                        lastname
                        picture {
                            id
                            url
                        }
                    }
                }
                notes(orderBy: { createdAt: Asc }) {
                    id
                    text
                }
                isNotesCleared
            }
            total
        }
    }
`;

export const COMPANY_INVITATIONS = gql`
    query Company($id: ID!) {
        Company(id: $id) {
            id
            invitations {
                id
                email
                createdAt
            }
        }
    }
`;

export const COMPANY_WIZARD = gql`
    query CompanyWizard($id: ID!) {
        Company(id: $id) {
            id
            name
            wizard {
                id
                categories {
                    id
                }
            }
        }
    }
`;

export const ALL_COMPANIES_PLANNING = gql`
    query {
        allCompanies(where: { name_not_contains: "ManyPixels" }) {
            id
            name
            brands {
                id
                name
                logos {
                    id
                    size
                    url
                    secret
                }
            }
            _ordersCount(where: { status: { in: [ONGOING_PROJECT, ONGOING_REVISION, COMPLETED] } })
            teams {
                id
                name
            }
            assignedDesigners {
                id
                designer {
                    id
                    firstname
                    lastname
                }
            }
        }
        allTeams {
            id
            name
            designers {
                id
                firstname
                lastname
            }
        }
    }
`;

export const ALL_COMPANIES_UNASSIGNED_DESIGNER = gql`
    query {
        allCompanies(
            where: {
                name: { not: { contains: "ManyPixels" } }
                subscription: { status: "active", plan: { type: DESIGNER_BASED } }
                assignedDesigners: { none: {} }
            }
        ) {
            id
            name
            brands {
                id
                logos {
                    id
                    url
                }
            }
            _ordersCount(where: { status: { in: [ONGOING_PROJECT, ONGOING_REVISION, COMPLETED] } })
        }
    }
`;

export const ALL_COMPANIES_UNASSIGNED_TEAM = gql`
    query {
        allCompanies(where: { subscription: { status: "active", plan: { type: DESIGNER_BASED } }, teams: { none: {} } }) {
            id
            name
            brands {
                id
                logos {
                    id
                    url
                }
            }
            _ordersCount(where: { status: { in: [ONGOING_PROJECT, ONGOING_REVISION, COMPLETED] } })
        }
    }
`;

export const ALL_COMPANY_ACCOUNTS_WITH_OWNER = gql`
    query CompanyAccountWithOwner($teamId: String) {
        allCompanies(where: { name: { not: { contains: "ManyPixels" }, mode: Insensitive }, teams: { every: { teamId: { not: { equals: $teamId } } } } }) {
            id
            name
            teams {
                id
            }
            users {
                id
                firstname
                lastname
                email
                role
                companyRole
                picture {
                    id
                    url
                }
            }
            logo {
                id
                url
            }
            assignedDesigners {
                id
            }
        }
    }
`;

export const COMPANY_USERS = gql`
    query Company($id: ID!) {
        Company(id: $id) {
            id
            users {
                id
                firstname
                lastname
            }
            assignedDesigners {
                id
                designer {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`;

export const COMPANY_ACCOUNT_INFO = gql`
    query Company($id: ID!, $usersWhere: UserWhereInput, $skip: Int, $first: Int) {
        Company(id: $id) {
            id
            name
            logo {
                id
                url
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
                    specialities {
                        id
                    }
                }
            }
            checkedBy {
                id
                checkedAt
                manager {
                    id
                    firstname
                    lastname
                    picture {
                        id
                        url
                    }
                }
            }
            timezone
            createdAt
            industry
            website
            nbEmployees
            teams {
                id
                name
            }
            subscription {
                id
                status
                paymentMethod {
                    billingDetails {
                        address {
                            city
                            country
                            line1
                            line2
                            postalCode
                            state
                        }
                        email
                        name
                        phone
                    }
                    card {
                        expMonth
                        expYear
                        last4
                        brand
                        country
                    }
                    id
                    customer
                }
                endAt
                willPause
                user {
                    id
                    email
                    heardManyPixelsFrom
                }
                plan {
                    id
                    name
                    interval
                }
            }
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
            notes(orderBy: { createdAt: Desc }) {
                id
                text
                createdAt
                user {
                    id
                    firstname
                    lastname
                }
            }
            isNotesCleared
            _usersCount(where: $usersWhere)
            users(where: $usersWhere, skip: $skip, first: $first) {
                id
                firstname
                lastname
                email
                company {
                    id
                    subscription {
                        id
                        status
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
        }
    }
`;

export const COMPANY_DESIGNERS = gql`
    query Company($id: ID!) {
        Company(id: $id) {
            id
            orders {
                id
                status
                workers {
                    id
                    firstname
                    lastname
                    email
                    picture {
                        id
                        url
                    }
                }
            }
            assignedDesigners {
                id
                designer {
                    id
                    firstname
                    lastname
                    email
                    picture {
                        id
                        url
                    }
                }
            }
        }
    }
`;
