import { gql } from '@apollo/client';

export const LINK_COMPANY_STRIPE_ACCOUNT = gql`
    query LinkCompanyStripeAccount($code: String!, $companyId: ID!) {
        linkCompanyStripeAccount(code: $code, companyId: $companyId) {
            linked
        }
    }
`;

export const INVOICES = gql`
    query GetInvoice($userId: ID, $limit: Int, $startingAfter: String) {
        getInvoices(userId: $userId, limit: $limit, startingAfter: $startingAfter) {
            id
            amountDue
            periodStart
            periodEnd
            billNumber
            subtotal
            total
            paid
            description
            pdf
            brand
            last4
        }
    }
`;

export const GET_INVOICE = gql`
    query GetInvoice($stripeId: String!) {
        getInvoice(stripeId: $stripeId) {
            lines
        }
    }
`;

export const GET_INVOICE_PREVIEW = gql`
    query GetInvoice($newPlanId: ID!, $quantity: Int, $discount: String) {
        getInvoicePreview(newPlanId: $newPlanId, quantity: $quantity, discount: $discount) {
            amount
        }
    }
`;

export const GET_STRIPE_BALANCE = gql`
    query GetStripeBalance {
        stripeBalance
    }
`;
