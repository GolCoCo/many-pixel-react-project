import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Link } from '@components/Link';

export const TabItem = ({ isTabActive, tabName, label, previousPage }) => {
    const location = useLocation();

    return (
        <Box
            as={Link}
            $d="flex"
            $mr="27"
            $alignItems="flex-start"
            $cursor="pointer"
            to={{
                pathname: location.pathname,
                search: `?tab=${tabName}`,
                state: { previousPage },
            }}
            $userSelect="none"
            $pos="relative"
            $mb="-1"
            _after={{
                content: `''`,
                $pos: 'absolute',
                $bottom: '0',
                $bg: 'cta',
                $h: isTabActive(tabName) ? '3' : '0',
                $w: '100%',
            }}
        >
            <Text $textVariant="H6" $colorScheme={isTabActive(tabName) ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                {label}
            </Text>
        </Box>
    );
};
