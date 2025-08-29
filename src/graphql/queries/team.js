import { gql } from '@apollo/client';

export const GET_ALL_TEAMS = gql`
    query {
        allTeams {
            id
            name
        }
    }
`;

export const GET_TEAM_DESIGNERS = gql`
    query team($id: ID!, $where: UserWhereInput, $skip: Int, $first: Int) {
        Team(id: $id) {
            id
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
    }
`;

export const GET_TEAM_LEADERS = gql`
    query team($id: ID!, $where: UserWhereInput, $skip: Int, $first: Int) {
        Team(id: $id) {
            id
            teamLeaders(where: $where, skip: $skip, first: $first) {
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
            _teamLeadersCount(where: $where)
        }
    }
`;

export const GET_TEAM_ACCOUNTS = gql`
    query team($id: ID!, $where: CompanyWhereInput, $skip: Int, $first: Int) {
        Team(id: $id) {
            id
            name
            companies(where: $where, skip: $skip, first: $first) {
                id
                name
                createdAt
                users {
                    id
                    firstname
                    lastname
                    email
                    companyRole
                }
                assignedDesigners {
                    id
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
                    plan {
                        id
                        name
                        price
                        interval
                    }
                }
            }
            _companiesCount(where: $where)
        }
    }
`;

export const GET_TEAM = gql`
    query team($id: ID!) {
        Team(id: $id) {
            id
            name
            status
            teamLeaders {
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
            designers {
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
        }
    }
`;

export const GET_TEAMS = gql`
    query AllTeams($first: Int, $skip: Int, $orderBy: TeamOrderBy, $where: TeamWhereInput) {
        _allTeamsCount(where: $where)
        allTeams(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
            id
            name
            status
            teamLeaders {
                id
                firstname
                lastname
            }
            designers {
                id
                firstname
                lastname
            }
            companies {
                id
            }
        }
    }
`;

export const GET_TEAMS_PLANNING = gql`
    query AllTeams($where: TeamWhereInput) {
        allTeams(where: $where) {
            id
            name
            designers {
                id
                firstname
                lastname
                company {
                    id
                    name
                    _ordersCount(where: { status: { in: [ONGOING_PROJECT, ONGOING_REVISION, SUBMITTED] } })
                }
            }
            _designersCount
            _companiesCount
            companies {
                id
                subscription {
                    id
                    plan {
                        id
                        dailyOutput
                    }
                }
            }
        }
    }
`;
