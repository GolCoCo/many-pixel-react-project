import styled, { css } from 'styled-components';
import * as theme from '../Theme';
import { sizeUtils } from '../Utils';

const variants = {
    Primary: {
        background: theme.COLOR_BACKGROUND_LIGHT_BLUE,
        color: theme.COLOR_CTA,
    },
    Paused: {
        background: theme.COLOR_BADGE_GRAY,
        color: theme.COLOR_TEXT_PRIMARY,
        border: `1px solid rgba(7, 18, 43, 0.30)`,
    },
    Queued: {
        background: theme.COLOR_BADGE_BLUE,
        color: theme.COLOR_CTA,
        border: `1px solid rgba(0, 153, 246, 1)`,
    },
    Completed: {
        background: theme.COLOR_BADGE_GREEN,
        color: theme.COLOR_OTHERS_GREEN,
        border: `1px solid rgba(58, 178, 16, 0.3)`,
    },
    Draft: {
        background: '#b6b6b6', // Wonder why its different for draft
        color: theme.COLOR_WHITE,
    },
    Delivered: {
        background: theme.COLOR_WHITE,
        color: theme.COLOR_OTHERS_GREEN,
        border: `1px solid ${theme.COLOR_OTHERS_GREEN}`,
    },
    Submitted: {
        background: theme.COLOR_BADGE_BLUE,
        color: theme.COLOR_CTA,
        border: `1px solid rgba(0, 153, 246, 1)`,
    },
    Inactive: {
        background: theme.COLOR_BADGE_RED,
        color: theme.COLOR_OTHERS_RED,
    },
    Active: {
        background: theme.COLOR_BADGE_GREEN,
        color: "#245B11",
        width: "43px",
        height: "28px",
        borderRadius: "4px",
        border: "1px solid #3AB2104D"
    },
    Cancelled: {
        background: theme.COLOR_BADGE_YELLOW,
        color: theme.COLOR_OTHERS_DARK_YELLOW,
    },
    SubscriptionActive: {
        background: theme.COLOR_OTHERS_GREEN,
        color: theme.COLOR_WHITE,
    },
    SubscriptionPaused: {
        background: theme.COLOR_OTHERS_YELLOW,
        color: theme.COLOR_TEXT_PRIMARY,
    },
    SubscriptionInactive: {
        background: theme.COLOR_OTHERS_RED,
        color: theme.COLOR_WHITE,
    },
    DropdownOngoing: {
        background: theme.COLOR_BADGE_BLUE,
        color: theme.COLOR_OTHERS_BLUE,
    },
    Accepted: {
        background: theme.COLOR_BADGE_GREEN,
        color: theme.COLOR_OTHERS_GREEN,
        border: '1px solid rgba(58, 178, 16, 0.3)',
    },
    Sent: {
        background: theme.COLOR_BADGE_GRAY,
        color: theme.COLOR_TEXT_PRIMARY,
        border: '1px solid rgba(7, 18, 43, 0.3)',
    },
    BillingPaused: {
        background: theme.COLOR_OTHERS_YELLOW,
        color: theme.COLOR_TEXT_PRIMARY,
    },
    BillingActive: {
        background: theme.COLOR_OTHERS_GREEN,
        color: 'white',
    },
    UserActive: {
        background: theme.COLOR_BADGE_GREEN,
        color: theme.COLOR_OTHERS_GREEN,
        border: '1px solid rgba(58, 178, 16, 0.3)',
    },
    UserInactive: {
        background: theme.COLOR_BADGE_RED,
        color: theme.COLOR_OTHERS_RED,
        border: '1px solid rgba(252, 48, 48, 0.3)',
    },
    UserPaused: {
        background: theme.COLOR_BADGE_YELLOW,
        color: theme.COLOR_OTHERS_YELLOW,
        border: '1px solid rgba(200, 152, 2, 0.3)',
    },
    Ongoing: {
        background: theme.COLOR_BADGE_PURPLE,
        color: theme.COLOR_OTHERS_PURPLE,
        border: '1px solid rgba(134, 77, 255, 1)',
    },
    'Waiting Review': {
        background: theme.COLOR_BADGE_YELLOW,
        color: theme.COLOR_OTHERS_DARK_YELLOW,
        border: '1px solid rgba(200, 152, 2, 1)',
    },
};

const ellipseCss = css`
    border-radius: 999px;
    min-width: 18px;
    padding: 0px;
    min-height: 18px;
`;

export const badgeCss = css`
    ${theme.TYPO_BADGE}
    padding: 8px 12px;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    margin-bottom: 0;
    text-transform: unset;
`;

const notificationCss = css`
    ${theme.TYPO_SMALL_TITLE}
    background-color: ${theme.COLOR_OTHERS_PINK};
    padding-top: 2px;
    padding-left: 9px;
    padding-right: 9px;
    padding-bottom: 2px;
    color: white;
`;

export const Badge = styled.span`
    ${badgeCss}
    ${props => variants[props.$variant]}
    ${props => props.$isEllipse && ellipseCss}
    ${props => props.$isNotification && notificationCss}
    ${sizeUtils}
`;
