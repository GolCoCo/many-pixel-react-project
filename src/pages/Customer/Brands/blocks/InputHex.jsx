import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { InputHexBase, PreviewColor } from '../style.js';

export const InputHex = ({ value, onChange }) => {
    const usedValue = value ? value.replace('#', '') : '';

    const handleChange = ev => {
        if (onChange) {
            onChange(`#${ev.target.value ?? ''}`);
        }
    };

    return (
        <InputHexBase
            value={usedValue}
            prefix={
                <Box $d="inline-flex" $alignItems="center">
                    <PreviewColor $bg={value} />
                    <Text $pl="4" $colorScheme="primary">
                        #
                    </Text>
                </Box>
            }
            onChange={handleChange}
            placeholder="000000"
            maxLength={6}
        />
    );
};
