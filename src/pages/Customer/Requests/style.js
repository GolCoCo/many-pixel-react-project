import styled, { css } from 'styled-components';
import * as theme from '@components/Theme';
import { colorUtils, sizeUtils, mediaQueryVariantCss } from '@components/Utils';
import { Button } from '@components/Button';
import { Box } from '@components/Box';

export const RowItemContainer = styled.div`
    ${props =>
        props.$h &&
        css`
            height: ${props.$h}px;
        `}
    position: relative;
    ${sizeUtils}
    flex: 1;
    box-shadow: none;
    transition: 0.2s all;
    cursor: pointer;

    ${mediaQueryVariantCss('mobile')`
        padding: 14px 10px;
    `}

    .RowItemRequest_dateat {
        opacity: 0;
        transition: 0.15s all;
    }

    &:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        .RowItemRequest_dateat {
            opacity: 1;
        }
    }

    ${props =>
        props.$isOpen &&
        css`
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            .RowItemRequest_dateat {
                opacity: 1;
            }
        `}
`;

export const PrioritySticker = styled.span`
    ${theme.TYPO_H6}
    position: absolute;
    width: 25px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #f1f0f0;
    top: 0;
    color: ${theme.COLOR_CTA};
    border-bottom-right-radius: 10px;
`;

export const DropdownRowRequestItem = styled.button`
    width: 36px;
    height: 36px;
    color: ${theme.COLOR_CTA};
    background-color: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-size: 20px;
    border: 0;
    padding: 0;
    margin: 0;
    appearance: none;
    cursor: pointer;

    &.ant-dropdown-open,
    &:active {
        background-color: ${theme.COLOR_CTA};
        color: white;
    }
`;

/**
 * For research, if cannot use SVG later on
 */
export const ShieldContainer = styled.div`
    position: relative;
    width: 22px;
    height: 20px;
    text-align: center;
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
    border-radius: 2px;
    padding-top: 2px;
    ${colorUtils}
    ${sizeUtils}

  &:before {
        content: '';
        width: 13px;
        height: 13px;
        position: absolute;
        border-bottom: 1px solid;
        border-right: 1px solid;
        border-bottom-left-radius: 2px;
        border-top-right-radius: 2px;
        ${colorUtils}
        left: 0px;
        bottom: -6px;
        transform-origin: 11px 10px;
        transform: rotate(45deg) skew(-15deg, -15deg);
    }
`;

export const DetailActionButton = styled(Button)`
    &.ant-btn.ant-btn-danger,
    &.ant-btn.ant-btn-primary {
        ${theme.TYPO_P5}
        padding-left: 16px;
        padding-right: 16px;
        background-color: ${theme.COLOR_WHITE};
        color: ${theme.COLOR_TEXT_TERTIARY};
        text-transform: none;
        border-color: ${theme.COLOR_OUTLINE_GRAY};
        height: 34px;

        svg {
            font-size: 16px;
        }

        &:first-child {
            border-right-color: transparent;
        }

        &:last-child {
            border-left-color: transparent;
        }
    }

    &.ant-btn.ant-btn-primary {
        &:hover {
            background-color: #0099f6;
            border-color: #0099f6;
        }
    }
    &.ant-btn {
        ${sizeUtils}
    }
`;

export const FeedbackCanvasContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    ${props =>
        props.isCommentable &&
        css`
            cursor: url('/assets/icons/comment-cursor.png') 10 20, auto;
        `};

    ${props =>
        props.isDraggable &&
        css`
            cursor: grab;

            &:active {
                cursor: grabbing;
            }
        `}
`;

export const RequestTabContainer = styled(Box)`
    .ant-tabs-bar .ant-tabs-nav .ant-tabs-tab {
        padding-top: 16px;
        padding-bottom: 11px;
        line-height: 24px;
    }
`;
