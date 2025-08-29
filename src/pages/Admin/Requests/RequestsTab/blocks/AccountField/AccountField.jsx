import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { ALL_ACTIVE_COMPANIES } from '@graphql/queries/company';

const AccountField = forwardRef(({ value, onChange, onFieldChange, isWorker }, ref) => {
    const { loading, data } = useQuery(ALL_ACTIVE_COMPANIES, {
        variables: {
            where: {
                name: {
                    not: {
                        contains: 'ManyPixels',
                    },
                    mode: 'Insensitive',
                },
            },
        },
        fetchPolicy: 'cache-and-network',
    });

    const handleAccountSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const companies = [...(Array.isArray(data?.allActiveCompanies) ? data?.allActiveCompanies : [])].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    const options =
        companies && companies?.length > 0
            ? companies?.map(company => (
                  <Select.Option key={company?.id} value={company?.id} style={{ fontWeight: value === company?.id ? 400 : 300 }}>
                      {company?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            value={value}
            ref={ref}
            showSearch
            onChange={val => handleAccountSelect('account', val)}
            dropdownStyle={{ width: isWorker ? '356' : '226' }}
            dropdownMatchSelectWidth={isWorker}
        >
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Accounts
            </Select.Option>
            {options}
        </Select>
    );
});

export default AccountField;
