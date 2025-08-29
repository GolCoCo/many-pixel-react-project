import { css } from 'styled-components';
import * as theme from '../Theme';

export const tooltipGlobalCss = css`
    .ant-tooltip:not(.ant-default-tooltip-overlay) {
        max-width: 471px;

        .ant-tooltip-content {
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #d5d6dd;
            border-radius: 10px;
        }
        .ant-tooltip-inner {
            ${theme.TYPO_P4}
            background-color: white;
            color: ${theme.COLOR_TEXT_PRIMARY};
            padding: 9px 14px;
            border-radius: 10px;
        }
        .ant-tooltip-placement-top .ant-tooltip-arrow::before,
        .ant-tooltip-placement-topLeft .ant-tooltip-arrow::before,
        .ant-tooltip-placement-topRight .ant-tooltip-arrow::before {
            box-shadow: none;
        }
    }
`;
