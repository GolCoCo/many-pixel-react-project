import React, { useState, useCallback, memo } from 'react';
import { Box } from '@components/Box';
import debounce from 'lodash/debounce';
import MembersList from './MembersList';
import MembersFilter from './MembersFilter';

// TODO add QC once added to production
const roles = ['teamLeaders', 'designers'];

const MembersTab = memo(({ team, isAddVisible, onAddClose, isEditVisible, onEditClose }) => {
    const [filters, setFilters] = useState();
    const onChangeFilters = useCallback(
        debounce(filterValues => setFilters(filterValues), 500),
        []
    );

    return (
        <Box $py="30">
            <MembersFilter onChangeFilters={onChangeFilters} />
            <MembersList
                team={team}
                isAddVisible={isAddVisible}
                isEditVisible={isEditVisible}
                onAddClose={onAddClose}
                onEditClose={onEditClose}
                roles={roles}
                filters={filters}
            />
        </Box>
    );
});

export default MembersTab;
