import { Menu } from 'antd';
import styled, { css } from 'styled-components';
import * as color from '../Theme/color';
import { sizeUtils } from '../Utils';

export const DropdownMenu = styled(Menu)`
    border: 1px solid ${color.COLOR_OUTLINE_GRAY};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 9px 0;
    border-radius: 10px;
    margin-top: ${props => `${props.mt ?? '16'}px`};
    transform: translateX(0);
    width: ${props => `${props.$w ?? '253'}px`};

    .ant-dropdown-menu-item-divider,
    .ant-dropdown-menu-submenu-title-divider {
        background-color: ${color.COLOR_OUTLINE_GRAY};
        margin: 7px 16px;
    }
`;

export const DropdownMenuIcon = styled.span`
    font-size: 20px;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.2s;
`;

const variants = {
    default: {
        idleText: color.COLOR_TEXT_PRIMARY,
        idleBg: color.COLOR_WHITE,
        hoverText: color.COLOR_CTA,
        hoverBg: color.COLOR_BACKGROUND_LIGHT_BLUE,
    },
    danger: {
        idleText: color.COLOR_OTHERS_RED,
        idleBg: color.COLOR_WHITE,
        hoverText: color.COLOR_OTHERS_RED,
        hoverBg: color.COLOR_BACKGROUND_LIGHT_BLUE,
    },
};

const variantUtils = props => {
    const variant = variants[props.variant] ?? variants.default;
    return css`
        color: ${variant.idleText};
        background-color: ${variant.idleBg};

        a {
            color: ${variant.idleText};
            background-color: ${variant.idleBg};

            &:hover {
                color: ${variant.hoverText};
                background-color: ${variant.hoverBg};
            }
        }

        &:hover {
            color: ${variant.hoverText};
            background-color: ${variant.hoverBg};

            ${DropdownMenuIcon} {
                color: ${variant.hoverText};
                background-color: ${variant.hoverBg};
            }
        }
    `;
};

export const DropdownMenuItem = styled(Menu.Item)`
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 9px;
    padding-bottom: 9px;
    color: ${color.COLOR_TEXT_PRIMARY};
    align-items: center;

    .ant-dropdown-menu-title-content {
        display: flex;
    }
    ${sizeUtils}
    ${variantUtils}

    /* For link or navlink */
    a {
        display: flex;
        width: 100%;
        padding: 9px 16px;
        margin: 0;
    }
`;
