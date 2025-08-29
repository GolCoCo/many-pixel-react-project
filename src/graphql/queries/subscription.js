import { gql } from '@apollo/client';

export const SUBSCRIPTION = gql`
    query CustomerSubscription($userId: ID!) {
        CustomerSubscription(userId: $userId) {
            id
            status
            paymentMethod {
                billingDetails {
                    address {
                        city
                        country
                        line1
                        line2
                        postalCode
                        state
                    }
                    email
                    name
                    phone
                }
                card {
                    expMonth
                    expYear
                    last4
                    brand
                    country
                }
                id
                customer
            }
            endAt
            cancellationPromoUsed
            plan {
                id
                name
                interval
                dailyOutput
            }
            stripeData {
                id
                nextBillingDate
            }
            upcomingInvoice {
                amountDue
                items {
                    id
                    amount
                    description
                }
                total
                subtotal
            }
            user {
                id
                firstname
                lastname
                email
            }
        }
    }
`;

export const COMPANY_SUBSCRIPTIONS = gql`
    query CompanySubscriptions($companyIds: [ID!]) {
        allCustomerSubscriptions(companyIds: $companyIds) {
            id
            status
            cancelSubscriptionFeedback {
                id
                reason
                feedback
                createdAt
                updatedAt
                additionalReason
            }
        }
    }
`;

export const SUBSCRIPTION_INVOICES = gql`
    query InvoiceHistory($limit: Int, $startingAfter: String, $endingBefore: String, $subscriptionId: ID) {
        getInvoices(limit: $limit, startingAfter: $startingAfter, endingBefore: $endingBefore, subscriptionId: $subscriptionId) {
            data {
                id
                key: id
                amountDue
                periodStart
                periodEnd
                createdAt
                billNumber
                subtotal
                total
                paid
                description
                pdf
                brand
                status
            }
            hasMore
        }
    }
`;
