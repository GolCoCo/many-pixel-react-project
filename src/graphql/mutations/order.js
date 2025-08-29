import { gql } from '@apollo/client';

export const NEW_ORDER = gql`
    mutation NewOrder($input: NewOrderInput!) {
        newOrder(input: $input) {
            id
        }
    }
`;

export const UPDATE_ORDERS_PRIORITY = gql`
    mutation UpdateOrdersPriority($orders: [OrderUpdateInput!]!) {
        updateOrdersPriority(orders: $orders)
    }
`;

export const CHANGE_ORDER_MANAGER = gql`
    mutation UpdateOrderManager($id: Int!, $managerId: ID!) {
        addToOrderManager(manageProjectsOrderId: $id, managerUserId: $managerId) {
            managerUser {
                id
            }
            manageProjectsOrder {
                id
            }
        }
    }
`;

export const CHANGE_ORDER_STATUS = gql`
    mutation ChangeOrderStatus($id: Int!, $status: OrderStatusType!) {
        updateOrderStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;

export const MARK_AS_COMPLETE = gql`
    mutation MarkAsComplete($id: Int!, $feedback: String, $rate: String) {
        markAsComplete(id: $id, feedback: $feedback, rate: $rate) {
            id
            status
        }
    }
`;

export const REOPEN_ORDER = gql`
    mutation ReopenOrder($id: Int!, $message: String, $move: String, $fileIds: [ID!]) {
        reopenOrder(id: $id, move: $move, message: $message, fileIds: $fileIds) {
            id
            status
        }
    }
`;

export const ASSIGN_ORDER_WORKERS = gql`
    mutation AssignOrderWorkers($id: Int!, $workersIds: [String!]) {
        assignOrderWorkers(orderId: $id, workersIds: $workersIds) {
            id
            workers {
                id
            }
        }
    }
`;

export const PAUSE_ORDER = gql`
    mutation PauseOrder($id: Int!) {
        pauseOrder(id: $id) {
            id
            status
            priority
        }
    }
`;

export const PRIORITIZE_ORDER = gql`
    mutation PrioritizeOrder($id: Int!) {
        prioritizeOrder(id: $id) {
            id
            prioritizedAt
        }
    }
`;

export const UNPRIORITIZE_ORDER = gql`
    mutation UnprioritizeOrder($id: Int!) {
        unprioritizeOrder(id: $id) {
            id
            prioritizedAt
        }
    }
`;

export const RESUME_ORDER = gql`
    mutation ResumeOrder($id: Int!, $move: String) {
        resumeOrder(id: $id, move: $move) {
            id
            status
            priority
        }
    }
`;

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($input: UpdateOrderFileInput!, $id: Int!) {
        updateOrder(input: $input, id: $id) {
            id
        }
    }
`;

export const DELETE_ORDER = gql`
    mutation DeleteOrder($id: Int!) {
        deleteOrder(id: $id) {
            id
        }
    }
`;

export const UPDATE_ORDERS_OWNERS = gql`
    mutation UpdateOrdersOwners($customerRequestIds: [Int!]!, $requestIds: [Int!]!, $ownerIds: [String!]!, $ownerIdToRemove: ID!) {
        updateOrdersOwners(customerRequestIds: $customerRequestIds, requestIds: $requestIds, ownerIds: $ownerIds, ownerIdToRemove: $ownerIdToRemove)
    }
`;

export const UPDATE_ORDER_OWNERS = gql`
    mutation UpdateOrderOwners($orderId: Int!, $ownerIds: [String!]!, $ownersToDisconnectIds: [String!]!) {
        updateOrderOwners(orderId: $orderId, ownerIds: $ownerIds, ownersToDisconnectIds: $ownersToDisconnectIds)
    }
`;

export const READ_ORDER_MESSAGES = gql`
    mutation ReadOrderMessages($id: Int!) {
        readOrderMessages(id: $id) {
            id
        }
    }
`;
