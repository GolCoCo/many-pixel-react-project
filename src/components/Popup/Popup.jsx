import React, { forwardRef } from 'react';
import { Modal } from 'antd';
import styled, { css } from 'styled-components';
import * as theme from '../Theme';
import { mediaQueryProps, colorSchemes } from '../Utils';
import { buttonCss, buttonDefaultCss, buttonDangerCss, buttonPrimaryCss } from '../Button';

const deleteVariant = css`
    .ant-modal-content {
        .ant-modal-header {
            ${mediaQueryProps('padding', ['20px 16px 0', '20px 20px 0'])}
        }
    }

    .ant-modal-title {
        ${theme.TYPO_HEADLINE}
        padding-top: 10px;
        text-align: center;
        color: ${props => (props.titleColorScheme ? colorSchemes[props.titleColorScheme] ?? props.titleColorScheme : theme.COLOR_TEXT_ERROR)};
    }

    .ant-modal-body {
        ${theme.TYPO_P4}
        text-align: center;
        padding-top: 16px;
        color: ${theme.COLOR_TEXT_SECONDARY};
    }

    .ant-modal-footer {
        border-top: 0;
        padding: 10px 20px 20px 20px;

        .ant-btn {
            ${buttonCss}

            &.ant-btn-default {
                ${mediaQueryProps('height', ['34px', '34px'])}
                ${mediaQueryProps('font-size', ['12px', '12px'])}
            }

            &.ant-btn.ant-btn-danger {
                ${mediaQueryProps('height', ['34px', '34px'])}
                ${mediaQueryProps('font-size', ['12px', '12px'])}
            }
        }

        button + button {
            margin-left: 10px;
        }
    }
`;

const bottomVariant = css`
    @media (max-width: 767px) {
        &.ant-modal {
            margin: 0;
            padding: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
        }
    }
`;

export const popupGlobalCss = css`
    .ant-modal-wrap.variant-bottom {
        display: flex;
        flex-direction: column-reverse;
    }
`;

const variants = {
    delete: deleteVariant,
    bottom: bottomVariant,
    default: {},
};

export const Popup = styled(Modal)`
    .ant-modal-content {
        box-shadow: none;
        border-radius: 10px;

        .ant-modal-header {
            ${props => mediaQueryProps('padding', props.paddingHeader ?? ['20px 42px 0 16px', '24px 46px 0 24px'])}
            border-bottom: none;
            border-radius: 10px;
        }
        border-bottom: none;
    }

    .ant-modal-title {
        ${theme.TYPO_H5}
        color: ${props => (props.titleColorScheme ? colorSchemes[props.titleColorScheme] ?? props.titleColorScheme : theme.COLOR_TEXT_PRIMARY)};
    }

    .ant-modal-body {
        ${props => mediaQueryProps('padding', props.paddingBody ?? ['20px 16px', '24px 24px'])}

        form {
            > .ant-form-item {
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .ant-modal-footer {
        border-top: 0;
        padding: 0px 20px 20px 20px;

        .ant-btn {
            ${buttonCss}

            &.ant-btn-default {
                ${buttonDefaultCss}
            }

            &.ant-btn.ant-btn-primary {
                ${buttonPrimaryCss}
            }

            &.ant-btn.ant-btn-danger {
                ${buttonDangerCss}
            }
        }
    }

    .ant-modal-close {
        border: none;
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        top: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .ant-modal-close-x {
        height: 20px;
        width: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 20px;
    }

    .ant-modal-button-display-none {
        display: none;
    }

    ${props => variants[props.variant]}
`;

export const PopupDelete = forwardRef(({ children, ...restProps }, ref) => {
    return (
        <Popup
            ref={ref}
            $variant="delete"
            okButtonProps={{ type: 'danger' }}
            cancelButtonProps={{ type: 'default' }}
            centered
            okText="DELETE"
            cancelText="CANCEL"
            closable={false}
            maskClosable={false}
            width={436}
            {...restProps}
        >
            {children}
        </Popup>
    );
});
