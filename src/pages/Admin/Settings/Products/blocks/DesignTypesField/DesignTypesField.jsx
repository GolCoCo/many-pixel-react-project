import React, { forwardRef } from 'react';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';

const DesignTypesField = forwardRef(({ value, onChange, loading, data }, ref) => {
    if (loading) {
        return <Skeleton $w="100%" $h="47" />;
    }

    const options = data?.allDesignTypes?.map(designType => (
        <Select.Option key={designType.id} value={designType.id}>
            {designType.name}
        </Select.Option>
    ));

    return (
        <Select ref={ref} value={value} onChange={onChange} placeholder="Select type">
            {options}
        </Select>
    );
});

export default DesignTypesField;
