import { css } from 'styled-components';
import * as theme from '../Theme';

export const popConfirmGlobalCss = css`
    .ant-popover-arrow {
        box-shadow: none !important;
        /* border: 1px solid ${theme.COLOR_OUTLINE_GRAY} !important; */
        width: 24px;
        height: 19px;
        bottom: 2px !important;
        background: transparent;
        mix-blend-mode: color-dodge;
    }

    .ant-popover-title {
        padding: 16px;
        font-weight: 600;

        & span.anticon:hover {
            color: #0099F6;
        }
    }

    .ant-popover-inner {
        border-radius: 10px;
        border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        box-shadow: none;

        .ant-popover-inner-content {
            padding: 0;
            .ant-popover-message {
                padding: 0;
                margin-bottom: 20px;

                > .anticon {
                    font-size: 21px;
                    top: 0;
                }

                .ant-popover-message-title {
                    ${theme.TYPO_P4}
                    color: ${theme.COLOR_TEXT_PRIMARY};
                    padding-left: 32.5px;
                }
            }

            .ant-popover-buttons {
                margin-bottom: 0;

                button {
                    width: 59px;
                    height: 34px;
                    padding: 0;
                    border-radius: 0;
                    margin-left: 14px;
                    ${theme.TYPO_SMALL_TITLE}
                    text-transform: uppercase;
                }
            }
        }
    }

    .custom-popover {
        padding-top: 0px !important;
        width: 400px;
        max-height: 553px;

        .ant-popover-inner {
            overflow: hidden;
        }

        .ant-popover-title {
            font-weight: 500;
            padding: 0 16px;
            display: flex;
            height: 53px;
        }

        .ant-popover-inner-content > div {
            padding-left: 16px !important;
            padding-right: 6px !important;
        }
    }

    .boxScroll {
        scrollbar-width: 8px !important;
        scrollbar-color: #d5d6dd transparent; /* for Firefox */
    }

    .boxScroll > div:last-child {
       margin-bottom: 0;
    }

    /* for Webkit browsers (Chrome, Edge, Safari) */
    .boxScroll::-webkit-scrollbar {
        width: 8px !important;
    }

    .boxScroll::-webkit-scrollbar-track {
        background: transparent;
    }

    .boxScroll::-webkit-scrollbar-thumb {
        background-color: #d5d6dd;
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: content-box;
    }

    .boxScroll::-webkit-scrollbar-button {
        background-color: none;
        height: 0;
        width: 0;
    }

    .boxScroll::-webkit-scrollbar-thumb:hover {
        background-color: #a0a0a0;
    }
`;
