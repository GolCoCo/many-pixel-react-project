import { blue2 } from './colors';
import { goTo } from './history';
import { DETAIL_REQUEST, FEEDBACK_REQUEST } from './routes';

export const questionEnums = {
    RADIO: { value: 'RADIO', label: 'Radio buttons' },
    DROPDOWN: { value: 'DROPDOWN', label: 'Dropdown' },
    SINGLE_TEXT: { value: 'SINGLE_TEXT', label: 'Single Answer' },
    MULTIPLE_TEXT: { value: 'MULTIPLE_TEXT', label: 'Multiple Answer' },
    FREE_TEXT: { value: 'Text', label: 'Text' },
};

export const companyRoles = {
    owner: 'Administrator',
    manager: 'Team Leader',
    worker: 'Designer',
};

export const orderStatusTags = {
    DRAFT: {
        label: 'Draft',
        color: '#07122B',
        bgColor: 'rgba(24, 31, 71, 0.07)',
        $borderColor: 'rgba(24, 31, 71, 0.1)',
        enum: 'DRAFT',
    },
    SUBMITTED: {
        label: 'Submitted',
        color: '#07122B',
        bgColor: 'rgba(24, 31, 71, 0.07)',
        $borderColor: 'rgba(24, 31, 71, 0.1)',
        enum: 'SUBMITTED',
    },
    ONGOING_PROJECT: {
        label: 'Ongoing',
        color: '#009DFF',
        bgColor: 'rgba(0, 157, 255, 0.07)',
        $borderColor: 'rgba(0, 157, 255, 0.1)',
        enum: 'ONGOING_PROJECT',
    },
    DELIVERED_PROJECT: {
        label: 'Delivered',
        color: '#009846',
        bgColor: 'rgba(0, 152, 70, 0.07)',
        $borderColor: 'rgba(0, 152, 70, 0.1)',
        enum: 'DELIVERED_PROJECT',
    },
    COMPLETED: {
        label: 'Completed',
        color: '#00803B',
        bgColor: 'rgba(6, 211, 101, 0.07)',
        $borderColor: 'rgba(0, 152, 70, 0.1)',
        enum: 'COMPLETED',
    },
    ON_HOLD: {
        label: 'Paused',
        enum: 'ON_HOLD',
        color: '#D1B000',
        bgColor: 'rgba(239, 186, 0, 0.07)',
        $borderColor: 'rgba(239, 186, 0, 0.1)',
    },
    // CANCELED: {
    //   label: 'Canceled',
    //   enum: 'CANCELED',
    //   color: '#D1B000',
    //   bgColor: 'rgba(239, 186, 0, 0.07)',
    //   $borderColor: 'rgba(239, 186, 0, 0.1)',
    // },
    // ACTIVE: {
    //   label: 'Active',
    //   enum: 'ACTIVE',
    //   color: '#00803B',
    //   bgColor: 'rgba(6, 211, 101, 0.07)',
    //   $borderColor: 'rgba(0, 152, 70, 0.1)',
    // },
    // INACTIVE: {
    //   label: 'Inactive',
    //   enum: 'INACTIVE',
    //   color: '#FF3041',
    //   bgColor: 'rgba(255, 48, 65, 0.07)',
    //   $borderColor: 'rgba(255, 48, 65, 0.1)',
    // },
};

export const orderStatuses = {
    DRAFT: {
        label: 'Draft',
        color: '#1D2344',
        bgColor: 'rgba(24, 31, 71, 0.07)',
        $borderColor: 'rgba(24, 31, 71, 0.1)',
        enum: 'DRAFT',
    },
    SUBMITTED: {
        label: 'Submitted',
        color: '#1D2344',
        bgColor: 'rgba(24, 31, 71, 0.07)',
        $borderColor: 'rgba(24, 31, 71, 0.1)',
        enum: 'SUBMITTED',
    },
    NOT_STARTED: {
        label: 'Not Started',
        labelCustomer: 'Ongoing',
        color: '#dcca33',
        colorCustomer: '#3AB7E2',
        enum: 'NOT_STARTED',
    },
    ONGOING_PROJECT: {
        label: 'Ongoing',
        labelCustomer: 'Ongoing',
        color: '#3AB7E2',
        bgColor: 'rgba(58, 183, 226, 0.07)',
        $borderColor: 'rgba(58, 183, 226, 0.1)',
        enum: 'ONGOING_PROJECT',
    },
    DELIVERED_PROJECT: {
        label: 'Delivered',
        color: '#009846',
        bgColor: 'transparent',
        $borderColor: 'rgba(0, 152, 70, 0.1)',
        enum: 'DELIVERED_PROJECT',
    },
    ONGOING_REVISION: {
        label: 'Ongoing - Revision',
        labelCustomer: 'Revision',
        color: '#3bcef9',
        colorCustomer: '#AC67D5',
        enum: 'ONGOING_REVISION',
    },
    DELIVERED_REVISION: {
        label: 'Delivered - Revision',
        labelCustomer: 'Revision',
        color: '#AC67D5',
        colorCustomer: '#AC67D5',
        enum: 'DELIVERED_REVISION',
    },
    COMPLETED: {
        label: 'Completed',
        color: '#009846',
        bgColor: 'rgba(6, 211, 101, 0.07)',
        $borderColor: 'rgba(0, 152, 70, 0.1)',
        enum: 'COMPLETED',
    },
    ON_HOLD: {
        label: 'Paused',
        enum: 'ON_HOLD',
        color: '#D1B000',
        bgColor: 'rgba(255, 183, 0, 0.07)',
        $borderColor: 'rgba(209, 176, 0, 0.1)',
    },
};

