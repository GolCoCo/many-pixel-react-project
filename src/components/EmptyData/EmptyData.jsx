import React from 'react';
import IconNoData from '@components/Svg/IconNoData';
import { Text } from '@components/Text';
import { Box } from '@components/Box';

export const EmptyData = () => {
    return (
        <Box $textAlign="center">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No data found
            </Text>
        </Box>
    );
};
