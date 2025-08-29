export const ORDER_STATUS_DRAFT = 'DRAFT';
export const ORDER_STATUS_SUBMITTED = 'SUBMITTED';
export const ORDER_STATUS_ON_HOLD = 'ON_HOLD';
export const ORDER_STATUS_NOT_STARTED = 'NOT_STARTED';
export const ORDER_STATUS_ONGOING_PROJECT = 'ONGOING_PROJECT';
export const ORDER_STATUS_DELIVERED_PROJECT = 'DELIVERED_PROJECT';
export const ORDER_STATUS_ONGOING_REVISION = 'ONGOING_REVISION';
export const ORDER_STATUS_DELIVERED_REVISION = 'DELIVERED_REVISION';
export const ORDER_STATUS_COMPLETED = 'COMPLETED';
export const ORDER_STATUS_QUEUED = 'QUEUED';
export const ORDER_STATUS_AWAITING_FEEDBACK = 'AWAITING_FEEDBACK';

export const ORDER_STATUS_LABELS = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    ON_HOLD: 'Paused',
    NOT_STARTED: 'Paused',
    ONGOING_PROJECT: 'Ongoing',
    DELIVERED_PROJECT: 'Delivered',
    ONGOING_REVISION: 'Ongoing',
    DELIVERED_REVISION: 'Delivered',
    COMPLETED: 'Completed',
    AWAITING_FEEDBACK: 'Waiting Review',
    QUEUED: 'Queued',
};

export const ORDER_TAB_STATUSES = {
    QUEUE: [
        ORDER_STATUS_ONGOING_PROJECT,
        ORDER_STATUS_ONGOING_REVISION,
        ORDER_STATUS_SUBMITTED,
        ORDER_STATUS_ON_HOLD,
        ORDER_STATUS_AWAITING_FEEDBACK,
        ORDER_STATUS_QUEUED,
    ],
    DELIVERED: [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION, ORDER_STATUS_COMPLETED],
    DRAFT: [ORDER_STATUS_DRAFT],
};

export const ORDER_GROUP = {
    QUEUE: {
        All: ORDER_TAB_STATUSES.QUEUE,
        Ongoing: [ORDER_STATUS_ONGOING_PROJECT, ORDER_STATUS_ONGOING_REVISION],
        Submitted: [ORDER_STATUS_SUBMITTED],
        Paused: [ORDER_STATUS_ON_HOLD],
        'Waiting Review': [ORDER_STATUS_AWAITING_FEEDBACK],
        Queued: [ORDER_STATUS_QUEUED],
    },
    DELIVERED: {
        All: ORDER_TAB_STATUSES.DELIVERED,
        Delivered: [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION],
        Completed: [ORDER_STATUS_COMPLETED],
    },
};

export const getOrderGroupValues = name => {
    if (ORDER_GROUP[name]) {
        return Object.keys(ORDER_GROUP[name]).map(key => ({
            name: ORDER_GROUP[name][key],
            label: key,
        }));
    }
    return [];
};

export const getOrderGroupStatus = (name, status) => {
    if (ORDER_GROUP[name]) {
        return ORDER_GROUP[name][status];
    }

    if (name === 'DRAFT') {
        return [ORDER_STATUS_DRAFT];
    }

    return name;
};
