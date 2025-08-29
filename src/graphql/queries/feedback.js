import { gql } from '@apollo/client';

export const FEEDBACK = gql`
    query FeedbackById($id: ID!) {
        Feedback(id: $id) {
            id
            score
            scoreQuality
            scoreCommunication
            scoreSpeed
            comment
        }
    }
`;
