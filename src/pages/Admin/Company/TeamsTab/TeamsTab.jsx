import React, { memo, useState, useCallback } from 'react';
import { Box } from '@components/Box';
import TeamsList from './TeamsList';
import TeamsFilter from './TeamsFilter';

const TeamsTab = memo(({ isAddVisible, onAddClose }) => {
    const [search, setSearch] = useState('');

    const onChangeFilters = useCallback((name, value) => {
        if (name === 'search') setSearch(value);
    }, []);

    return (
        <Box>
            <TeamsFilter onChangeFilters={onChangeFilters} />
            <TeamsList search={search} isAddVisible={isAddVisible} onAddClose={onAddClose} />
        </Box>
    );
});

export default TeamsTab;
