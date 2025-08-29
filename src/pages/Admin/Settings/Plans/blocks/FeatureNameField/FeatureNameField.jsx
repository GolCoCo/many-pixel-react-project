import React, { forwardRef } from 'react';
import { Input } from '@components/Input';

const FeatureNameField = forwardRef(
    ({ onChange, tooltipValue, tooltipName, form, handleConfirmFeatures, value }, ref) => {
        const { setFieldsValue } = form;

        const handleFeatureNameChange = ev => {
            let currentTooltipValue = '';
            tooltipValue &&
                Object.keys(tooltipValue).map(k => {
                    currentTooltipValue = tooltipValue[k];
                    return k;
                });

            if (tooltipName) {
                setFieldsValue({ [tooltipName]: { [ev.target.value]: currentTooltipValue } });
            }

            onChange(ev.target.value);
            handleConfirmFeatures();
        };

        return <Input ref={ref} value={value} onChange={handleFeatureNameChange} placeholder="Enter feature name" />;
    }
);

export default FeatureNameField;
