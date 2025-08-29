import { gql } from '@apollo/client';

export const CREATE_SNIPPET = gql`
    mutation createSnippet($data: SnippetCreateInput!) {
        createSnippet(data: $data) {
            id
        }
    }
`;

export const UPDATE_SNIPPET = gql`
    mutation updateSnippet($where: SnippetWhereUniqueInput!, $data: SnippetUpdateInput!) {
        updateSnippet(where: $where, data: $data) {
            id
        }
    }
`;
