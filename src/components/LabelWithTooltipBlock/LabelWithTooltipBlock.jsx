import React from 'react';
import { Tooltip } from 'antd';
import IconQuestions from '@components/Svg/IconQuestions';
import { Box } from '../Box';
import { LabelText } from './style';

export const TooltipIconBlock = ({
    label,
    required,
    tooltip,
    $textVariant,
    $colorScheme,
    tooltipIconColor = 'primary',
    tooltipIconSize = '1em',
    isInlineBlock = false,
}) => {
    return (
        <Box $pos="relative" $d={['none', isInlineBlock ? 'inline-block' : 'inline-flex']} $alignItems="center">
            <LabelText required={required} $textVariant={$textVariant} $colorScheme={$colorScheme}>
                {label}
            </LabelText>
            {tooltip && (
                <Tooltip color="white" title={tooltip} trigger="hover">
                    <Box
                        as="span"
                        $ml={required ? '13' : '8'}
                        $colorScheme={tooltipIconColor === 'primary' ? 'cta' : 'white'}
                        {...(isInlineBlock
                            ? {
                                  $d: 'inline-block',
                                  $transform: 'translateY(4px)',
                              }
                            : {
                                  $d: 'inline-flex',
                                  $alignItems: 'center',
                              })}
                    >
                        <IconQuestions size={tooltipIconSize} />
                    </Box>
                </Tooltip>
            )}
        </Box>
    );
};
