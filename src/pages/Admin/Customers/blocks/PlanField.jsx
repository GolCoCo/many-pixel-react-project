import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import capitalize from 'lodash/capitalize';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { ALL_PLANS } from '@graphql/queries/plan';

const PlanField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { loading, data } = useQuery(ALL_PLANS, {
        variables: { activated: true },
        fetchPolicy: 'network-only',
    });

    const handlePlanSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const plans = data?.allPlans;

    const options =
        plans && plans?.length > 0
            ? plans?.map(plan => (
                  <Select.Option key={plan?.id} value={plan?.id} style={{ fontWeight: value === plan?.id ? 400 : 300 }}>
                      {plan?.name}
                      {plan?.name !== 'Pause' ? ` - ${capitalize(plan?.interval)}` : ''}
                  </Select.Option>
              ))
            : null;

    return (
        <Select showSearch value={value} ref={ref} onChange={val => handlePlanSelect('plan', val)}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Plans
            </Select.Option>
            {options}
        </Select>
    );
});

export default PlanField;
