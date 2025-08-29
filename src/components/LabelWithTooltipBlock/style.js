import styled, { css } from 'styled-components';
import { colorUtils, textUtils } from '../Utils';

export const LabelText = styled.span`
    vertical-align: middle;
    display: inline;
    ${textUtils}
    ${colorUtils}

    ${({ required }) =>
        required &&
        css`
            &:after {
                position: absolute;
                margin-right: 4px;
                color: #ff3041;
                font-size: 14px;
                font-family: SimSun, sans-serif;
                line-height: 1;
                content: '*';
            }
        `}
`;
