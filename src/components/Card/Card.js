import styled, { css } from 'styled-components';
import * as theme from '../Theme';
import { colorUtils, displayUtils, sizeUtils } from '../Utils';

const activeCss = css`
    background-color: ${theme.COLOR_BACKGROUND_LIGHT_BLUE};
    border-color: ${theme.COLOR_CTA};
`;

export const Card = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    background-color: ${theme.COLOR_WHITE};
    border-width: 1px;
    border-style: solid;
    border-radius: 10px;
    border-color: ${theme.COLOR_OUTLINE_GRAY};
    transition: border-color 0.2s, background-color 0.2s;
    ${displayUtils}
    ${sizeUtils}
    ${colorUtils}
    ${props => props.$isActive && activeCss}
  
    ${props =>
        props.$hoverable &&
        css`
            cursor: pointer;

            &:hover {
                ${activeCss}
            }
        `}

      
    ${props =>
        props.$isDisabled &&
        css`
            opacity: 0.7;
            background-color: ${theme.COLOR_BACKGROUND_DISABLED};
            cursor: not-allowed;

            &:hover {
                border-color: ${theme.COLOR_OUTLINE_GRAY};
                background-color: ${theme.COLOR_BACKGROUND_DISABLED};
            }
        `}

    ${props =>
        props.$centered &&
        css`
            flex-direction: column;
            justify-content: center;
        `}
`;
