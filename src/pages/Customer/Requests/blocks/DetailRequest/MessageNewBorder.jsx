import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

export const MessageNewBorder = () => {
    return (
        <Box $d="flex" $alignItems="center">
            <Box $h="1" $flex={1} $bg="other-pink" />
            <Box hide="mobile" $px="6">
                <Box
                    $d="inline-flex"
                    $alignItems="center"
                    $justifyContent="center"
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="outline-gray"
                    $h="18"
                    $radii="4"
                    $w="47"
                >
                    <Text $textVariant="SmallTitle" $colorScheme="other-pink">
                        New
                    </Text>
                </Box>
            </Box>
            <Box $h="1" $flex={1} $bg="other-pink" />
        </Box>
    );
};
