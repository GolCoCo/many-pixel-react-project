import React, { forwardRef, useState, useEffect } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

const StatusField = forwardRef(({ value, onChange, handleFieldsChange, isWorker }, ref) => {
    const [activeStatus, setActiveStatus] = useState(['ALL']);

    useEffect(() => {
        setActiveStatus(value);
    }, [value]);

    const handleChangeStatus = val => {
        onChange([val]);
        handleFieldsChange('status', [val]);
    };

    return (
        <Box ref={ref} $d="flex" $alignItems="center" $mx="-5">
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('ALL') ? 'white' : 'primary'}
                $bg={activeStatus.includes('ALL') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('ALL') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('ALL')}
            >
                All
            </Text>
            {!isWorker && (
                <Text
                    $mx="5"
                    $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                    $textVariant="Badge"
                    $colorScheme={activeStatus.includes('DRAFT') ? 'white' : 'primary'}
                    $bg={activeStatus.includes('DRAFT') ? 'cta' : 'white'}
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor={activeStatus.includes('DRAFT') ? 'cta' : 'outline-gray'}
                    $radii="18"
                    $px="24"
                    $py="6"
                    $cursor="pointer"
                    onClick={() => handleChangeStatus('DRAFT')}
                >
                    Draft
                </Text>
            )}
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('SUBMITTED') ? 'white' : 'primary'}
                $bg={activeStatus.includes('SUBMITTED') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('SUBMITTED') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('SUBMITTED')}
            >
                Submitted
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('ONGOING_PROJECT') ? 'white' : 'primary'}
                $bg={activeStatus.includes('ONGOING_PROJECT') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('ONGOING_PROJECT') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('ONGOING_PROJECT')}
            >
                Ongoing
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('DELIVERED_PROJECT') ? 'white' : 'primary'}
                $bg={activeStatus.includes('DELIVERED_PROJECT') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('DELIVERED_PROJECT') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('DELIVERED_PROJECT')}
            >
                Delivered
            </Text>
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('COMPLETED') ? 'white' : 'primary'}
                $bg={activeStatus.includes('COMPLETED') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('COMPLETED') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('COMPLETED')}
            >
                Completed
            </Text>
        </Box>
    );
});

export default StatusField;
