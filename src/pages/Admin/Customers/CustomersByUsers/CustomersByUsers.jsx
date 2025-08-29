import React, { useState, useCallback } from 'react';
import { Box } from '@components/Box';
import { dispatchFieldChangeCallback } from '@utils/hook-lib';
import CustomersByUsersFilter from '../blocks/CustomersByUsersFilter.jsx';
import CustomersByUsersList from '../blocks/CustomersByUsersList.jsx';

const CustomersByUsers = () => {
    const [filters, setFilters] = useState({
        keyword: '',
        account: 'ALL',
        role: 'ALL',
        status: 'ALL',
    });

    const onChangeFilters = useCallback((name, value) => {
        setFilters(dispatchFieldChangeCallback(name, value));
    }, []);

    return (
        <Box $py="30">
            <CustomersByUsersFilter onChangeFilters={onChangeFilters} />
            <CustomersByUsersList filters={filters} />
        </Box>
    );
};

export default CustomersByUsers;
