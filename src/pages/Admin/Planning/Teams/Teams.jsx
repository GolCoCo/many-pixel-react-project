import React, { useState, useCallback } from 'react';
import { Box } from '@components/Box';
import TeamsList from './TeamsList';
import TeamsFilter from './TeamsFilter';
import debounce from 'lodash/debounce';
import withLoggedUser from '@components/WithLoggedUser';

const Teams = ({ viewer }) => {
    const [filters, setFilters] = useState({
        designer: 'ALL',
        team: 'ALL',
    });
    const onChangeFilters = useCallback(
        debounce(filterValues => setFilters(prev => ({ ...prev, ...filterValues })), 500),
        []
    );

    return (
        <Box>
            <TeamsFilter onChangeFilters={onChangeFilters} filters={filters} viewer={viewer} />
            <TeamsList filters={filters} />
        </Box>
    );
};

export default withLoggedUser(Teams);
