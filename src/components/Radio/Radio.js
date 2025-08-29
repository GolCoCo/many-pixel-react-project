import styled from 'styled-components';
import { Radio as AntdRadio } from 'antd';
import * as theme from '../Theme';

export const Radio = styled(AntdRadio)`
    .ant-radio-inner {
        top: 1px;
    }

    &.ant-radio-wrapper {
        span {
            ${theme.TYPO_P4}
        }
    }
`;

export const RadioGroup = styled(AntdRadio.Group)`
    width: 100%;
    ${props =>
        props.$maxH &&
        `
        max-height: ${props.$maxH}px;
    `}
    ${props =>
        props.$overflowY &&
        `
        overflow-y: ${props.$overflowY};
    `}
    ${props =>
        props.$overflowX &&
        `
        overflow-x: ${props.$overflowX};
    `}

    .ant-radio-wrapper {
        width: 100%;
        margin-bottom: 20px;
        &.filter {
            margin-bottom: 10px;
        }
        color: ${theme.COLOR_TEXT_PRIMARY};
        ${props =>
            props.labelFlex &&
            `
            flex: ${props.labelFlex}!important
        `};
        span {
            ${theme.TYPO_P4}
        }

        .ant-radio {
            vertical-align: middle;
        }

        &:last-child {
            margin-bottom: 0;
        }

        & > span:nth-child(2) {
            width: calc(100% - 12px);
            display: inline-block;
            white-space: pre-wrap;
            vertical-align: middle;
            ${props =>
                props.$whiteSpace &&
                `
                white-space: ${props.$whiteSpace};
                margin-bottom: 16px;
            `}
        }
    }
`;
