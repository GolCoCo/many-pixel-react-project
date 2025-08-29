import { createGlobalStyle } from 'styled-components';
import { tooltipGlobalCss } from '../Tooltip';
import { messageGlobalCss } from '../Message/style';
import { selectGlobalCss } from '../Select/style';
import { popConfirmGlobalCss } from '../Popconfirm';
import { popupGlobalCss } from '../Popup';

export const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    #root {
        min-height: 100vh;
        background-color: white;
    }

    ${tooltipGlobalCss}
    ${messageGlobalCss}
    ${selectGlobalCss}
    ${popConfirmGlobalCss}
    ${popupGlobalCss}
`;
