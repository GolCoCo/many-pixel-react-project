import { inputCss } from '@components/Input';
import { displayUtils, sizeUtils } from '@components/Utils';
import styled from 'styled-components';
import * as theme from '../Theme';

// stripe elements css from custom-override are moved here

export const StripeElementsContainer = styled.div`
    .StripeElement {
        ${theme.TYPO_P4}
        display: block;
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d5d6dd;
        height: 40px;
        outline: 0;
        border-radius: 10px;
        background-color: #fff;

        & iframe iframe {
            min-height: 22px !important;
        }
    }

    .StripeElement--invalid {
        border: 1px solid #f5222d;
    }

    label[for='cardnumber'] span,
    label[for='expirydate'] span,
    label[for='cvv'] span {
        display: inline-block;
        margin-bottom: 10px;
    }
`;

export const StripeElementsFlex = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    label[for='cardnumber'] {
        width: 54%;
    }

    label[for='expirydate'],
    label[for='cvv'] {
        width: 20%;
    }

    > label span::after {
        display: inline-block;
        margin-left: 4px;
        color: #f5222d;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }

    @media screen and (max-width: 921px) {
        label[for='cardnumber'] {
            width: 100%;
            margin-bottom: 30px;
        }

        label[for='expirydate'],
        label[for='cvv'] {
            width: 48%;
        }
    }
`;

export const CardInformationError = styled.span`
    color: #f5222d;
    font-size: 12px;
    line-height: 18px;
    margin-bottom: -1px;
`;

export const StripeInput = styled.div`
    ${inputCss}
    ${displayUtils}
    ${sizeUtils}

    &.ant-input {
        padding-top: 0;
        padding-bottom: 0;
        display: flex;
        align-items: center;
        & > div {
            width: ${props => (props.$w ? `${props.$w}px` : '100%')};
            max-width: ${props => (props.$w ? `${props.$w}px` : '100%')};
        }
    }
`;

export const stripeStyleObject = {
    base: {
        fontSize: theme.TYPO_BADGE.fontSize,
        fontWeight: theme.TYPO_BADGE.fontWeight,
        fontStyle: theme.TYPO_BADGE.fontStyle,
        fontFamily: 'Geomanist, sans-serif',
        color: theme.COLOR_TEXT_PRIMARY,
        '::placeholder': {
            color: theme.COLOR_TEXT_TERTIARY,
        },
    },
    invalid: {
        iconColor: theme.COLOR_OTHERS_RED,
        color: theme.COLOR_OTHERS_RED,
    },
};

export const stripeStyleObjectCentered = {
    base: {
        fontSize: theme.TYPO_BADGE.fontSize,
        fontWeight: theme.TYPO_BADGE.fontWeight,
        fontStyle: theme.TYPO_BADGE.fontStyle,
        fontFamily: 'Geomanist, sans-serif',
        color: theme.COLOR_TEXT_PRIMARY,
        '::placeholder': {
            color: theme.COLOR_TEXT_TERTIARY,
        },
        textAlign: 'center',
    },
    invalid: {
        iconColor: theme.COLOR_OTHERS_RED,
        color: theme.COLOR_OTHERS_RED,
    },
};

export const stripeElementsConfig = {
    fonts: [
        {
            family: theme.TYPO_FAMILY_GEOMANIST,
            // Tips: upload to aws
            src: `url(https://assets.manypixels.co/c7c03d70-abf3-11ec-933d-814599af2db4-Geomanist.woff)`,
        },
    ],
};
