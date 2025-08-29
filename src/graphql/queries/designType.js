import { gql } from '@apollo/client';

export const DESIGN_TYPES = gql`
    query DESIGN_TYPES($where: DesignTypeWhereInput) {
        allDesignTypes(where: $where, orderBy: { createdAt: Desc }) {
            id
            name
        }
    }
`;

export const DESIGN_TYPE_WORKERS = gql`
    query DESIGN_TYPES($where: DesignTypeWhereInput, $orderBy: DesignTypeOrderBy) {
        allDesignTypes(where: $where, orderBy: $orderBy) {
            id
            name
            designers {
                id
                firstname
                lastname
                designerTeams {
                    id
                }
            }
        }
    }
`;
