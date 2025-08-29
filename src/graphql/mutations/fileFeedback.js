import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
    mutation AddComment($content: String!, $fileFeedbackId: ID!, $fileId: ID!, $orderId: Int!) {
        addComment(content: $content, fileFeedbackId: $fileFeedbackId, fileId: $fileId, orderId: $orderId) {
            id
        }
    }
`;

export const EDIT_COMMENT = gql`
    mutation EditComment($content: String!, $id: ID!) {
        editComment(content: $content, id: $id) {
            id
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
        }
    }
`;

export const CREATE_FEEDBACK = gql`
    mutation CreateFileFeedback($content: String!, $x: Float!, $y: Float!, $fileId: ID!, $orderId: Int!) {
        createFileFeedback(content: $content, x: $x, y: $y, fileId: $fileId, orderId: $orderId) {
            id
        }
    }
`;

export const EDIT_FEEDBACK = gql`
    mutation EditFileFeedback($content: String!, $id: ID!) {
        editFileFeedback(content: $content, id: $id) {
            id
        }
    }
`;

export const DELETE_FEEDBACK = gql`
    mutation DeleteFileFeedback($id: ID!) {
        deleteFileFeedback(id: $id) {
            id
        }
    }
`;

export const READ_FEEDBACK = gql`
    mutation ReadFileFeedback($fileFeedbackId: ID!) {
        readFileFeedback(fileFeedbackId: $fileFeedbackId) {
            id
        }
    }
`;
