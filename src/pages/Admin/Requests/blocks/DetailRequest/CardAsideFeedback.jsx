import React from 'react';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import IconRateBad from '@components/Svg/IconRateBad';
import IconRateNeutral from '@components/Svg/IconRateNeutral';
import IconRateGreat from '@components/Svg/IconRateGreat';

const rates = {
    Bad: { icon: IconRateBad, color: 'other-red' },
    Neutral: { icon: IconRateNeutral, color: 'other-yellow' },
    Great: { icon: IconRateGreat, color: 'other-green' },
};

export const IconFeedback = ({ rate, ...boxProps }) => {
    const { icon: RateIcon, color } = rates[rate];
    return (
        <Box {...boxProps} $colorScheme={color}>
            <RateIcon />
        </Box>
    );
};

export const CardAsideFeedback = ({ rate }) => {
    return (
        <Box $borderW="1" $borderStyle="solid" $borderColor="outline-gray">
            <Box $px="20" $py="14" $borderB="1" $borderBottomStyle="solid" $borderBottomColor="outline-gray">
                <Text $textVariant="H6" $lineH="20">
                    Your feedback
                </Text>
            </Box>
            <Box $textAlign="center" $py="20">
                <Box $mb="4" $bg="bg-gray" $w="70" $h="70" $radii="10" $mx="auto" $d="inline-flex" $alignItems="center" $justifyContent="center">
                    <IconFeedback rate={rate} $fontSize="50" $lineH="1" />
                </Box>
                <Text $textVariant="H4">{rate}</Text>
            </Box>
        </Box>
    );
};
