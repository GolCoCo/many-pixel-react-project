import React from 'react';
import { Button as AntdButton } from 'antd';
import styled, { css } from 'styled-components';
import * as theme from '../Theme';
import { sizeUtils, textUtils, colorUtils, mediaQueryProps } from '../Utils';
import { badgeCss } from '../Badge';

export const buttonPrimaryCss = css`
    background-color: ${theme.COLOR_CTA};
    border-color: ${theme.COLOR_CTA};
    color: ${theme.COLOR_WHITE};

    ${props =>
        props.noColorTransitions
            ? css`
                  &:hover {
                      background-color: ${theme.COLOR_CTA};
                      border-color: ${theme.COLOR_CTA};
                      color: ${theme.COLOR_WHITE};
                  }
                  &:focus {
                      background-color: ${theme.COLOR_CTA};
                      border-color: ${theme.COLOR_CTA};
                      color: ${theme.COLOR_WHITE};
                  }
              `
            : css`
                  &:hover {
                      background-color: #027bc5; // should be linear-gradient, but it not possible to transition with linear-gradient
                      border-color: #027bc5;
                      color: ${theme.COLOR_WHITE};
                  }
                  &:focus {
                      background-color: #005c94;
                      border-color: #005c94;
                      color: ${theme.COLOR_WHITE};
                  }
              `}

    &[disabled],
    &:disabled {
        background-color: ${theme.COLOR_TEXT_TERTIARY};
        border-color: ${theme.COLOR_TEXT_TERTIARY};
        color: ${theme.COLOR_WHITE};

        &:hover {
            background-color: ${theme.COLOR_TEXT_TERTIARY};
            border-color: ${theme.COLOR_TEXT_TERTIARY};
            text-shadow: none;
            box-shadow: none;
        }
    }
`;

export const buttonDefaultCss = css`
    background-color: ${theme.COLOR_WHITE};
    color: ${theme.COLOR_TEXT_PRIMARY};
    border-color: ${theme.COLOR_OUTLINE_GRAY};

    &:hover {
        background-color: ${props => (props.hasDropDown ? theme.COLOR_CTA : theme.COLOR_WHITE)};
        color: ${props => (props.hasDropDown ? theme.COLOR_WHITE : theme.COLOR_CTA)};
        border-color: ${theme.COLOR_CTA};
    }
    &:focus {
        background-color: ${props => (props.hasDropDown ? theme.COLOR_CTA : theme.COLOR_BACKGROUND_LIGHT_BLUE)};
        color: ${props => (props.hasDropDown ? theme.COLOR_WHITE : theme.COLOR_CTA)};
        border-color: ${theme.COLOR_CTA};
    }

    &[disabled],
    &:disabled {
        color: #c7cbd4;
        background-color: white;
        border-color: #c7cbd4;
        text-shadow: none;
        box-shadow: none;

        &:hover {
            color: #c7cbd4;
            background-color: white;
            border-color: #c7cbd4;
            text-shadow: none;
            box-shadow: none;
        }
    }
`;

export const buttonDangerCss = css`
    background-color: ${props => (props.outlined ? 'white' : theme.COLOR_OTHERS_RED)};
    color: ${props => (props.outlined ? theme.COLOR_OTHERS_RED : 'white')};
    border-color: ${theme.COLOR_OTHERS_RED};

    /* There is no danger button style in design system. So, improvise first, ask later */
    &:hover {
        background-color: #d90018;
        border-color: #d90018;
        color: white;
    }
    &:focus {
        background-color: #b70000;
        border-color: #b70000;
        color: white;
    }
`;

export const buttonGhostCss = css`
    background-color: transparent;
    border-color: transparent;
`;
export const buttonBorderedCss = css`
    background-color: ${theme.COLOR_TEXT_PRIMARY};
    border-color: ${theme.COLOR_WHITE};
    color: ${theme.COLOR_WHITE};

    ${props =>
        props.noColorTransitions
            ? css`
                  &:hover {
                      background-color: ${theme.COLOR_CTA};
                      border-color: ${theme.COLOR_CTA};
                      color: ${theme.COLOR_WHITE};
                  }
                  &:focus {
                      background-color: ${theme.COLOR_CTA};
                      border-color: ${theme.COLOR_CTA};
                      color: ${theme.COLOR_WHITE};
                  }
              `
            : css`
                  &:hover {
                      background-color: #027bc5; // should be linear-gradient, but it not possible to transition with linear-gradient
                      border-color: #027bc5;
                      color: ${theme.COLOR_WHITE};
                  }
                  &:focus {
                      background-color: #005c94;
                      border-color: #005c94;
                      color: ${theme.COLOR_WHITE};
                  }
              `}

    &[disabled],
    &:disabled {
        background-color: ${theme.COLOR_TEXT_TERTIARY};
        border-color: ${theme.COLOR_TEXT_TERTIARY};
        color: ${theme.COLOR_WHITE};

        &:hover {
            background-color: ${theme.COLOR_TEXT_TERTIARY};
            border-color: ${theme.COLOR_TEXT_TERTIARY};
            text-shadow: none;
            box-shadow: none;
        }
    }
`;
const ButtonLabel = styled.span`
    padding-left: ${props => (props.icon ? '8px' : '0px')};
    padding-right: ${props => (props.iconRight ? '8px' : '0px')};
`;

