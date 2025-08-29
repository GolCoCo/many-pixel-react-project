import { gql } from '@apollo/client';

export const FOLDER = gql`
    query Folder($id: ID!) {
        Folder(id: $id) {
            id
            name
            files {
                id
                createdAt
                updatedAt
                name
                size
                url
            }
            order {
                id
            }
            user {
                id
                role
            }
        }
    }
`;

export const FOLDER_NAME = gql`
    query FolderName($id: ID!) {
        Folder(id: $id) {
            id
            name
        }
    }
`;

export const FRAGMENT_FOLDER_FILES = gql`
    fragment FolderFiles on Folder {
        id
        files {
            id
            createdAt
            updatedAt
            name
            size
            url
        }
    }
`;
