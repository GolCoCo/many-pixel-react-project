import React, { forwardRef } from 'react';

import { IconRightArrow } from '@components/Svg/IconRightArrow';
import styled from 'styled-components';
import * as theme from '../Theme';
import { Box } from '../Box';
import { sizeUtils } from '../Utils';

export const Breadcrumb = styled.div`
    ${sizeUtils}
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
`;

const StyledBreadcrumbItem = styled.div`
    ${theme.TYPO_P4}
    color: ${theme.COLOR_CTA};
    padding-right: 8px;

    &:last-child {
        color: ${theme.COLOR_TEXT_SECONDARY};
    }
`;

export const BreadcrumbItem = forwardRef(({ children, isFirst, ...props }, ref) => {
    return (
        <>
            {!isFirst && (
                <Box $mr="8" $fontSize="10" $lineH="0" $d="inline-block" $transform="translateY(1px)">
                    <IconRightArrow />
                </Box>
            )}
            <StyledBreadcrumbItem {...props} ref={ref}>
                {children}
            </StyledBreadcrumbItem>
        </>
    );
});
