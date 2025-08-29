import React, { forwardRef } from 'react';
import { Select } from '@components/Select';

const roles = [
    {
        name: 'Administrator',
        value: 'owner',
    },
    {
        name: 'Team Leader',
        value: 'manager',
    },
    {
        name: 'Designer',
        value: 'worker',
    },
];

const RoleField = forwardRef(({ value, onChange, onFieldChange, showAll = true, disabled }, ref) => {
    const handleRoleSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    const options =
        roles && roles?.length > 0
            ? roles?.map((role, index) => (
                  <Select.Option
                      key={`${role?.name}-${index}`}
                      value={role?.value}
                      style={{ fontWeight: value === role?.value ? 400 : 300 }}
                  >
                      {role?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            value={value}
            ref={ref}
            onChange={val => handleRoleSelect('role', val)}
            dropdownStyle={{ width: 'auto' }}
            dropdownMatchSelectWidth={false}
            disabled={disabled}
        >
            {showAll && (
                <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                    All Roles
                </Select.Option>
            )}
            {options}
        </Select>
    );
});

export default RoleField;
