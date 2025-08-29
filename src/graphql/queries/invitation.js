import { gql } from '@apollo/client';

export const INVITATION = gql`
    query GetInvitation($id: ID!) {
        Invitation(id: $id) {
            invitation {
                id
                email
                creatorId
                company {
                    id
                }
                companyRole
                role
                team {
                    id
                }
                specialities {
                    id
                }
            }
            token
        }
    }
`;

export const ALL_INVITATIONS = gql`
    query {
        allInvitations {
            id
            email
            createdAt
        }
    }
`;
