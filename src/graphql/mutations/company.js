import { gql } from '@apollo/client';

export const CHANGE_COMPANY_LOGO = gql`
    mutation ChangeCompanyLogo($companyCompanyId: ID!, $logoFileId: ID!) {
        setCompanyLogo(companyCompanyId: $companyCompanyId, logoFileId: $logoFileId) {
            logoFile {
                id
            }
            companyCompany {
                id
            }
        }
    }
`;

export const UPDATE_COMPANY = gql`
    mutation UpdateCompany($id: ID!, $name: String, $description: String, $website: String, $timezone: String) {
        updateCompany(id: $id, name: $name, description: $description, website: $website, timezone: $timezone) {
            id
            name
            description
            website
            timezone
        }
    }
`;

export const REMOVE_ACCOUNT_FROM_TEAM = gql`
    mutation companyLeaveTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { companies: { delete: { companyId_teamId: { companyId: $id, teamId: $teamId } } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const COMPANY_JOIN_TEAM = gql`
    mutation companyJoinTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { companies: { create: { companyId: $id } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const ADD_NOTE = gql`
    mutation companyAddNote($id: ID!, $text: String!) {
        addNote(companyId: $id, text: $text) {
            id
        }
    }
`;

export const DELETE_NOTE = gql`
    mutation deleteNote($id: ID!) {
        deleteNote(id: $id) {
            id
        }
    }
`;

export const CLEAR_COMPANY_NOTES = gql`
    mutation updateCompanyByPrisma($id: ID!, $isNotesCleared: Boolean) {
        updateCompanyByPrisma(where: { id: $id }, data: { isNotesCleared: $isNotesCleared }) {
            id
            isNotesCleared
        }
    }
`;
