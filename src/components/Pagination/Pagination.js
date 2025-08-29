import styled, { css } from 'styled-components';
import { Pagination as AntdPagination } from 'antd';
import { selectCss } from '../Select';
import * as theme from '../Theme';

const upDownArrow = new URL('@public/assets/icons/up-and-down-arrows.svg', import.meta.url).href;
// Exporting pagination css to used inside other components
// eg: table
export const paginationCss = css`
    font-family: ${theme.TYPO_FAMILY_GEOMANIST};
    font-size: 18px;
    line-height: 22px;
    font-weight: 300;
    display: flex;
    align-items: center;
    width: auto;
    margin: 20px 0;

    .ant-pagination-total-text {
        ${theme.TYPO_BADGE}
        align-self: center;
        margin-right: auto;
        display: block;
        height: auto;
    }

    .ant-pagination-item {
        font-family: ${theme.TYPO_FAMILY_GEOMANIST};
        font-weight: 300;
    }

    .ant-pagination-item-container {
        height: 40px;

        &:hover {
            border: 1px solid #009dff;
        }
    }

    .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis,
    .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
        top: 12%;
        font-size: 10px;
    }

    .ant-pagination-item-container,
    .ant-pagination-item-link,
    .ant-pagination-item {
        border-radius: 10px;
        &:not(:hover) {
            border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        }
    }

    .ant-pagination-jump-prev .ant-pagination-item-link,
    .ant-pagination-jump-next .ant-pagination-item-link {
        border: none;
    }

    .ant-pagination-options {
        margin-left: 8px;

        .ant-pagination-options-size-changer {
            margin-right: 0;
            width: 136px;

            .ant-select-selector {
                margin: 0 !important;
                padding: 7px 16px;
                line-height: 24px !important;
                position: relative;
                border-radius: ${props => (props.simplePagination ? '0!important' : '10px!important')};

                &::after {
                    content: '';
                    background: url(${upDownArrow}) no-repeat;
                    width: 19px;
                    height: 30px;
                    position: absolute;
                    right: 10px;
                    top: 15%;
                    visibility: visible;
                }

                .ant-select-selection-item {
                    font-family: ${theme.TYPO_FAMILY_GEOMANIST};
                    font-size: 18px !important;
                    color: #07122b;
                    font-weight: 300;
                    margin-left: 0 !important;
                }
            }

            .ant-select-arrow {
                display: none;
            }
        }
    }

    .ant-pagination-item-active:focus,
    .ant-pagination-item-active:hover,
    .ant-pagination-item-active {
        background: ${theme.COLOR_CTA};

        & a {
            color: white;
        }
    }

    .ant-select {
        ${selectCss}
        min-height: 40px;
    }
`;

export const Pagination = styled(AntdPagination)`
    ${paginationCss}
`;
