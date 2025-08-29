import React, { forwardRef } from 'react';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';

const ProductsField = forwardRef(({ value, onChange, loading, data, onRemoveProduct, onUnremoveProduct }, ref) => {
    if (loading) {
        return <Skeleton $w="100%" $h="47" />;
    }

    const handleDeselectProducts = val => {
        if (onRemoveProduct) {
            onRemoveProduct(val);
        }
    };

    const handleSelectProducts = val => {
        if (onUnremoveProduct) {
            onUnremoveProduct(val);
        }
    };

    const options = data?.allActivatedServices?.map(product => (
        <Select.Option key={product.id} value={product.id} label={product.name}>
            {product.name}
        </Select.Option>
    ));

    return (
        <Select
            ref={ref}
            value={value}
            onSelect={handleSelectProducts}
            onDeselect={handleDeselectProducts}
            onChange={onChange}
            placeholder="Select product"
            mode="multiple"
            optionFilterProp="label"
        >
            {options}
        </Select>
    );
});

export default ProductsField;
