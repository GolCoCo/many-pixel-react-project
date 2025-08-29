import { gql } from '@apollo/client';

export const ADD_ORDER_FOLDER = gql`
    mutation AddOrderFolder($orderId: Int!, $userId: ID, $name: String!) {
        createFolder(orderId: $orderId, userId: $userId, name: $name) {
            id
            name
            createdAt
            updatedAt
            size
            files {
                id
            }
        }
    }
`;

export const RENAME_ORDER_FOLDER = gql`
    mutation RenameOrderFolder($folderId: ID!, $oldName: String!, $name: String!) {
        renameFolder(folderId: $folderId, oldName: $oldName, name: $name) {
            id
            name
            createdAt
            updatedAt
            size
            files {
                id
            }
        }
    }
`;

export const DELETE_FOLDER = gql`
    mutation DeleteFolder($folderId: ID!) {
        deleteFolder(folderId: $folderId) {
            deleted
            folderId
        }
    }
`;

export const UPDATE_FOLDER_VISIBILITY = gql`
    mutation UpdateFolderVisibility($id: ID!, $visibility: Boolean) {
        updateFolderVisibility(id: $id, visibility: $visibility)
    }
`;

export const ATTACH_FILE_TO_FOLDER = gql`
    mutation AttachFileToFolder($folderId: ID!, $fileId: [ID!]!) {
        addToFolderFiles(folderFolderId: $folderId, filesFileId: $fileId) {
            file {
                id
                createdAt
                updatedAt
                name
                size
                url
            }
            folder {
                id
            }
        }
    }
`;

export const ADD_REFERENCE_FOLDER = gql`
    mutation AddOrderFolder($userId: ID!, $name: String!) {
        createFolder(userId: $userId, name: $name) {
            id
            name
            createdAt
            updatedAt
            files {
                id
            }
        }
    }
`;
