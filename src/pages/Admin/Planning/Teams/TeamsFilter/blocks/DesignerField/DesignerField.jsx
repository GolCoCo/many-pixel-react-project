import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import { ALL_ACTIVE_WORKERS } from '@graphql/queries/user';

const DesignerField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { loading, data } = useQuery(ALL_ACTIVE_WORKERS, {
        fetchPolicy: 'network-only',
    });

    const handleDesignerSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const designers = data?.allUsers;

    const options =
        designers && designers?.length > 0
            ? designers?.map(designer => (
                  <Select.Option key={designer?.id} value={designer?.id} style={{ fontWeight: value === designer?.id ? 400 : 300 }}>
                      <Box $d="flex" $alignItems="center" $maxW="231">
                          <Box $isTruncate $maxW="195">
                              {designer?.firstname} {designer?.lastname}
                          </Box>
                      </Box>
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            ref={ref}
            value={value}
            onChange={val => handleDesignerSelect('designer', val)}
            dropdownStyle={{ width: 'auto' }}
            dropdownMatchSelectWidth={false}
        >
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Designers
            </Select.Option>
            {options}
        </Select>
    );
});

export default DesignerField;
