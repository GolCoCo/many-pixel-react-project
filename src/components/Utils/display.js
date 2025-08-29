import { css } from 'styled-components';
import { mediaQueryProps } from './media-query';

export const displayUtils = props => css`
    ${mediaQueryProps('position', props.$pos)}
    ${mediaQueryProps('display', props.$d)}
    ${mediaQueryProps('z-index', props.$zIndex)}
    ${mediaQueryProps('transform', props.$transform)}
    ${mediaQueryProps('overflow', props.$overflow)}
    ${mediaQueryProps('overflow-x', props.$overflowX)}
    ${mediaQueryProps('overflow-y', props.$overflowY)}
    ${mediaQueryProps('user-select', props.$userSelect)}
    ${mediaQueryProps('transition', props.$trans)}
    ${mediaQueryProps('opacity', props.$opacity)}
    ${mediaQueryProps('outline', props.$outline)}
    ${mediaQueryProps('appearance', props.$appearance)}
    ${mediaQueryProps('box-shadow', props.$boxShadow)}
    ${mediaQueryProps('cursor', props.$cursor)}
    ${mediaQueryProps('flex-direction', props.$flexDir)}
    ${mediaQueryProps('flex-wrap', props.$flexWrap)}
    ${mediaQueryProps('justify-content', props.$justifyContent)}
    ${mediaQueryProps('align-items', props.$alignItems)}
    ${mediaQueryProps('align-self', props.$alignSelf)}
    ${mediaQueryProps('order', props.$order)}
    ${mediaQueryProps('flex', props.$flex)}
    ${mediaQueryProps('list-style', props.$listStyle)}
    ${mediaQueryProps('border', props.$border)}
    ${mediaQueryProps('border-top', props.$borderTop)}
    ${mediaQueryProps('border-bottom', props.$borderBottom)}
    ${mediaQueryProps('border-left', props.$borderLeft)}
    ${mediaQueryProps('border-right', props.$borderRight)}
    ${mediaQueryProps('border-style', props.$borderStyle)}
    ${mediaQueryProps('border-top-style', props.$borderTopStyle)}
    ${mediaQueryProps('border-bottom-style', props.$borderBottomStyle)}
    ${mediaQueryProps('border-left-style', props.$borderLeftStyle)}
    ${mediaQueryProps('border-right-style', props.$borderRightStyle)}
    ${mediaQueryProps('background-image', props.$bgImage)}
    ${mediaQueryProps('background-position', props.$bgPos)}
    ${mediaQueryProps('background-size', props.$bgSize)}
    ${mediaQueryProps('background-repeat', props.$bgRepeat)}
    ${mediaQueryProps('object-fit', props.$objectFit)}
    ${mediaQueryProps('object-position', props.$objectPosition)}
    ${mediaQueryProps('vertical-align', props.$verticalAlign)}
    ${mediaQueryProps('resize', props.$resize)}
    ${mediaQueryProps('scrollbar-width', props.$scrollbarW)}
    ${mediaQueryProps('scrollbar-color', props.$scrollbarC)}
    ${mediaQueryProps('gap', props.$gap)}
`;
