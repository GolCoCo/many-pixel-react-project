import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

const steps = ['CHOOSE PLAN', 'CREATE ACCOUNT', 'CHECKOUT', 'COMPANY INFORMATION', 'SUCCESS'];

const Steps = ({ indexStep = 2 }) => {
    return (
        <Box $d="flex" $justifyContent="center" $mb="44">
            <Box $d="flex" $alignItems="center" $flexWrap="wrap" $w="100%" $maxW="951" $justifyContent="space-between">
                {steps.map((step, index) => {
                    const active = indexStep - 1 >= index;
                    return (
                        <Box key={index} $d="flex" $alignItems="center">
                            <Box
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor={active ? 'cta' : 'element-gray'}
                                $w="27"
                                $h="28"
                                $textVariant="H6"
                                $colorScheme={active ? 'cta' : 'element-gray'}
                                $mr="16"
                                $textAlign="center"
                                $d="flex"
                                $justifyContent="center"
                                $alignItems="center"
                                $radii="8"
                            >
                                {index + 1}
                            </Box>
                            <Text $textVariant="H6" $colorScheme={active ? 'cta' : 'element-gray'}>
                                {step}
                            </Text>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default Steps;
