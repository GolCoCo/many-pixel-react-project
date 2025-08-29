import React from 'react';
import { Tooltip } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import IconQuestions from '@components/Svg/IconQuestions';
import { withResponsive } from '@components/ResponsiveProvider';

export const SectionHeader = withResponsive(({ title, total, tooltip, windowWidth }) => {
    const isDesktop = windowWidth >= 768;

    return (
        <Box $d="flex" $mb="20" $alignItems="center">
            <Text $textVariant="H6" $colorScheme="primary" $mr="6">
                {title}
            </Text>
            <Badge $variant="Primary" $isEllipse>
                <Text $textVariant="SmallTitle">{total}</Text>
            </Badge>
            {tooltip && isDesktop && (
                <Tooltip color="white" title={tooltip} trigger="hover" placement="topLeft">
                    <Box $pl="8" $d="inline-flex" $alignItems="center" $colorScheme="cta">
                        <IconQuestions size="16px" />
                    </Box>
                </Tooltip>
            )}
        </Box>
    );
});
