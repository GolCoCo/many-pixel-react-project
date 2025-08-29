import React, { forwardRef } from 'react';
import { Input } from '@components/Input';

const TooltipField = forwardRef(({ value, onChange, featureName }, ref) => {
    const handleTooltipChange = ev => {
        onChange({ [featureName]: ev.target.value });
    };

    return <Input ref={ref} defaultValue={value} onChange={handleTooltipChange} placeholder="Enter tooltip information" />;
});

export default TooltipField;
