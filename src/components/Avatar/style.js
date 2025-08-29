import styled, { css } from 'styled-components';

export const Relative = styled.div`
    position: relative;
    display: inline-block;
    ${props =>
        props.$w &&
        css`
            width: ${props.$w}px;
        `}
    ${props =>
        props.$h &&
        css`
            height: ${props.$h}px;
        `}
`;

export const ActiveDot = styled.div`
    border-radius: 50%;
    width: 5.33px;
    height: 5.33px;
    background-color: #00da7e;
    position: absolute;
    right: 7.5%;
    bottom: 7.5%;
    border: 1px solid #ffffff;
    z-index: 2;
`;
