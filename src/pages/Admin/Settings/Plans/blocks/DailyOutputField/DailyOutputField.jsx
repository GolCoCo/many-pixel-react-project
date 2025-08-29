import React, { forwardRef } from 'react';
import { Input } from '@components/Input';

const DailyOutputField = forwardRef(({ value, onChange }, ref) => {
    const handleChangeOutput = ev => {
        const output = !ev.target.value ? ev.target.value : parseInt(ev.target.value);
        if (ev.target.value && isNaN(output)) {
            return;
        }
        onChange(output);
    };

    return <Input ref={ref} value={value} onChange={handleChangeOutput} placeholder="Ex: 3" $w="195" />;
});

export default DailyOutputField;
