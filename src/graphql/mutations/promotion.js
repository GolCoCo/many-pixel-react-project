import { gql } from '@apollo/client';

export const BUY_PROMOTION = gql`
    mutation BuyPromotion($card: String, $promotionId: ID!) {
        buyPromotion(card: $card, promotionId: $promotionId) {
            plan
            name
            price
            customerStripeId
        }
    }
`;
