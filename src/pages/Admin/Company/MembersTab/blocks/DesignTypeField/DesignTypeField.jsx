import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { DESIGN_TYPES } from '@graphql/queries/designType';

const DesignTypeField = forwardRef(({ showAll = true, value, onChange, multiple, onFieldChange, disabled }, ref) => {
    const { loading, data } = useQuery(DESIGN_TYPES, {
        fetchPolicy: 'network-only',
    });
    const handleDesignTypeSelect = (key, val) => {
        if (onFieldChange) {
            onFieldChange(key, val);
        }
        if (onChange) {
            onChange(val);
        }
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const designTypes = data?.allDesignTypes;

    const options =
        designTypes && designTypes?.length > 0
            ? designTypes?.map(designType => (
                  <Select.Option key={designType?.id} value={designType?.id} style={{ fontWeight: value === designType?.id ? 400 : 300 }}>
                      {designType?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            value={value}
            ref={ref}
            onChange={val => handleDesignTypeSelect('designType', val)}
            dropdownStyle={{ width: 'auto' }}
            dropdownMatchSelectWidth={false}
            mode={multiple ? 'multiple' : 'default'}
            placeholder="Select design type"
            disabled={disabled}
        >
            {showAll && (
                <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                    All Design Type
                </Select.Option>
            )}
            {options}
        </Select>
    );
});

export default DesignTypeField;
