import React, { memo, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Link } from '@components/Link';
import { Skeleton } from '@components/Skeleton';
import { Table } from '@components/Table';
import { Badge } from '@components/Badge';
import IconNoData from '@components/Svg/IconNoData';
import { ALL_CUSTOMERS_BY_USERS } from '@graphql/queries/user';
import CustomerPopupAddUser from './CustomerPopupAddUser.jsx';
import usePopupExportCsv from './usePopupExportCsv.js';
import { ACCOUNT_INFO } from '@constants/routes';

const CustomEmptyTable = () => {
    return (
        <Box $textAlign="center">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No accounts found
            </Text>
        </Box>
    );
};

const CustomersByUsersList = memo(({ filters }) => {
    const [max, setMax] = useState(10);
    const [page, setPage] = useState(1);

    const { loading, data, refetch } = useQuery(ALL_CUSTOMERS_BY_USERS, {
        variables: { ...filters, skip: (page - 1) * max, first: max, orderBy: { ceatedAt: 'Asc' } },
        fetchPolicy: 'network-only',
    });

        useEffect(() => {
            setPage(1)
        }, [filters])

    usePopupExportCsv({
        filter: filters,
        query: ALL_CUSTOMERS_BY_USERS,
        headers: [
            { label: 'ID', dataIndex: 'id' },
            { label: 'Firstname', dataIndex: 'firstname' },
            { label: 'Lastname', dataIndex: 'lastname' },
            { label: 'Email', dataIndex: 'email' },
            { label: 'Last Login', dataIndex: 'lastLogin' },
            { label: 'Company Role', dataIndex: 'companyRole' },
            { label: 'Company ID', dataIndex: 'company.id' },
            { label: 'Company Name', dataIndex: 'company.name' },
            { label: 'Company Plan Name', dataIndex: 'company.subscription.plan.name' },
            { label: 'Company Plan Interval', dataIndex: 'company.subscription.plan.interval' },
            { label: 'Subscription Status', dataIndex: 'company.subscription.status' },
            { label: 'Team Name', render: item => item[0]?.name ?? 'N/A', dataIndex: 'company.teams' },
        ],
        getArrayData: response => response.allCustomersByUsers.data,
        fileName: `customer-users-${new Date().toISOString()}.csv`,
    });

    if (loading || !data?.allCustomersByUsers) {
        return (
            <Box>
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

    const { data: dataSource = [], total: totalUsers } = data.allCustomersByUsers;

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
            title: 'Account',
            dataIndex: 'company',
            key: 'account',
            width: '160.57px',
            render: company => (
                <Text
                    as={Link}
                    to={{
                        pathname: `${ACCOUNT_INFO.replace(':id?', company.id)}`,
                        state: { previousPage: '/customers' },
                    }}
                    $isTruncate
                    $maxW="84"
                    $textVariant="Badge"
                    $colorScheme="cta"
                >
                    {company.name}
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
                    {companyRole === 'ADMIN' ? 'Admin' : 'User'}
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
            title: 'Plan',
            dataIndex: 'company',
            key: 'plan',
            width: '150.62px',
            render: company =>
                company?.subscription?.status !== 'active' || company?.subscription?.willPause ? (
                    <Text $textVariant="P4" $colorScheme="primary">
                        -
                    </Text>
                ) : (
                    <Box>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {company?.subscription?.plan?.name ?? 'N/A'}
                        </Text>
                        <Text $textVariant="P5" $colorScheme="secondary">
                            {capitalize(company?.subscription?.plan?.interval ?? '-')}
                        </Text>
                    </Box>
                ),
        },
        {
            title: 'Team',
            dataIndex: 'company',
            key: 'team',
            width: '100.24px',
            render: company => {
                let teamName = company?.teams && company?.teams?.length > 0 ? company?.teams[0].name : '-';
                if (company?.subscription?.status !== 'active' || company?.subscription?.willPause) {
                    teamName = '-';
                }

                return (
                    <Text $textVariant="P4" $colorScheme="primary">
                        {teamName}
                    </Text>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'company',
            key: 'status',
            width: '138.84px',
            render: (company, { activated }) => {
                return <Badge $variant={activated ? 'UserActive' : 'UserInactive'}>{activated ? 'Active' : 'Inactive'}</Badge>;
            },
        },
    ];

    return (
        <Box>
            <CustomerPopupAddUser refetch={refetch} />

            {totalUsers > 0 && (
                <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                    {totalUsers} user{totalUsers > 1 && 's'}
                </Text>
            )}

            <Box>
                <ConfigProvider renderEmpty={CustomEmptyTable}>
                    <Table
                        isAdminTable
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={row => row.id}
                        pagination={{
                            current: page,
                            onChange: (newPage, pageSize) => {
                                if (page !== newPage) {
                                    setPage(newPage);
                                }
                                if (pageSize !== max) {
                                    setMax(pageSize);
                                }
                            },
                            pageSize: max,
                            total: totalUsers,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                        }}
                    />
                </ConfigProvider>
            </Box>
        </Box>
    );
});

export default CustomersByUsersList;
