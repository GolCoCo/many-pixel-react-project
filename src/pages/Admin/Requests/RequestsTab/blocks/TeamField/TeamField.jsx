import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { GET_ALL_TEAMS } from '@graphql/queries/team';

const TeamField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { loading, data } = useQuery(GET_ALL_TEAMS, {
        fetchPolicy: 'network-only',
    });

    const handleTeamSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const teams = [...(Array.isArray(data?.allTeams) ? data?.allTeams : [])].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    const options =
        teams && teams?.length > 0
            ? teams?.map(team => (
                  <Select.Option key={team?.id} value={team?.id} style={{ fontWeight: value === team?.id ? 400 : 300 }}>
                      {team?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select
            value={value}
            showSearch
            ref={ref}
            onChange={val => handleTeamSelect('team', val)}
            dropdownStyle={{ width: 180 }}
            dropdownMatchSelectWidth={false}
        >
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Accounts' Teams
            </Select.Option>
            {options}
        </Select>
    );
});

export default TeamField;
