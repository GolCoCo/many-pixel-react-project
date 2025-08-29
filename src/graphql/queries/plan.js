import gql from 'graphql-tag';

export const PLAN = gql`
    query Plan($id: ID!) {
        Plan(id: $id) {
            id
            name
            price
            interval
            activated
            dailyOutput
            visible
            stripeId
            services {
                id
                name
                isActivated
            }
            featuresTitle
            features
            tooltips
            type
            createdAt
        }
    }
`;

export const PLAN_FULL = gql`
    query Plan($id: ID!) {
        Plan(id: $id) {
            id
            name
            activated
            visible
            createdAt
            price
            description
            nbSameTimeOrder
            stripeId
            maxQuantity
            features
            interval
            type
            monthlyPriceReference
            icon {
                id
            }
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

export const ALL_PLANS = gql`
    query allPlans($activated: Boolean) {
        allPlans(where: { isActivated: $activated }, orderBy: { createdAt: Desc }) {
            id
            name
            price
            description
            visible
            activated
            interval
            createdAt
            _customerSubscriptionsCount(where: { status: { equals: "active" } })
        }
    }
`;

export const ALL_PLANS_VISITOR = gql`
    query {
        allPlans {
            id
            name
            price
            description
            visible
            activated
            interval
        }
    }
`;

export const ALL_PLANS_TO_SUB = gql`
    query AllPlans($interval: PLAN_INTERVAL) {
        allPlans(where: { isVisible: true, interval: $interval }, orderBy: { price: Asc }) {
            id
            name
            price
            type
            nbSameTimeOrder
            maxQuantity
            interval
            features
            monthlyPriceReference
            categories {
                id
                title
            }
            icon {
                id
                url
            }
            tooltips
            featuresTitle
            dailyOutput
        }
    }
`;

export const ALL_PLANS_TO_TYPE = gql`
    query AllPlans($type: PLAN_TYPE) {
        allPlans(where: { type: $type }) {
            id
            name
            price
            type
            nbSameTimeOrder
            maxQuantity
            interval
            features
            icon {
                id
                url
            }
        }
    }
`;

export const PAUSE_PLAN = gql`
    query PausePlan {
        PausePlan {
            id
            name
            price
            interval
            stripeId
        }
    }
`;
