import gql from 'graphql-tag';

const Order = {
    fragment: {
        customer: gql`
            fragment CustomerOrder on Order {
                id
                name
                createdAt
                startedAt
                endAt
                status
                priority
                unreadMessages
                discussion {
                    id
                    lastSeens
                    messages(where: { isNote: false }, orderBy: { createdAt: Desc }, first: 1) {
                        id
                        createdAt
                        user {
                            id
                        }
                    }
                }
                service {
                    id
                    name
                }
                category {
                    id
                    title
                }
                workers {
                    id
                    firstname
                    lastname
                }
            }
        `,
        worker: gql`
            fragment WorkerOrder on Order {
                id
                createdAt
                startedAt
                status
                name
                discussion {
                    id
                    lastSeens
                    messages(orderBy: { createdAt: Asc }, first: 1) {
                        id
                        createdAt
                        user {
                            id
                        }
                    }
                }
                category {
                    id
                    title
                }
                service {
                    id
                    name
                }
                workers {
                    id
                    firstname
                    lastname
                }
                customer {
                    id
                    firstname
                    lastname
                    subscription {
                        id
                        status
                        quantity
                        plan {
                            id
                            name
                        }
                    }
                    teams {
                        id
                        name
                    }
                }
            }
        `,
        files: gql`
            fragment OrderFiles on Order {
                id
                name
                createdAt
                startedAt
                status
                attachments {
                    id
                    contentType
                    secret
                    name
                    size
                    updatedAt
                    url
                    feedback {
                        id
                        x
                        y
                        content
                        createdAt
                        readBy {
                            userId
                        }
                        user {
                            id
                            firstname
                            lastname
                            picture {
                                id
                                url
                            }
                        }
                        comments {
                            id
                            content
                            createdAt
                            user {
                                id
                                picture {
                                    id
                                    url
                                }
                                firstname
                                lastname
                            }
                            readBy {
                                userId
                            }
                        }
                    }
                }
                previews {
                    id
                    name
                    updatedAt
                    files {
                        id
                        contentType
                        secret
                        name
                        size
                        updatedAt
                        url
                        feedback {
                            id
                            x
                            y
                            content
                            createdAt
                            readBy {
                                userId
                            }
                            user {
                                id
                                firstname
                                lastname
                                picture {
                                    id
                                    url
                                }
                            }
                            comments {
                                id
                                content
                                createdAt
                                user {
                                    id
                                    picture {
                                        id
                                        url
                                    }
                                    firstname
                                    lastname
                                }
                                readBy {
                                    userId
                                }
                            }
                        }
                    }
                }
            }
        `,
    },
};

export const ORDER = gql`
    query Order($id: Int!) {
        Order(id: $id) {
            id
            name
            priority
            prioritizedAt
            unreadMessages
            createdAt
            updatedAt
            startedAt
            submittedAt
            pausedAt
            status
            rate
            feedback {
                id
                comment
            }
            category {
                id
                title
            }
            service {
                id
                name
            }
            deliverables
            otherDeliverables
            attachments {
                id
                name
                size
                url
                contentType
                createdAt
                updatedAt
            }
            company {
                id
                name
                users {
                    id
                    firstname
                    lastname
                    picture {
                        id
                        url
                    }
                }
                notes {
                    id
                    text
                }
                subscription {
                    id
                    createdAt
                    plan {
                        id
                        name
                        interval
                    }
                }
                isNotesCleared
            }
            recentFiles {
                id
                name
                contentType
                size
                url
                createdAt
                updatedAt
                folder {
                    id
                    isHidden
                }
                feedback {
                    id
                    comments {
                        id
                        readBy {
                            userId
                        }
                    }
                    readBy {
                        userId
                    }
                }
                isHidden
            }
            brand {
                id
                name
                colors {
                    name
                }
                logos {
                    name
                    size
                    url
                }
            }
            description
            owners {
                id
                firstname
                lastname
            }
            customer {
                id
                firstname
                lastname
            }
            workers {
                id
                firstname
                lastname
            }
            discussionId
            previews {
                id
                name
                files {
                    id
                    name
                    size
                    url
                    contentType
                    isHidden
                }
                size
                updatedAt
                createdAt
                isHidden
                isDefault
            }
            brief {
                id
                answer
                question
                answerType: type
                files {
                    id
                    url
                    name
                    size
                }
            }
            briefAttachments {
                id
                contentType
                name
                size
                url
                createdAt
                feedback {
                    id
                    comments {
                        id
                        readBy {
                            userId
                        }
                    }
                    readBy {
                        userId
                    }
                }
            }
        }
    }
`;

