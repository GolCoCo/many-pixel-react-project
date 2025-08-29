import { gql } from '@apollo/client';

export const GET_SETTING = gql`
    query Setting($key: String!) {
        Setting(key: $key) {
            id
            value
            key
        }
    }
`;
