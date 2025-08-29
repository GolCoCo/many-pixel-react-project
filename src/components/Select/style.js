import { css } from 'styled-components';
import * as theme from '../Theme';

export const selectGlobalCss = css`
    .ant-select-dropdown {
        padding: 8px 0px;
        border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        border-radius: 10px;
    }
.ant-select-item-option-content{
margin:auto;
}
    .ant-select-dropdown-menu-item {
        ${theme.TYPO_P4}
        height: 50px;
        line-height: 50px;
        padding: 0 15px;
        color: ${theme.COLOR_TEXT_PRIMARY};
        display: flex;
        align-items: center;
    }

    .ant-select-dropdown-menu {
        max-height: 320px;
    }

    .ant-select-dropdown--empty .ant-select-dropdown-menu-item {
        height: 75px;
    }
`;
