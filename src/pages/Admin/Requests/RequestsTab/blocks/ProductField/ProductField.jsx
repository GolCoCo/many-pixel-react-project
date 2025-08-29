import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { ALL_SERVICES } from '@graphql/queries/service';

const ProductField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { loading, data } = useQuery(ALL_SERVICES, {
        variables: { activated: true },
        fetchPolicy: 'network-only',
    });

    const handleProductSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const products = [...(Array.isArray(data?.allServices) ? data?.allServices : [])].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    const options =
        products && products?.length > 0
            ? products?.map(product => (
                  <Select.Option key={product?.id} value={product?.id} style={{ fontWeight: value === product?.id ? 400 : 300 }}>
                      {product?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            value={value}
            ref={ref}
            showSearch
            onChange={val => handleProductSelect('product', val)}
            dropdownMatchSelectWidth={false}
            dropdownAlign={{
                offset: [-55, 4],
            }}
        >
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Product Types
            </Select.Option>
            {options}
        </Select>
    );
});

export default ProductField;
