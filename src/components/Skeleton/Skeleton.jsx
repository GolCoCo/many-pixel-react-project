import React from 'react';
import styled, { css } from 'styled-components';
import { Skeleton as AntdSkeleton } from 'antd';
import { mediaQueryUtils, sizeUtils, displayUtils } from '../Utils';

const avatarVariant = css`
    height: ${props => `${props.avatarSize ? props.avatarSize : '32'}px`};
    width: ${props => `${props.avatarSize ? props.avatarSize : '32'}px`};
    line-height: ${props => `${props.avatarSize ? props.avatarSize : '32'}px`};
    border-radius: 50%;
`;

const shieldVariant = css`
    position: relative;
    width: 22px;
    height: 20px;
    padding-top: 2px;
    border-radius: 2px;
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
    border-color: transparent;

    &:before {
        content: '';
        width: 13px;
        height: 13px;
        position: absolute;
        border-bottom: 1px solid;
        border-right: 1px solid;
        border-bottom-left-radius: 2px;
        border-top-right-radius: 2px;
        left: 0px;
        bottom: -6px;
        transform-origin: 11px 10px;
        transform: rotate(45deg) skew(-15deg, -15deg);
        border-color: transparent;
        background: #f2f2f2;
    }
`;

const priorityVariant = css`
    position: relative;
    width: 25px;
    height: 20px;
    padding-top: 2px;
    border-radius: 2px;
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
    border-color: transparent;
    border-radius: 0 0 10px 0 !important;

    &:before {
        content: '';
        width: 13px;
        height: 13px;
        position: absolute;
        border-bottom: 1px solid;
        border-right: 1px solid;
        border-bottom-left-radius: 2px;
        border-top-right-radius: 2px;
        left: 0px;
        bottom: 0px;
        transform-origin: 11px 10px;
        transform: rotate(45deg) skew(-15deg, -15deg);
        border-color: transparent;
        background: #f2f2f2;
    }
`;

const variants = {
    avatar: avatarVariant,
    shield: shieldVariant,
    priority: priorityVariant
};

const StyledSkeleton = styled(AntdSkeleton)`
    ${sizeUtils}
    ${displayUtils}
    ${mediaQueryUtils}
    .ant-skeleton-content {
        .ant-skeleton-title {
            border-radius: 10px;
            display: block;
            width: 100%;
            height: 100%;
            ${props => variants[props.$variant]}
        }
      
    }
 
`;

/**
 * Skeleton Component
 * @type {React.FC<import('antd/lib/skeleton').SkeletonProps>}
 */
export const Skeleton = ({ ...skeletonProps }) => {
    let active = true;

    if (skeletonProps.$variant) {
        active = false
    }
    return <StyledSkeleton active={active} paragraph={false} variant={skeletonProps.$variant} {...skeletonProps} />;
};
