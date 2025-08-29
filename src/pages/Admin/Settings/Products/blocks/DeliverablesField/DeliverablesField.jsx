import React, { forwardRef } from 'react';
import { Select } from '@components/Select';
import { DELIVERABLES } from '@constants/deliverables';

const deliverablesOptions = DELIVERABLES.filter(deliverable => deliverable.value !== 'LET_MY_DESIGNER_CHOOSE' && deliverable.value !== 'OTHERS').map(
    deliverable => (
        <Select.Option key={deliverable.id} value={deliverable.value}>
            {deliverable.title}
        </Select.Option>
    )
);

const DeliverablesField = forwardRef(({ value, onChange, onRemoveDeliverable, onUnremoveDeliverable }, ref) => {
    const handleDeselectDeliverables = val => {
        if (onRemoveDeliverable) {
            onRemoveDeliverable(val);
        }
    };

    const handleSelectDeliverables = val => {
        if (onUnremoveDeliverable) {
            onUnremoveDeliverable(val);
        }
    };

    return (
        <Select
            ref={ref}
            value={value}
            onSelect={handleSelectDeliverables}
            onDeselect={handleDeselectDeliverables}
            onChange={onChange}
            placeholder="Select file types"
            mode="multiple"
            optionFilterProp="label"
        >
            {deliverablesOptions}
        </Select>
    );
});

export default DeliverablesField;
