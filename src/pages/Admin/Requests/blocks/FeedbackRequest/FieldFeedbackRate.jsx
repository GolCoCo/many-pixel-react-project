import React, { forwardRef } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import IconRateBad from '@components/Svg/IconRateBad';
import IconRateNeutral from '@components/Svg/IconRateNeutral';
import IconRateGreat from '@components/Svg/IconRateGreat';

const rates = [
    {
        name: 'Bad',
        icon: IconRateBad,
        color: 'other-red',
        $bg: 'badge-red',
        value: 'Bad',
        text: 'We are always looking to improve our service. It would help a lot if you could explain what went wrong.',
    },
    {
        name: 'Neutral',
        icon: IconRateNeutral,
        color: 'other-yellow',
        $bg: 'badge-yellow',
        value: 'Neutral',
        text: 'We are always looking to improve our service. It would help a lot if you could explain what could have gone better.',
    },
    {
        name: 'Great',
        icon: IconRateGreat,
        color: 'other-green',
        $bg: 'badge-green',
        value: 'Great',
        text: 'We are glad you enjoyed using ManyPixels. We are always looking to improve our service. Is there anything that we could have done better?',
    },
];

const FieldFeedbackRate = forwardRef(({ value, onChange, showText = true, bg = 'white' }, ref) => {
    return (
        <>
            <Box ref={ref} $d="flex" $alignItems="center" $justifyContent="center" $hasSpace space="28" $mb="16">
                {rates.map(({ icon: RateIcon, name: rateName, color: rateColor, value: rateValue, $bg: rateBg }) => (
                    <Box $cursor="pointer" key={rateValue} $textAlign="center" role="presentation" onClick={() => onChange(rateValue)}>
                        <Box
                            $radii="4"
                            $colorScheme={rateColor}
                            $w="50"
                            $h="50"
                            $fontSize="34"
                            $d="inline-flex"
                            $alignItems="center"
                            $justifyContent="center"
                            $mb="4"
                            $trans="0.2s all"
                            $borderW="1"
                            $borderStyle="solid"
                            $bg={value === rateValue ? rateBg : bg}
                            $borderColor={value === rateValue ? rateColor : 'transparent'}
                            _hover={{
                                $borderColor: rateColor,
                                $bg: rateBg,
                            }}
                        >
                            <RateIcon />
                        </Box>
                        <Text $textVariant="H6" $colorScheme="primary">
                            {rateName}
                        </Text>
                    </Box>
                ))}
            </Box>
            {value && showText && (
                <Text $textVariant="P4" $colorScheme="primary" $mb="10">
                    {rates.find(rate => rate.value === value)?.text}
                </Text>
            )}
        </>
    );
});

export default FieldFeedbackRate;
