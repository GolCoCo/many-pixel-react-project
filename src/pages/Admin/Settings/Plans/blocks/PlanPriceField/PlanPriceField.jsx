import React, { forwardRef } from 'react';
import { Input } from '@components/Input';

const PlanPriceField = forwardRef(({ value, onChange, disabled }, ref) => {
    const handleChangePrice = ev => {
        const price = !ev.target.value ? ev.target.value : parseInt(ev.target.value);
        if (ev.target.value && isNaN(price)) {
            return;
        }
        onChange(price);
    };

    return (
        <Input
            ref={ref}
            disabled={disabled}
            prefix="$"
            value={value}
            onChange={handleChangePrice}
            placeholder="100"
            prefixPaddingLeft="25"
        />
    );
});

export default PlanPriceField;
