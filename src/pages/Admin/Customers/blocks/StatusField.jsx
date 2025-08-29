import React, { forwardRef } from 'react';
import { Select } from '@components/Select';

const StatusField = forwardRef(({ value, onChange, onFieldChange, isUsersActive }, ref) => {
    const statusOptions = isUsersActive
        ? [
              { name: 'Active', value: 'active' },
              { name: 'Inactive', value: 'canceled' },
          ]
        : [
              { name: 'Active', value: 'active' },
              { name: 'Inactive', value: 'inactive' },
              { name: 'Paused', value: 'paused' },
              //   { name: 'Canceled', value: 'canceled' }
          ];

    const handleStatusSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    const options = statusOptions.map(status => (
        <Select.Option key={status?.name} value={status?.value} style={{ fontWeight: value === status?.value ? 400 : 300 }}>
            {status?.name}
        </Select.Option>
    ));

    return (
        <Select value={value} ref={ref} onChange={val => handleStatusSelect('status', val)}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Status
            </Select.Option>
            {options}
        </Select>
    );
});

export default StatusField;
