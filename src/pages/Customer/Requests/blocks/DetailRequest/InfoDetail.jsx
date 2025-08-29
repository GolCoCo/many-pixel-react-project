import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Tooltip } from 'antd';
import IconQuestions from '@components/Svg/IconQuestions';

export const InfoDetail = ({ title, children, tooltip, ...rest }) => {
    return (
        <Box $mb="14" {...rest}>
            <Box $d="flex" $alignItems="center">
                <Text $textVariant="P4" $colorScheme="secondary">
                    {title}
                </Text>
                {tooltip && (
                    <Tooltip color="white" title={tooltip} trigger="hover">
                        <Box as="span" $pl="8" $d="inline-flex" $alignItems="center" $colorScheme="cta">
                            <IconQuestions />
                        </Box>
                    </Tooltip>
                )}
            </Box>
            {children}
        </Box>
    );
};
