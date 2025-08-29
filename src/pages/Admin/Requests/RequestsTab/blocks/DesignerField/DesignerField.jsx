import React, { forwardRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import { ALL_WORKERS } from '@graphql/queries/user';

const DesignerField = forwardRef(({ value, onChange, onFieldChange, isWorker }, ref) => {
    const { loading, data } = useQuery(ALL_WORKERS, {
        fetchPolicy: 'network-only',
    });

    const handleDesignerSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    const allUsersTemp = [...(Array.isArray(data?.allUsers) ? data.allUsers : [])].sort((a, b) => {
        const nameA = a.firstname.toLowerCase();
        const nameB = b.firstname.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    const designers = useMemo(
        () => (Array.isArray(allUsersTemp) ? allUsersTemp : []).filter(user => !(user.archived && user.id !== value)),
        [allUsersTemp, value]
    );

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const options = designers.map(designer => (
        <Select.Option key={designer.id} value={designer.id} style={{ fontWeight: value === designer.id ? 400 : 300 }} disabled={designer.archived}>
            <Box $d="flex" $alignItems="center" $maxW="231">
                <Box $isTruncate $maxW="195">
                    {designer.firstname} {designer.lastname}
                </Box>
            </Box>
        </Select.Option>
    ));

    return (
        <Select
            ref={ref}
            value={value}
            disabled={isWorker}
            onChange={val => handleDesignerSelect('designer', val)}
            dropdownStyle={{ width: 'auto' }}
            dropdownMatchSelectWidth={false}
            showSearch
        >
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Designers
            </Select.Option>
            {options}
        </Select>
    );
});

export default DesignerField;
