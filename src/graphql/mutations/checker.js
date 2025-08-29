import { gql } from '@apollo/client';

export const CHECK_COMPANY = gql`
    mutation CheckCompany($companyId: ID!) {
        checkCompany(companyId: $companyId) {
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
    }
`;
