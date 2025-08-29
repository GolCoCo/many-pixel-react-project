import React, { useState, useCallback } from 'react';
import { Box } from '@components/Box';
import { dispatchFieldChangeCallback } from '@utils/hook-lib';
import CustomersByAccountsFilter from '../blocks/CustomersByAccountsFilter.jsx';
import CustomersByAccountsList from '../blocks/CustomersByAccountsList.jsx';

const CustomersByAccounts = () => {
    const [filters, setFilters] = useState({
        keyword: '',
        plan: 'ALL',
        status: 'ALL',
        team: 'ALL',
    });

    const onChangeFilters = useCallback((name, value) => {
        setFilters(dispatchFieldChangeCallback(name, value));
    }, []);

    return (
        <Box $py="30">
            <CustomersByAccountsFilter onChangeFilters={onChangeFilters} />
            <CustomersByAccountsList filters={filters} />
        </Box>
    );
};

export default CustomersByAccounts;