export const plans = {
    free: {
        name: 'free',
        price: 0,
        label: 'Free',
        fees: 1.5,
    },
    startup: {
        name: 'startup',
        price: 159,
        label: 'Start-Up',
        fees: 1,
    },
    pro: {
        name: 'pro',
        price: 279,
        label: 'Pro',
        fees: 0,
    },
};

export const roleColor = {
    owner: '#9340b1',
    manager: '#202cc3',
    worker: blue2,
    customer: '#31c375',
};

const goToDetailRequest = id => DETAIL_REQUEST.replace(':id', id);
const goToDetailFileFeedbackRequest = (id, fileId) => `${FEEDBACK_REQUEST.replace(':id', id)}?file=${fileId}`;

export const notificationsType = {
    FEEDBACK: {
        // icon: feedbackIcon,
        label: 'New Feedback',
        action: (id, fileId, openNewTab = false) => (openNewTab ? window.open(goToDetailRequest(id), '_blank') : goTo(goToDetailRequest(id))),
    },
    ORDER_STATUS: {
        label: 'Order Update',
        // icon: statusIcon,
        action: (id, fileId, openNewTab = false) => (openNewTab ? window.open(goToDetailRequest(id), '_blank') : goTo(goToDetailRequest(id))),
    },
    MESSAGE: {
        label: 'New Message',
        // icon: newMessageIcon,
        action: (id, fileId, openNewTab = false) =>
            openNewTab
                ? window.open(fileId ? goToDetailFileFeedbackRequest(id, fileId) : goToDetailRequest(id), '_blank')
                : goTo(fileId ? goToDetailFileFeedbackRequest(id, fileId) : goToDetailRequest(id)),
    },
    ASSIGNED_ORDER: {
        label: 'Order Update',
        // icon: statusIcon,
        action: (id, fileId, openNewTab = false) => (openNewTab ? window.open(goToDetailRequest(id), '_blank') : goTo(goToDetailRequest(id))),
    },
};

export const ongoingStatuses = ['NOT_STARTED', 'ONGOING_PROJECT', 'DELIVERED_PROJECT', 'ONGOING_REVISION', 'DELIVERED_REVISION'];

export const onHoldStatuses = ['SUBMITTED', 'ON_HOLD'];
export const revisionsStatuses = ['ONGOING_REVISION', 'DELIVERED_REVISION'];

export const referralStatus = {
    INVITED: {
        text: 'Sent',
        color: '24, 31, 71',
    },
    SIGN_UP: {
        text: 'Accepted',
        color: '0, 152, 70',
    },
    REFERRED: {
        text: 'Referred',
        color: '9, 37, 101',
    },
};

export const referralActivity = {
    LINK: 'Link Referral',
    EMAIL: 'Email Referral',
};

export const planTypes = {
    ORDER_BASED: { label: 'Order Based' },
    DESIGNER_BASED: { label: 'Designed Based' },
    SPECIAL: { label: 'Special ' },
    PAUSE: { label: 'Pause' },
};

export const networkStatuses = {
    INITIAL_LOADING: 1,
    NEW_VARIABLES: 2,
    FETCH_MORE: 3,
    REFETCH: 4,
    POLLING: 6,
    READY: 7,
    ERROR: 8,
};

export const billingIntervals = {
    MONTHLY: {
        label: 'month',
        shortLabel: 'mo',
        priceMonthlyDivider: 1,
    },
    QUARTERLY: {
        label: 'quarter',
        shortLabel: 'qr',
        priceMonthlyDivider: 3,
    },
    BIANNUALLY: {
        label: 'biannual',
        shortLabel: 'bian',
        priceMonthlyDivider: 6,
    },
    YEARLY: {
        label: 'year',
        shortLabel: 'yr',
        priceMonthlyDivider: 12,
    },
};

export const subscriptionStatusList = {
    willPause: { name: 'Will Pause', badgeType: 'warning', color: '#D1B000' },
    paused: { name: 'Paused', badgeType: 'warning', color: '#D1B000' },
    canceled: { name: 'Canceled', badgeType: 'warning', color: '#D1B000' },
    inactive: { name: 'Inactive', badgeType: 'danger', color: '#FF3041' },
    active: { name: 'Active', badgeType: 'success', color: '#00803B' },
    noSub: { name: 'No Sub', badgeType: 'danger', color: '#FF3041' },
};

export const teamStatusList = {
    ACTIVE: {
        name: 'Active',
        tagColor: 'green',
        badgeType: 'success',
    },
    INACTIVE: {
        name: 'Inactive',
        tagColor: 'Red',
        badgeType: 'danger',
    },
};
