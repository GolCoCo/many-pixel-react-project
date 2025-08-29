import { gql } from '@apollo/client';

export const ADD_PLAN = gql`
    mutation AddPlan(
        $activated: Boolean!
        $dailyOutput: Int!
        $features: [String!]!
        $featuresTitle: String
        $interval: PLAN_INTERVAL!
        $name: String!
        $price: Int!
        $servicesIds: [String!]!
        $stripeId: String!
        $tooltips: JSON
        $visible: Boolean!
    ) {
        createSubscriptionPlan(
            activated: $activated
            dailyOutput: $dailyOutput
            features: $features
            featuresTitle: $featuresTitle
            interval: $interval
            name: $name
            price: $price
            servicesIds: $servicesIds
            stripeId: $stripeId
            tooltips: $tooltips
            visible: $visible
        ) {
            id
            createdAt
            name
            price
            visible
            interval
        }
    }
`;

export const UPDATE_PLAN = gql`
    mutation UpdatePlan(
        $id: ID!
        $activated: Boolean!
        $dailyOutput: Int!
        $features: [String!]!
        $featuresTitle: String
        $name: String!
        $servicesIds: [String!]!
        $servicesIdsToDisconnect: [String!]
        $tooltips: JSON
        $visible: Boolean!
    ) {
        updatePlan(
            id: $id
            activated: $activated
            dailyOutput: $dailyOutput
            features: $features
            featuresTitle: $featuresTitle
            name: $name
            servicesIds: $servicesIds
            servicesIdsToDisconnect: $servicesIdsToDisconnect
            tooltips: $tooltips
            visible: $visible
        ) {
            id
            name
            activated
            visible
            createdAt
            price
            description
            nbSameTimeOrder
            stripeId
            features
            type
            monthlyPriceReference
            categories {
                id
                title
            }
            services {
                id
                name
            }
        }
    }
`;

export const BUY_PLAN = gql`
    mutation BuyPlan($card: String!, $plan: String!, $discount: String, $discountType: String, $referrerId: String) {
        buySubscription(card: $card, plan: $plan, discount: $discount, referrerId: $referrerId, discountType: $discountType) {
            plan
            price
            name
            interval
            nextBillingDate
            status
            isCanceledAtEnd
            interval
            customerStripeId
        }
    }
`;

export const CANCEL_PLAN = gql`
    mutation CancelSubscription($reason: CANCEL_SUBSCRIPTION_REASON!, $feedback: SubscriptionCancellationFeedback!, $additionalReason: String) {
        cancelSubscription(reason: $reason, feedback: $feedback, additionalReason: $additionalReason) {
            endAt
        }
    }
`;

export const PAUSE_PLAN = gql`
    mutation PauseSubscription($delayed: Boolean, $reason: CANCEL_SUBSCRIPTION_REASON!, $feedback: SubscriptionCancellationFeedback!, $additionalReason: String) {
        pauseSubscription(delayed: $delayed, reason: $reason, feedback: $feedback, additionalReason: $additionalReason) {
            id
            status
            endAt
        }
    }
`;
