import React, { forwardRef, useState, useEffect } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

const StatusField = forwardRef(({ value, handleFieldsChange }, ref) => {
    const [activeStatus, setActiveStatus] = useState('ALL');
    useEffect(() => {
        setActiveStatus(value);
    }, [value]);

    const handleChangeStatus = val => {
        setActiveStatus(val);
        // onChange(val);
        handleFieldsChange('status', val);
    };

    return (
        <Box ref={ref} $d="flex" $alignItems="center" $mx="-5">
            <Text $textVariant="H6" $ml="5" $mr="20">
                Status
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus === 'ALL' ? 'white' : 'primary'}
                $bg={activeStatus === 'ALL' ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus === 'ALL' ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('ALL')}
            >
                All
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus === 'ACTIVE' ? 'white' : 'primary'}
                $bg={activeStatus === 'ACTIVE' ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus === 'ACTIVE' ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('ACTIVE')}
            >
                Active
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus === 'INACTIVE' ? 'white' : 'primary'}
                $bg={activeStatus === 'INACTIVE' ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus === 'INACTIVE' ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('INACTIVE')}
            >
                Inactive
            </Text>
        </Box>
    );
});

export default StatusField;
