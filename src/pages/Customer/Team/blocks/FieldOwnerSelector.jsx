import React, { forwardRef } from 'react';
import { Checkbox } from '@components/Checkbox';
import { Box } from '@components/Box';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import { capitalize } from '@constants/utils';
import { Image } from '@components/Image';

const FieldOwnerSelector = forwardRef(({ value, onChange, options, mb = '14', ...rest }, ref) => {
    const toggle = newVal => {
        if (value?.indexOf(newVal) > -1) {
            onChange(value.filter(item => newVal !== item));
        } else {
            onChange([...(value ?? []), newVal]);
        }
    };

    return (
        <>
            {options?.map(option => (
                <Card key={option.id} $py="10" $px="16" $mb={mb} $hoverable $isActive={Array.isArray(value) && value.indexOf(option.id) > -1} {...rest}>
                    <Image src={option?.picture?.url} name={`${option.firstname} ${option.lastname}`} isRounded size={40} $fontSize="14" />
                    <Box $pl="12">
                        <Text $textVariant="Badge" $colorScheme="primary">
                            {option.firstname} {option.lastname}
                        </Text>
                        <Text $textVariant="P5" $colorScheme="secondary">
                            {capitalize(option.companyRole || '', true)}
                        </Text>
                    </Box>
                    <Box $ml="auto">
                        <Checkbox
                            checked={Array.isArray(value) && value.indexOf(option.id) > -1}
                            value={option.id}
                            name="owners[]"
                            onChange={ev => toggle(ev.target.value)}
                        />
                    </Box>
                </Card>
            ))}
        </>
    );
});

export default FieldOwnerSelector;
