import { css } from 'styled-components';
import * as color from '../Theme/color';

export const colorSchemes = {
    cta: color.COLOR_CTA,
    icon: color.COLOR_HOVER_ICON,
    primary: color.COLOR_TEXT_PRIMARY,
    secondary: color.COLOR_TEXT_SECONDARY,
    tertiary: color.COLOR_TEXT_TERTIARY,
    gray: color.COLOR_TEXT_GRAY,
    white: color.COLOR_WHITE,
    black: color.COLOR_BLACK,
    headline: color.COLOR_HEADLINE,
    'text-error': color.COLOR_TEXT_ERROR,
    'element-black': color.COLOR_UI_ELEMENT_BLACK,
    'element-gray': color.COLOR_UI_ELEMENT_GRAY,
    'element-skeleton': color.COLOR_UI_ELEMENT_SKELETON,
    'element-stroke': color.COLOR_ELEMENT_STROKE,
    'outline-gray': color.COLOR_OUTLINE_GRAY,
    'bg-gray': color.COLOR_BACKGROUND_GRAY,
    'bg-light-blue': color.COLOR_BACKGROUND_LIGHT_BLUE,
    'bg-disabled': color.COLOR_BACKGROUND_DISABLED,
    'other-pink': color.COLOR_OTHERS_PINK,
    'other-blue': color.COLOR_OTHERS_BLUE,
    'other-yellow': color.COLOR_OTHERS_YELLOW,
    'other-purple': color.COLOR_OTHERS_PURPLE,
    'other-green': color.COLOR_OTHERS_GREEN,
    'other-dark-yellow': color.COLOR_OTHERS_DARK_YELLOW,
    'other-red': color.COLOR_OTHERS_RED,
    'other-gray': color.COLOR_OTHERS_GRAY,
    'badge-blue': color.COLOR_BADGE_BLUE,
    'badge-gray': color.COLOR_BADGE_GRAY,
    'badge-yellow': color.COLOR_BADGE_YELLOW,
    'badge-red': color.COLOR_BADGE_RED,
    'badge-green': color.COLOR_BADGE_GREEN,
};

export const colorUtils = props => css`
    background: ${colorSchemes[props.$bg] ?? props.$bg};
    color: ${colorSchemes[props.$colorScheme] ?? props.$colorScheme};
    border-color: ${colorSchemes[props.$borderColor] ?? props.$borderColor};
    border-top-color: ${colorSchemes[props.$borderTopColor] ?? props.$borderTopColor};
    border-bottom-color: ${colorSchemes[props.$borderBottomColor] ?? props.$borderBottomColor};
    border-left-color: ${colorSchemes[props.$borderLeftColor] ?? props.$borderLeftColor};
    border-right-color: ${colorSchemes[props.$borderRightColor] ?? props.$borderRightColor};
    opacity: ${props.$opacity};
`;
