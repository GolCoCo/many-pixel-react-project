import { css } from 'styled-components';
import { mediaQueryProps } from './media-query';

/**
 * @param {string} str String input
 * @param {bool} ignoreCheck skip checking
 */
const ensureSize = (str, ignoreCheck = false) => {
    if (ignoreCheck) return str;
    if (typeof str === 'undefined') return '';
    if (['auto', 'unset', 'calc', 'vh', 'vw', 'px'].some(v => str.includes(v)) || str.includes('%') || ignoreCheck) return str;
    return `${str}px`;
};

const ensureArrayMap = (input, ignoreCheck = false, mapFn = null) => {
    if (Array.isArray(input)) {
        return input.map(item => {
            if (mapFn) {
                return mapFn(item);
            }
            return ensureSize(item, ignoreCheck);
        });
    }

    if (typeof input === 'object' && input !== null) {
        const values = Object.keys(input).reduce((prev, key) => {
            const item = input[key];
            if (mapFn) {
                return mapFn(item);
            }
            return { ...prev, [key]: ensureSize(item, ignoreCheck) };
        }, {});
        return values;
    }

    if (mapFn) {
        return mapFn(input);
    }
    return ensureSize(input, ignoreCheck);
};

/** From separator marge */
const gapCss = ({ space, $spaceRight, spaceLeft, $spaceCenterChildren, $flexShrink }) => css`
    & > *:first-child {
        margin-left: 0;
    }
    & > *:last-child {
        margin-right: 0;
    }
    & > * {
        ${space &&
        css`
            ${mediaQueryProps(
                'margin-left',
                ensureArrayMap(space, true, spaceItem => ensureSize(`calc(${spaceItem}px / 2)`, true))
            )}
            ${mediaQueryProps(
                'margin-right',
                ensureArrayMap(space, true, spaceItem => ensureSize(`calc(${spaceItem}px / 2)`, true))
            )}
        `}
        ${$spaceRight &&
        css`
            margin-top: 0;
            margin-left: 0;
            margin-bottom: 0;
            ${mediaQueryProps('margin-right', ensureArrayMap($spaceRight))}
        `}
    ${spaceLeft &&
        css`
            margin-top: 0;
            margin-right: 0;
            margin-bottom: 0;
            ${mediaQueryProps('margin-left', ensureArrayMap(spaceLeft))}
        `}
    display: inline-block;
    }
    ${$spaceCenterChildren &&
    css`
        display: flex;
        align-items: center;
        flex-shrink: ${$flexShrink};
    `}
`;

export const sizeUtils = props => css`
    ${mediaQueryProps('margin-left', ensureArrayMap(props.$ml ?? props.$mx ?? props.$m))}
    ${mediaQueryProps('margin-right', ensureArrayMap(props.$mr ?? props.$mx ?? props.$m))}
    ${mediaQueryProps('margin-top', ensureArrayMap(props.$mt ?? props.$my ?? props.$m))}
    ${mediaQueryProps('margin-bottom', ensureArrayMap(props.$mb ?? props.$my ?? props.$m))}
    ${mediaQueryProps('padding-left', ensureArrayMap(props.$pl ?? props.$px ?? props.$p))}
    ${mediaQueryProps('padding-right', ensureArrayMap(props.$pr ?? props.$px ?? props.$p))}
    ${mediaQueryProps('padding-top', ensureArrayMap(props.$pt ?? props.$py ?? props.$p))}
    ${mediaQueryProps('padding-bottom', ensureArrayMap(props.$pb ?? props.$py ?? props.$p))}
    ${mediaQueryProps('width', ensureArrayMap(props.$w))}
    ${mediaQueryProps('min-width', ensureArrayMap(props.$minW))}
    ${mediaQueryProps('max-width', ensureArrayMap(props.$maxW))}
    ${mediaQueryProps('height', ensureArrayMap(props.$h))}
    ${mediaQueryProps('min-height', ensureArrayMap(props.$minH))}
    ${mediaQueryProps('max-height', ensureArrayMap(props.$maxH))}
    ${mediaQueryProps('top', ensureArrayMap(props.$top))}
    ${mediaQueryProps('bottom', ensureArrayMap(props.$bottom))}
    ${mediaQueryProps('left', ensureArrayMap(props.$left))}
    ${mediaQueryProps('right', ensureArrayMap(props.$right))}
    ${mediaQueryProps('border-radius', ensureArrayMap(props.$radii))}
    ${mediaQueryProps('border-width', ensureArrayMap(props.$borderW))}
    ${mediaQueryProps('border-top-width', ensureArrayMap(props.$borderT))}
    ${mediaQueryProps('border-left-width', ensureArrayMap(props.$borderL))}
    ${mediaQueryProps('border-bottom-width', ensureArrayMap(props.$borderB))}
    ${mediaQueryProps('border-right-width', ensureArrayMap(props.$borderR))}
    ${mediaQueryProps('line-height', ensureArrayMap(props.$lineH))}
    ${mediaQueryProps('font-size', ensureArrayMap(props.$fontSize))}
    ${mediaQueryProps('font-weight', ensureArrayMap(props.$fontWeight, true))}

    ${props.$hasSpace && gapCss(props)}
`;
