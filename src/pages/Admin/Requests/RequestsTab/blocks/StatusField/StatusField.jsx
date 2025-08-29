import React, { forwardRef, useState, useEffect } from 'react';
import uniq from 'lodash/uniq';
import remove from 'lodash/remove';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

const StatusField = forwardRef(({ value, onChange, handleFieldsChange, isWorker }, ref) => {
    const [activeStatus, setActiveStatus] = useState(['SUBMITTED', 'ONGOING_PROJECT']);

    useEffect(() => {
        setActiveStatus(value);
    }, [value]);

    const handleChangeStatus = val => {
        let currentSelection = activeStatus;
        let fieldsChange;

        if (val === 'ALL') {
            onChange([val]);
            fieldsChange = [val];
        } else {
            if (isWorker) {
                if (currentSelection.includes(val)) {
                    remove(currentSelection, s => s === val);
                    onChange(currentSelection);
                    fieldsChange = currentSelection;
                } else if (currentSelection.includes('ALL')) {
                    remove(currentSelection, s => s === 'ALL');
                    onChange(uniq([...currentSelection, val]));
                    fieldsChange = uniq([...currentSelection, val]);
                } else {
                    onChange(uniq([...currentSelection, val]));
                    fieldsChange = uniq([...currentSelection, val]);
                }
            } else {
                onChange([val]);
                fieldsChange = [val];
            }
        }
        handleFieldsChange('status', fieldsChange);
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
            <Text
                $mx="5"
                $trans="color 250ms ease-in-out, background 250ms ease-in-out, border-color 250ms ease-in-out"
                $textVariant="Badge"
                $colorScheme={activeStatus.includes('ON_HOLD') ? 'white' : 'primary'}
                $bg={activeStatus.includes('ON_HOLD') ? 'cta' : 'white'}
                $borderW="1"
                $borderStyle="solid"
                $borderColor={activeStatus.includes('ON_HOLD') ? 'cta' : 'outline-gray'}
                $radii="18"
                $px="24"
                $py="6"
                $cursor="pointer"
                onClick={() => handleChangeStatus('ON_HOLD')}
            >
                Paused
            </Text>
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
        </Box>
    );
});

export default StatusField;
