import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { displayUtils, pseudoUtils, sizeUtils } from '@components/Utils';
import { Input as AntdInput } from 'antd';
import * as theme from '../Theme';

const baseInputCss = css`
    ${theme.TYPO_P4}
    position: relative;
    border-radius: 10px;
    height: 40px;
    padding: 12px 16px;

    &::placeholder {
        color: ${theme.COLOR_TEXT_TERTIARY};
    }

    &:not(.ant-input-disabled):hover,
    &:not(.ant-input-disabled):focus {
        border-color: ${theme.COLOR_CTA};
    }
`;

export const inputCss = css`
    &.ant-input,
    &.ant-input-prefix-wrapper,
    &.ant-input-affix-wrapper .ant-input {
        ${baseInputCss}
    }
    &.ant-input-affix-wrapper {
        border-width: 1px;
        border-style: solid;
        border-color: ${theme.COLOR_OUTLINE_GRAY};
        padding: 0 11px;
        padding-left: 0;
        border-radius: ${props => (props.isCoupon ? '10px 0 0 10px' : '10px')};
        .ant-input-prefix {
            position: absolute;
            left: 12px;
            top: 50%;
            z-index: 2;
            display: flex;
            align-items: center;
            color: #07122b;
            line-height: 0;
            transform: translateY(-50%);
        }
        .ant-input:not(:first-child) {
            padding-left: ${props => `${props.prefixPaddingLeft ? props.prefixPaddingLeft : '40'}px`};
        }
        .ant-input:not(:last-child) {
            padding-right: 40px;
        }
    }
`;

const ExcludeInputDOM = forwardRef(({ w, ...props }, ref) => <AntdInput {...props} ref={ref} />);

export const Input = styled(ExcludeInputDOM)`
    ${inputCss}
    ${displayUtils}
    ${sizeUtils}
`;

export const InputPassword = styled(AntdInput.Password)`
    ${inputCss}
`;

const ExcludeTextAreaDOM = forwardRef(({ borderW, ...props }, ref) => <AntdInput.TextArea {...props} ref={ref} />);

export const TextArea = styled(ExcludeTextAreaDOM)`
    &.ant-input {
        ${baseInputCss}
        height: auto;
        padding: 12px 14px;
        ${displayUtils}
        ${sizeUtils}
        ${pseudoUtils}
    }
`;
