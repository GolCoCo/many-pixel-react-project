import React from 'react';
import { Box } from '@components/Box';

import IconFeedbackFilled from '@components/Svg/IconFeedbackFilled';
import IconFeedbackOutline from '@components/Svg/IconFeedbackOutline';

export const IconFeedbackBackground = ({ children, isActive, isUnread, size = 30 }) => {
    return (
        <Box $pos="relative" $d="flex" $alignItems="center" $alignSelf="center" $justifyContent="center" $w={`${size - 6}px`} $h={`${size - 6}px`}>
            <Box $pos="absolute" $fontSize={`${size}px`} $colorScheme={isActive ? 'cta' : isUnread ? 'other-pink' : 'outline-gray'} $top="-4px">
                {isActive || isUnread ? <IconFeedbackFilled /> : <IconFeedbackOutline />}
            </Box>
            <Box $zIndex="2" $colorScheme={isActive || isUnread ? 'white' : 'primary'} $alignSelf="center" $d="inline-flex" $alignItems="center">
                {children}
            </Box>
        </Box>
    );
};
