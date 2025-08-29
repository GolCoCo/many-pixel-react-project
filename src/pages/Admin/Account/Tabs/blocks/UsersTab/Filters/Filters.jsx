import React from 'react';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import IconSearch from '@components/Svg/IconSearch';

const Filters = ({ onChangeFilters }) => {
    const handleFieldsChange = e => {
        const newValue = e.target.value;
        onChangeFilters({ user: newValue });
    };

    return (
        <Box $maxW="404" $flex="1" $mt="20">
            <Input
                prefix={
                    <Box $d="inline-flex" $alignItems="center" $colorScheme="cta" $lineH="1">
                        <IconSearch />
                    </Box>
                }
                placeholder="Search by name"
                onChange={e => handleFieldsChange(e)}
            />
        </Box>
    );
};

export default Filters;