export const ORDER_INFOS = gql`
    query Order($id: Int!) {
        Order(id: $id) {
            id
            endAt
            createdAt
            workers {
                id
                firstname
                lastname
            }
            service {
                id
                name
            }
            category {
                id
                title
            }
        }
    }
`;

export const ORDER_BRIEF = gql`
    query Order($id: Int!) {
        Order(id: $id) {
            id
            brand {
                id
                name
                url
                colors {
                    hex
                    name
                }
                logos {
                    name
                    size
                    url
                }
            }
            brief {
                id
                answer
                question
                answerType: type
                files {
                    id
                    url
                    name
                    size
                }
            }
        }
    }
`;

export const ORDER_NAME = gql`
    query OrderName($id: Int!) {
        Order(id: $id) {
            id
            name
        }
    }
`;

export const ORDER_STATUS = gql`
    query OrderName($id: Int!) {
        Order(id: $id) {
            id
            status
        }
    }
`;

export const ALL_ORDERS = gql`
    query AllOrders($first: Int, $skip: Int, $where: OrderWhereInput, $orderBy: OrderOrderBy) {
        _allOrdersMeta(where: $where) {
            total
            count
        }
        allOrders(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
            id
            createdAt
            startedAt
            priority
            endAt
            submittedAt
            pausedAt
            resumedAt
            updatedAt
            deliveredAt
            reopenedAt
            status
            name
            rate
            unreadMessages
            description
            deliverables
            otherDeliverables
            brand {
                id
                name
                logos {
                    name
                    size
                    url
                }
            }
            feedback {
                comment
            }
            category {
                id
                title
                slug
            }
            service {
                id
                name
            }
            company {
                id
                users {
                    id
                    firstname
                    lastname
                }
                teams {
                    id
                    name
                }
            }
            workers {
                id
                firstname
                lastname
                picture {
                    id
                    url
                }
            }
            owners {
                id
                firstname
                lastname
            }
            previews {
                id
                name
                files {
                    id
                    name
                    size
                    url
                    contentType
                }
            }
        }
    }
`;

export const ALL_ADMIN_ORDERS = gql`
    query AllAdminOrders(
        $account: String
        $designer: String
        $keyword: String
        $product: String
        $status: [String!]
        $team: String
        $skip: Int
        $first: Int
        $page: String
    ) {
        allAdminOrders(
            account: $account
            designer: $designer
            keyword: $keyword
            product: $product
            status: $status
            team: $team
            skip: $skip
            first: $first
            page: $page
        ) {
            data {
                id
                priority
                prioritizedAt
                createdAt
                startedAt
                endAt
                submittedAt
                pausedAt
                resumedAt
                deliveredAt
                reopenedAt
                updatedAt
                status
                name
                rate
                unreadMessages
                description
                deliverables
                otherDeliverables
                discussion {
                    id
                    lastSeens
                    messages(orderBy: { createdAt: Desc }, first: 1) {
                        id
                        createdAt
                        user {
                            id
                        }
                    }
                }
                category {
                    id
                    title
                    slug
                }
                service {
                    id
                    name
                }
                company {
                    id
                    name
                    users {
                        id
                        firstname
                        lastname
                    }
                    subscription {
                        id
                        plan {
                            id
                            name
                            interval
                        }
                        statusFinal
                    }
                    teams {
                        id
                        name
                    }
                    notes {
                        id
                        text
                    }
                    isNotesCleared
                }
                workers {
                    id
                    firstname
                    lastname
                    archived
                    picture {
                        id
                        url
                    }
                }
                previews {
                    id
                    name
                    files {
                        id
                        name
                        size
                        url
                        contentType
                    }
                }
                brand {
                    id
                    name
                }
                customer {
                    id
                    firstname
                    lastname
                }
            }
            total
        }
    }
`;

