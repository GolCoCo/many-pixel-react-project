import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Table } from '@components/Table';
import { Badge } from '@components/Badge';
import IconNoData from '@components/Svg/IconNoData';
import { ConfigProvider } from 'antd';
import moment from 'moment';

const CustomEmptyTable = () => {
    return (
        <Box $textAlign="center">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No users found
            </Text>
        </Box>
    );
};

const UsersTable = ({ dataSource, loading, totalUsers }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'id',
            key: 'name',
            width: '170.54px',
            render: (id, row) => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {row?.firstname} {row?.lastname[0]}
                </Text>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '226.22px',
            render: email => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {email}
                </Text>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'companyRole',
            key: 'role',
            width: '110px',
            render: companyRole => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {companyRole === 'MEMBER' ? 'User' : 'Admin'}
                </Text>
            ),
        },
        {
            title: 'Last login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            width: '141px',
            render: lastLogin => {
                if (lastLogin) {
                    const dateNow = moment().startOf('day');
                    const lastUpdated = moment(lastLogin).startOf('day');
                    const dateDiff = dateNow.diff(lastUpdated, 'days');

                    let formattedLastUpdateDate;
                    switch (dateDiff) {
                        case 0:
                            formattedLastUpdateDate = 'Today';
                            break;
                        case 1:
                            formattedLastUpdateDate = 'Yesterday';
                            break;
                        default:
                            formattedLastUpdateDate = moment(lastLogin).format('D MMM');
                            break;
                    }

                    const formattedTime = moment(lastLogin).format('H: mm');

                    return (
                        <Text $textVariant="P4" $colorScheme="gray">
                            {formattedLastUpdateDate}, {formattedTime}
                        </Text>
                    );
                }

                return (
                    <Text $textVariant="P4" $colorScheme="gray">
                        -
                    </Text>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'activated',
            key: 'status',
            width: '140.57px',
            render: activated => {
                return <Badge $variant={!activated ? 'UserInactive' : 'UserActive'}>{!activated ? 'Inactive' : 'Active'}</Badge>;
            },
        },
    ];

    if (loading) {
        return (
            <Box $mt="30">
                <Skeleton $w="90" $h="20" $mb="10" />
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $px="16" $py="16" $bg="#FAFAFA">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box $mt="20">
            {totalUsers > 0 && (
                <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                    {totalUsers} user{totalUsers > 1 && 's'}
                </Text>
            )}
            <ConfigProvider renderEmpty={CustomEmptyTable}>
                <Table
                    isAdminTable
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={row => row.id}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                    }}
                />
            </ConfigProvider>
        </Box>
    );
};

export default UsersTable;
