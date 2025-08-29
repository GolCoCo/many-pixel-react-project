import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { Box } from '@components/Box';
import AccountsFilter from './AccountsFilter';
import AccountsTable from './AccountsTable';

const AccountsTab = ({ team, isAddVisible, onAddClose, isEditVisible, onEditClose }) => {
    const [filters, setFilters] = useState({
        status: 'ALL',
        search: '',
    });
    const onChangeFilters = useCallback(
        debounce(filterValues => setFilters(prev => ({ ...prev, ...filterValues })), 500),
        []
    );

    return (
        <Box $py="30">
            <AccountsFilter onChangeFilters={onChangeFilters} />
            <AccountsTable
                filters={filters}
                team={team}
                isAddVisible={isAddVisible}
                isEditVisible={isEditVisible}
                onAddClose={onAddClose}
                onEditClose={onEditClose}
            />
        </Box>
    );
};

export default AccountsTab;
