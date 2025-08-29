import React, { useState } from 'react';
import includes from 'lodash/includes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import Table from './Table';
import Filters from './Filters';

const UsersTab = ({ company, loading }) => {
    const [dataSource, setDataSource] = useState(company?.users);
    const totalUsers = dataSource?.length;

    const onChangeFilters = val => {
        if (val?.user) {
            setDataSource(
                company?.users?.filter(
                    data => includes(data.firstname.toLowerCase(), val.user.toLowerCase()) || includes(data.lastname.toLowerCase(), val.user.toLowerCase())
                )
            );
        } else {
            setDataSource(company?.users);
        }
    };

    return (
        <Box $mt="30">
            <Text $textVariant="H5">Users</Text>
            <Filters onChangeFilters={onChangeFilters} />
            <Table dataSource={dataSource} loading={loading} totalUsers={totalUsers} />
        </Box>
    );
};

export default UsersTab;
