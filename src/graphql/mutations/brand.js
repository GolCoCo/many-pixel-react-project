import { gql } from '@apollo/client';

export const CREATE_BRAND = gql`
    mutation createBrand($name: String!, $industry: String, $description: String, $website: String) {
        createBrand(name: $name, industry: $industry, description: $description, website: $website) {
            id
            name
            industry
            description
            website
        }
    }
`;

export const UPDATE_BRAND = gql`
    mutation updateBrand(
        $id: ID!
        $name: String
        $industry: String
        $description: String
        $website: String
        $colorToDelete: String
        $logosIds: [String!]
        $logoToDelete: String
        $guideIds: [String!]
        $guideToDelete: String
        $fontsIds: [String!]
        $fontToDelete: String
        $assetsIds: [String!]
        $assetToDelete: String
    ) {
        updateBrand(
            id: $id
            name: $name
            industry: $industry
            description: $description
            website: $website
            colorToDelete: $colorToDelete
            logosIds: $logosIds
            logoToDelete: $logoToDelete
            guideIds: $guideIds
            guideToDelete: $guideToDelete
            fontsIds: $fontsIds
            fontToDelete: $fontToDelete
            assetsIds: $assetsIds
            assetToDelete: $assetToDelete
        ) {
            id
            name
            industry
            description
            website
            colors {
                id
                name
                colorValue
                type
            }
            logos {
                id
                name
                size
                url
                updatedAt
            }
            brandGuides {
                id
                name
                size
                url
                updatedAt
            }
            fonts {
                id
                name
                size
                url
                updatedAt
            }
            assets {
                id
                name
                size
                url
                updatedAt
            }
        }
    }
`;

export const DELETE_BRAND = gql`
    mutation deleteBrand($id: ID!) {
        deleteBrand(id: $id) {
            id
        }
    }
`;

export const ADD_NEW_COLOR_TO_BRAND = gql`
    mutation addNewColorToBrand($name: String!, $colorValue: String!, $type: String!, $brandId: String) {
        addNewColorToBrand(name: $name, colorValue: $colorValue, type: $type, id: $brandId) {
            id
            colors {
                id
                name
                colorValue
                type
            }
        }
    }
`;

export const ADD_NEW_COLORS_TO_BRAND = gql`
    mutation addNewColorsToBrand($colors: [ColorCreateInput!]!) {
        addNewColorsToBrand(colors: $colors) {
            id
        }
    }
`;