export const ORDER_FEEDBACK = gql`
    query OrderFeedback($id: Int!) {
        Order(id: $id) {
            id
            feedback {
                id
                score
            }
        }
    }
`;

export const ORDER_UNREAD_MESSAGES = gql`
    query OrderFeedback($id: Int!) {
        Order(id: $id) {
            id
            unreadMessages
            discussion {
                id
                lastSeens
                messages(where: { isNote: false }, orderBy: { createdAt: Desc }, first: 1) {
                    id
                    createdAt
                    user {
                        id
                    }
                }
            }
        }
    }
`;

export const ORDER_MESSAGES = gql`
    query orderMessages($id: Int!, $last: Int, $skip: Int) {
        Order(id: $id) {
            id
            discussion {
                id
                _messagesCount(where: { isNote: false })
                messages(where: { isNote: false }, orderBy: { createdAt: Asc }, last: $last, skip: $skip) {
                    id
                    createdAt
                    updatedAt
                    user {
                        id
                        firstname
                        lastname
                        picture {
                            url
                            id
                        }
                    }
                    isNote
                    isAction
                    isPin
                    actionType
                    actionMeta
                    text
                    readBy {
                        userId
                    }
                    files {
                        id
                        name
                        size
                        url
                        isHidden
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                        folder {
                            id
                            isHidden
                        }
                    }
                    actionFile {
                        id
                        name
                        size
                        url
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const ADMIN_ORDER_MESSAGES = gql`
    query orderMessages($id: Int!, $last: Int, $skip: Int) {
        Order(id: $id) {
            id
            discussion {
                id
                _messagesCount
                pinnedMessages: messages(where: { isPin: true }) {
                    id
                    createdAt
                    updatedAt
                    user {
                        id
                        firstname
                        lastname
                        picture {
                            url
                            id
                        }
                    }
                    isNote
                    isAction
                    isPin
                    actionType
                    actionMeta
                    text
                    readBy {
                        userId
                    }
                    files {
                        id
                        name
                        size
                        url
                        isHidden
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                        folder {
                            id
                            isHidden
                        }
                    }
                    actionFile {
                        id
                        name
                        size
                        url
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                    }
                }
                messages(orderBy: { createdAt: Asc }, last: $last, skip: $skip) {
                    id
                    createdAt
                    updatedAt
                    user {
                        id
                        firstname
                        lastname
                        picture {
                            url
                            id
                        }
                    }
                    isNote
                    isAction
                    isPin
                    actionType
                    actionMeta
                    text
                    readBy {
                        userId
                    }
                    files {
                        id
                        name
                        size
                        url
                        isHidden
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                        folder {
                            id
                            isHidden
                        }
                    }
                    actionFile {
                        id
                        name
                        size
                        url
                        contentType
                        feedback {
                            id
                            comments {
                                id
                                readBy {
                                    userId
                                }
                            }
                            readBy {
                                userId
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const ORDER_ATTACHMENTS = gql`
    query orderAttachments($orderId: Int!) {
        Order(id: $orderId) {
            name
            id
            attachments {
                id
                createdAt
                updatedAt
                name
                size
                url
            }
        }
    }
`;

export const ORDER_RECENT_FILES = gql`
    query orderAttachments($id: Int!) {
        Order(id: $id) {
            id
            recentFiles {
                id
                createdAt
                name
                size
                url
            }
        }
    }
`;

export const ORDER_FILES = gql`
    query Order($id: Int!) {
        Order(id: $id) {
            ...OrderFiles
        }
    }
    ${Order.fragment.files}
`;

export default Order;
