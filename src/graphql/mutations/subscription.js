import { gql } from '@apollo/client';

export const UPDATE_PAYMENT_METHOD = gql`
    mutation UpdatePaymentMethod(
        $card: String
        $id: ID
        $billingAddress: BillingAddressInput
        $email: String
        $expYear: Int
        $expMonth: Int
        $cardHolder: String
    ) {
        updatePaymentMethod(
            card: $card
            id: $id
            billingAddress: $billingAddress
            email: $email
            expYear: $expYear
            expMonth: $expMonth
            cardHolder: $cardHolder
        ) {
            paymentMethod
        }
    }
`;

export const UPDATE_SUBSCRIPTION = gql`
    mutation UpdateSubscription($quantity: Int!, $planId: ID!, $discount: String) {
        updateSubscription(quantity: $quantity, planId: $planId, discount: $discount) {
            id
        }
    }
`;

export const ACCEPT_CANCELLATION_PROMOTION = gql`
    mutation AcceptCancellationPromotion($planId: ID!) {
        acceptCancellationPromotion(planId: $planId) {
            id
        }
    }
`;

export const RESUME_SUBSCRIPTION = gql`
    mutation ResumeSubscription {
        resumeSubscription {
            id
        }
    }
`;

export const FIND_STRIPE_DISCOUNT = gql`
    query FindStripeDiscount($code: String!) {
        findStripeDiscount(code: $code) {
            value
            percent
            name
            id
        }
    }
`;
