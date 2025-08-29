import { css } from 'styled-components';

export const mediaSizes = {
    desktop: 'screen and (min-width: 769px)',
    mobile: 'screen and (max-width: 768px)',
    xxl: 'screen and (min-width: 1600px)',
    xl: 'screen and (min-width: 1201px) and (max-width: 1599px)',
    lg: 'screen and (min-width: 993px) and (max-width: 1200px)',
    md: 'screen and (min-width: 769px) and (max-width: 992px)',
    sm: 'screen and (min-width: 577px) and (max-width: 768px)',
    xs: 'screen and (max-width: 576px)',
};

export const mediaQueryVariantCss =
    variant =>
    (...arg) =>
        css`
            @media ${mediaSizes[variant]} {
                ${css(...arg)}
            }
        `;

export const mediaQuerySection = value => {
    if (Array.isArray(value)) {
        return css`
            ${value[1] &&
            mediaQueryVariantCss('desktop')`
                  ${value[1]}
                `}
            ${value[0] &&
            mediaQueryVariantCss('mobile')`
                  ${value[0]}
                `}
        `;
    }

    if (value?.xs || value?.sm || value?.md || value?.lg || value?.xl || value?.xxl) {
        return css`
            ${value.xs && mediaQueryVariantCss('xs')`${value.xs}`}
            ${value.sm && mediaQueryVariantCss('sm')`${value.sm}`}
          ${value.md && mediaQueryVariantCss('md')`${value.md}`}
          ${value.lg && mediaQueryVariantCss('lg')`${value.lg}`}
          ${value.xl && mediaQueryVariantCss('xl')`${value.xl}`}
          ${value.xxl && mediaQueryVariantCss('xxl')`${value.xxl}`}
        `;
    }

    if (value) {
        return css`
            ${value}
        `;
    }
    return {};
};

export const mediaQueryProps = (propName, value) => {
    if (Array.isArray(value)) {
        return css`
            ${value[1] &&
            mediaQueryVariantCss('desktop')({
                [propName]: value[1],
            })}
            ${value[0] &&
            mediaQueryVariantCss('mobile')({
                [propName]: value[0],
            })}
        `;
    }

    if (typeof value === 'object' && value !== null) {
        // Try to find a way to include css as array
        return css`
            ${value.xs &&
            mediaQueryVariantCss('xs')({
                [propName]: value.xs,
            })}
            ${value.sm &&
            mediaQueryVariantCss('sm')({
                [propName]: value.sm,
            })}
            ${value.md &&
            mediaQueryVariantCss('md')({
                [propName]: value.md,
            })}
            ${value.lg &&
            mediaQueryVariantCss('lg')({
                [propName]: value.lg,
            })}
            ${value.xl &&
            mediaQueryVariantCss('xl')({
                [propName]: value.xl,
            })}
            ${value.xxl &&
            mediaQueryVariantCss('xxl')({
                [propName]: value.xxl,
            })}
        `;
    }
    return css({
        [propName]: value,
    });
};

export const mediaQueryUtils = props => css`
    ${props.hide === 'mobile' &&
    mediaQueryVariantCss('mobile')`
        display: none !important;
    `}
    ${props.hide === 'desktop' &&
    mediaQueryVariantCss('desktop')`
        display: none !important;
    `}
`;
