import { gql } from '@apollo/client';

export const UPDATE_FILE_VISIBILITY = gql`
    mutation UpdateFileVisibility($id: ID!, $visibility: Boolean) {
        updateFile(id: $id, data: { isHidden: $visibility }) {
            id
        }
    }
`;

export const DELETE_FILE = gql`
    mutation DeleteFile($id: ID!) {
        deleteFile(id: $id) {
            id
        }
    }
`;

export const EDIT_FILENAME = gql`
    mutation UpdateFile($id: ID!, $name: String!) {
        updateFile(id: $id, data: { name: $name }) {
            id
            name
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation UploadFile($file: Upload!, $isPublic: Boolean = true) {
        uploadFile(file: $file, isPublic: $isPublic) {
            id
            name
            url
        }
    }
`;

export const SAVE_FILE = gql`
    mutation saveFile($name: String!, $type: String!, $secret: String!, $size: Int!) {
        saveFile(name: $name, type: $type, secret: $secret, size: $size) {
            id
            name
            url
        }
    }
`;

export const UPLOAD_FILES = gql`
    mutation UploadFiles($files: [Upload!]!) {
        uploadFiles(files: $files) {
            id
            name
            url
        }
    }
`;

export const DOWNLOAD_FILE = gql`
    mutation DownloadFile($id: ID!) {
        downloadFile(id: $id) {
            signedURL
        }
    }
`;
