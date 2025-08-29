import { css } from 'styled-components';
import * as theme from '../Theme';

export const messageGlobalCss = css`
    .ant-message-notice-content {
        box-shadow: none;
        font-weight: 300;
        padding: 0;
        border-radius: 0;
    }

    .ant-message-custom-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 11px 25px;

        & .anticon {
            margin-right: 13px;
            font-size: 18px;
            top: 0;
        }

        span {
            ${theme.TYPO_P4}
            color: ${theme.COLOR_TEXT_PRIMARY};
        }
    }

    .ant-message-loading {
        background: #fff;
        border: 1px solid #cccccc;
    }

    .ant-message-success {
        background: #f2fdf8;
        border: 1px solid rgba(0, 152, 70, 0.4);
    }

    .ant-message-error {
        background: #ffd3d3;
        border: 1px solid rgba(255, 48, 65, 0.4);
    }
`;
