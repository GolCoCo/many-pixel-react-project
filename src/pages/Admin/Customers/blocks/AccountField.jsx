import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { ALL_COMPANIES } from '@graphql/queries/company';

const AccountField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { loading, data } = useQuery(ALL_COMPANIES, {
        fetchPolicy: 'network-only',
    });

    const handleAccountSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const companies = data?.allCompanies;

    const options =
        companies && companies?.length > 0
            ? companies?.map(company => (
                  <Select.Option key={company?.id} value={company?.id} style={{ fontWeight: value === company?.id ? 400 : 300 }}>
                      {company?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select value={value} ref={ref} onChange={val => handleAccountSelect('account', val)}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Accounts
            </Select.Option>
            {options}
        </Select>
    );
});

export default AccountField;
