import React, { forwardRef } from 'react';
import { Select } from '@components/Select';

const RoleField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const roleOptions = [
        { name: 'Admin', value: 'ADMIN' },
        { name: 'User', value: 'MEMBER' },
    ];

    const handleRoleSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    const options = roleOptions.map(role => (
        <Select.Option key={role?.name} value={role?.value} style={{ fontWeight: value === role?.value ? 400 : 300 }}>
            {role?.name}
        </Select.Option>
    ));

    return (
        <Select value={value} ref={ref} onChange={val => handleRoleSelect('role', val)}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Roles
            </Select.Option>
            {options}
        </Select>
    );
});

export default RoleField;
