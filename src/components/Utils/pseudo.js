import { css } from 'styled-components';
import { colorUtils } from './color';
import { sizeUtils } from './size';
import { displayUtils } from './display';

const combinedUtils = args => css`
    content: ${args.content};
    ${displayUtils(args)}
    ${colorUtils(args)}
    ${sizeUtils(args)}
`;

const mapPseudo = (props, cssKey, propsKey) => {
    if (props[propsKey]) {
        return css`
            ${cssKey} {
                ${combinedUtils(props[propsKey])}
            }
        `;
    }
    return {};
};

export const pseudoUtils = props => css`
    ${mapPseudo(props, '&:hover', '_hover')}
    ${mapPseudo(props, '&:disabled,&[aria-disabled],&[disabled]', '_disabled')}
    ${mapPseudo(props, '&:active:not(:disabled),&[data-active]:not(:disabled)', '_active')}
    ${mapPseudo(props, '&:focus', '_focus')}
    ${mapPseudo(props, '&:first-of-type', '_first')}
    ${mapPseudo(props, '&:last-of-type', '_last')}
    ${mapPseudo(props, '&::after', '_after')}
`;
