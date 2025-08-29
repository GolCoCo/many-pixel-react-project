import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import IconNoData from '@components/Svg/IconNoData';

export const EmptyRequest = ({ spaceTop = ['45', '100'] }) => {
    return (
        <Box $pt={spaceTop} $d="flex" $alignItems="center" $justifyContent="center" $maxW="550" $w="100%" $mx="auto" $textAlign="center">
            <Box>
                <Box $fontSize="159" $lineH="1">
                    <IconNoData />
                </Box>
                <Text $textVariant="H5" $colorScheme="headline" $mt="30" $mb="15">
                    No request found
                </Text>
            </Box>
        </Box>
    );
};
