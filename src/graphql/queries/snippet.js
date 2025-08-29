import { gql } from '@apollo/client';

export const SNIPPETS = gql`
    query Snippets($where: SnippetWhereInput) {
        allSnippets(where: $where) {
            id
            name
            text
            user {
                id
                firstname
                lastname
            }
            createdAt
            updatedAt
        }
    }
`;

export const SNIPPET = gql`
    query Snippet($id: ID!) {
        Snippet(id: $id) {
            id
            name
            text
            user {
                id
                firstname
                lastname
            }
            createdAt
            updatedAt
        }
    }
`;
