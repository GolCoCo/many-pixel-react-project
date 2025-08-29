import { gql } from '@apollo/client';

export const FRAGMENT_BRAND_LOGOS = gql`
    fragment BrandLogos on Brand {
        logos {
            id
            name
            size
            url
            updatedAt
        }
    }
`;
export const FRAGMENT_BRAND_GUIDES = gql`
    fragment BrandGuides on Brand {
        brandGuides {
            id
            name
            size
            url
            updatedAt
        }
    }
`;
export const FRAGMENT_BRAND_FONTS = gql`
    fragment BrandFonts on Brand {
        fonts {
            id
            name
            size
            url
            updatedAt
        }
    }
`;
export const FRAGMENT_BRAND_ASSETS = gql`
    fragment BrandAssets on Brand {
        assets {
            id
            name
            size
            url
            updatedAt
        }
    }
`;

export const GET_BRAND = gql`
    query brand($id: ID!) {
        Brand(id: $id) {
            id
            name
            description
            website
            industry
            colors {
                id
                name
                colorValue
                type
            }
            company {
                id
            }
            ...BrandLogos
            ...BrandGuides
            ...BrandFonts
            ...BrandAssets
        }
    }
    ${FRAGMENT_BRAND_LOGOS}
    ${FRAGMENT_BRAND_GUIDES}
    ${FRAGMENT_BRAND_FONTS}
    ${FRAGMENT_BRAND_ASSETS}
`;
