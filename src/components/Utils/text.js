import { css } from 'styled-components';
import * as typo from '../Theme/typography';
import { mediaQuerySection } from './media-query';

const fontFamilies = {
    Mulish: typo.TYPO_FAMILY_MULISH,
    Geomanist: typo.TYPO_FAMILY_GEOMANIST,
};

export const textVariants = {
    H1: typo.TYPO_H1,
    H2: typo.TYPO_H2,
    H3: typo.TYPO_H3,
    H4: typo.TYPO_H4,
    H5: typo.TYPO_H5,
    H6: typo.TYPO_H6,
    Button: typo.TYPO_BUTTON,
    PrimaryButton: typo.TYPO_PRIMARY_BUTTON,
    SmallTitle: typo.TYPO_SMALL_TITLE,
    P1: typo.TYPO_P1,
    P2: typo.TYPO_P2,
    P3: typo.TYPO_P3,
    P4: typo.TYPO_P4,
    P5: typo.TYPO_P5,
    Headline: typo.TYPO_HEADLINE,
    Badge: typo.TYPO_BADGE,
    SmallNotification: typo.TYPO_SMALL_NOTIFICATION,
};

const truncateCss = css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const mapTextVariant = props => {
    if (Array.isArray(props)) {
        return props.map(item => textVariants[item]);
    }
    if (props && typeof props === 'object') {
        return Object.keys(props)
            .map(key => ({ key, value: textVariants[props[key]] }))
            .reduce((prev, item) => ({ ...prev, [item.key]: item.value }), {});
    }
    if (typeof props === 'string' && textVariants[props]) {
        return textVariants[props];
    }
    return {};
};

export const textUtils = props => css`
    ${mediaQuerySection(mapTextVariant(props.$textVariant))}
    ${props.$isTruncate && truncateCss}
    font-family: ${fontFamilies[props.fontFamily]};
    font-weight: ${props.fontWeight};
    font-style: ${props.fontStyle};
    text-align: ${props.$textAlign};
    line-height: ${props.$lineHeight};
    text-transform: ${props.$textTransform};
    letter-spacing: ${props.$letterSpacing};
    word-wrap: ${props.$wordWrap};
    word-break: ${props.$wordBreak};
    text-overflow: ${props.$textOverflow};
    white-space: ${props.$whiteSpace};
    text-decoration: ${props.$textDecoration};
    text-overflow: ${props.$textOverflow};
`;
