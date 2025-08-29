import { gql } from '@apollo/client';

export const PROMOTION = gql`
    query Promotion($id: ID!) {
        Promotion(id: $id) {
            id
            name
            plan {
                id
                name
                price
                features
                icon {
                    id
                    url
                }
            }
            couponValue
            couponType
            spots
            maxSpots
            oldPriceMonthly
            discountPriceMonthly
        }
    }
`;
