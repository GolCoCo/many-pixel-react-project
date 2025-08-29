import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_TEAMS } from '@graphql/queries/team';
import { Select } from '@components/Select';
import { Box } from '@components/Box';

const TeamsField = forwardRef(({ value, onChange, onFieldChange }, ref) => {
    const { data } = useQuery(GET_ALL_TEAMS, {
        fetchPolicy: 'network-only',
    });

    const handleTeamSelect = (key, val) => {
        onFieldChange(key, val);
        onChange(val);
    };

    const teams = data?.allTeams;

    const options =
        teams && teams?.length > 0
            ? teams?.map(team => (
                  <Select.Option key={team?.id} value={team?.id} style={{ fontWeight: value === team?.id ? 400 : 300 }}>
                      <Box $d="flex" $alignItems="center" $maxW="231">
                          <Box $isTruncate $maxW="195">
                              {team?.name}
                          </Box>
                      </Box>
                  </Select.Option>
              ))
            : null;

    return (
        <Select ref={ref} value={value} onChange={val => handleTeamSelect('team', val)} dropdownStyle={{ width: 'auto' }} dropdownMatchSelectWidth={false}>
            <Select.Option value="ALL" style={{ fontWeight: value === 'ALL' ? 400 : 300 }}>
                All Designers' Teams
            </Select.Option>
            {options}
        </Select>
    );
});

export default TeamsField;
