import styled, { css } from 'styled-components';
import { Select as AntdSelect } from 'antd';
import * as theme from '../Theme';

export const selectCss = css`
    &.ant-select-single {
        .ant-select-selector {
            height: 40px;
            border-radius: 10px;
            padding: 0 16px;
            .ant-select-selection-item {
                ${theme.TYPO_P4};
                // margin-left: 5px;
                line-height: 35px;
                min-height: 38px;
                img {
                    margin-right: 8px !important;
                }
            }

            .ant-select-selection-search input {
                padding-left: 5px;
                height: 40px;
            }
        }

        .ant-select-selection-placeholder {
            ${theme.TYPO_P4};
            color: ${theme.COLOR_TEXT_TERTIARY}!important;
            height: 40px;
            line-height: 40px;
            top: 0;
            margin-top: 0;
        }
    }

    &.ant-select-multiple {
        .ant-select-selection-placeholder {
            font-weight: 400;
            color: ${theme.COLOR_TEXT_TERTIARY};
            padding-left: 3px;
        }
        .ant-select-selector {
            min-height: 40px;
            border-radius: 10px;
            height: auto;
            padding: 4px 6px;
            .ant-select-selection-item {
                ${theme.TYPO_P4};
                margin-left: 5px;
                color: ${theme.COLOR_CTA};
                .ant-select-item-option-selected {
                }
            }
        }
    }
    .ant-select-item {
        ${theme.TYPO_P4};
        height: 40px;

        padding: 0px 16px;
    }
`;

export const Select = styled(AntdSelect)`
    ${selectCss}
`;
