import { gql } from '@apollo/client';

export const CREATE_TEAM = gql`
    mutation CreateTeam($data: TeamCreateInput!) {
        createTeam(data: $data) {
            id
            name
        }
    }
`;

export const UPDATE_TEAM = gql`
    mutation UpdateTeam($data: TeamUpdateData!, $where: TeamWhereUniqueInput!) {
        updateTeam(data: $data, where: $where) {
            id
            name
        }
    }
`;
