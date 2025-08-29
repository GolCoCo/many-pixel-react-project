import React, { memo, useState, useCallback } from 'react';
import { Box } from '@components/Box';
import { dispatchFieldChangeCallback } from '@utils/hook-lib';
import MembersTabFilters from './MembersTabFilters';
import MembersList from './MembersList';

const MembersTab = memo(({ viewer, isAddVisible, onAddClose }) => {
    const [orderData, setOrderData] = useState({});

    const [filters, setFilters] = useState({
        keyword: '',
        status: 'ALL',
        team: 'ALL',
        designType: 'ALL',
        role: 'ALL',
    });

    const onChangeFilters = useCallback((name, value) => {
        setFilters(dispatchFieldChangeCallback(name, value));
    }, []);

    return (
        <Box>
            <MembersTabFilters onChangeFilters={onChangeFilters} filters={filters} />
            <MembersList filters={filters} isAddVisible={isAddVisible} onAddClose={onAddClose} viewer={viewer} order={orderData} onOrder={setOrderData} />
        </Box>
    );
});

export default MembersTab;