const ButtonWrap = styled.span`
    display: flex;
`;

export const baseButtonCss = css`
    ${theme.TYPO_BUTTON}
    display: inline-flex;
    align-items: center;
    justify-content: ${props => props.$justifyContent ?? 'center'};
    border-radius: 10px;
    padding: ${props => props.padding ?? '0 20px'};
    text-shadow: none;
    box-shadow: none;
    cursor: pointer;

    &:disabled,
    &[disabled] {
        cursor: not-allowed;
    }
    > span {
        > span {
            text-transform: ${props => (props.iscapitalized ? 'capitalize' : 'uppercase')};
            text-transform: ${props => props.$autoCap && 'none'};
            font-family: ${props => props.normalFont && 'Geomanist'};
            font-weight: ${props => props.normalFont && 'normal'};
        }
    }
`;

export const buttonCss = css`
    ${baseButtonCss}

    ${mediaQueryProps('height', [props => `${props.mobileH ? props.mobileH : '34'}px`, props => `${props.$h ? props.$h : '40'}px`])}
    ${mediaQueryProps('font-size', [
        props => `${props.mobileFontSize ? props.mobileFontSize : '12'}px`,
        props => `${props.$fontSize ? props.$fontSize : '14'}px`,
    ])}

    &.ant-btn-sm {
        ${mediaQueryProps('height', [props => `${props.mobileH ? props.mobileH : '24'}px`, props => `${props.$h ? props.$h : '24'}px`])}
        ${mediaQueryProps('font-size', [
            props => `${props.mobileFontSize ? props.mobileFontSize : '14'}px`,
            props => `${props.$fontSize ? props.$fontSize : '14'}px`,
        ])}
    }
    &.ant-btn-lg {
        ${mediaQueryProps('height', [props => `${props.mobileH ? props.mobileH : '40'}px`, props => `${props.$h ? props.$h : '40'}px`])}
        ${mediaQueryProps('font-size', [
            props => `${props.mobileFontSize ? props.mobileFontSize : '14'}px`,
            props => `${props.$fontSize ? props.$fontSize : '14'}px`,
        ])}
    }

    ${sizeUtils}
    ${textUtils}
    ${colorUtils}

    &.ant-btn-primary {
        ${buttonPrimaryCss}
    }
    &.ant-btn-bordered {
        ${buttonBorderedCss}
    }
    &.ant-btn-default {
        ${buttonDefaultCss}
    }
    &.ant-btn-danger {
        ${buttonDangerCss}
    }
    &.ant-btn-ghost {
        ${buttonGhostCss}
    }

    ${props => props.isBadge && badgeCss}
    ${props => props.isBadge && mediaQueryProps('height', ['34px', '34px'])}
    ${props => props.isBadge && mediaQueryProps('font-size', ['14px', '14px'])}

    ${props =>
        props.iconOnly &&
        css`
            height: ${args => `${args.$h ? args.$h : '34'}px`};
            width: ${args => `${args.$w ? args.$w : '34'}px`};
            padding-left: 0px;
            padding-right: 0px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            line-height: 1;

            &.ant-btn-loading {
                padding-left: 0 !important;

                .anticon {
                    margin-left: 0 !important;
                }

                span {
                    display: none;
                }
            }
        `}

    ${ButtonWrap} {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        pointer-events: all;
    }
`;

const ExcludeAntdButtonDOM = ({
    isBadge,
    children,
    iconOnly,
    textVariant,
    colorScheme,
    textTransform,
    lineH,
    mobileH,
    hasDropDown,
    justifyContent,
    borderW,
    mobileFontSize,
    noColorTransitions,
    minW,
    ...props
}) => <AntdButton {...props}>{children}</AntdButton>;

const StyledButton = styled(ExcludeAntdButtonDOM)`
    &.ant-btn {
        ${buttonCss}
    }
`;

/**
 * Button Component
 * @type {React.FC<import('antd/lib/button').ButtonProps>}
 */
export const Button = ({ icon, iconRight, children, ...buttonProps }) => {
    const iconOnly = (icon || iconRight) && !children;
    return (
        <StyledButton {...buttonProps} iconOnly={iconOnly}>
            <ButtonWrap>
                {icon}
                {children && (
                    <ButtonLabel icon={icon} iconRight={iconRight}>
                        {children}
                    </ButtonLabel>
                )}
                {iconRight}
            </ButtonWrap>
        </StyledButton>
    );
};
