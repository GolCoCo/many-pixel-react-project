import { gql } from '@apollo/client';

export const DELETE_ASSIGNMENT = gql`
    mutation DELETE_ASSIGNMENT($id: ID!) {
        deleteAssignment(id: $id) {
            id
        }
    }
`;

export const UPDATE_ASSIGNMENTS = gql`
    mutation Assignments($typeId: ID!, $designerIds: [String!], $companyId: ID!) {
        updateAssignments(typeId: $typeId, designerIds: $designerIds, companyId: $companyId) {
            id
        }
    }
`;
