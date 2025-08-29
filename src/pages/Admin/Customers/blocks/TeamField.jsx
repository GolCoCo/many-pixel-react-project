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

    const teams = data?.allTeams;

    const options =
        teams && teams?.length > 0
            ? teams?.map(team => (
                  <Select.Option key={team?.id} value={team?.id} style={{ fontWeight: value === team?.id ? 400 : 300 }}>
                      {team?.name}
                  </Select.Option>
              ))
            : null;

    return (
        <Select value={value} ref={ref} onChange={val => handleTeamSelect('team', val)}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Teams
            </Select.Option>
            {options}
        </Select>
    );
});

export default TeamField;
