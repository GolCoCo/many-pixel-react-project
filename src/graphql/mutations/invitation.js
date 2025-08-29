import { gql } from '@apollo/client';

export const ADD_INVITATION = gql`
    mutation CreateInvitation($email: String!, $companyId: String, $role: String, $teamId: ID, $specialityIds: [ID!]) {
        createInvitation(email: $email, companyId: $companyId, role: $role, teamId: $teamId, specialityIds: $specialityIds) {
            id
            email
            createdAt
        }
    }
`;

export const GET_INVITATION_LINK = gql`
    mutation CreateInvitationLink($companyId: String, $role: String, $teamId: ID, $specialityIds: [ID!]) {
        createInvitationLink(companyId: $companyId, role: $role, teamId: $teamId, specialityIds: $specialityIds) {
            link
        }
    }
`;

export const DELETE_INVITATION = gql`
    mutation DeleteInvitation($id: ID!) {
        deleteInvitation(id: $id) {
            id
        }
    }
`;

export const INVITATION_SIGNUP = gql`
    mutation InvitationSignup($id: ID!, $password: String!, $firstname: String!, $lastname: String!) {
        invitationSignup(id: $id, password: $password, firstname: $firstname, lastname: $lastname) {
            id
            token
        }
    }
`;
