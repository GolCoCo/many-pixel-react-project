import React, { memo, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { Table } from '@components/Table';
import { Badge } from '@components/Badge';
import IconNoData from '@components/Svg/IconNoData';
import { ALL_CUSTOMERS_BY_COMPANIES } from '@graphql/queries/company';
import { ACCOUNT_INFO } from '@constants/routes';
import StatusColoredText from '@components/Text/StatusColoredText';
import CustomerPopupAddAccount from './CustomerPopupAddAccount.jsx';
import usePopupExportCsv from './usePopupExportCsv.js';

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

const CustomersByAccountsList = memo(({ filters }) => {
    const [max, setMax] = useState(10);
    const [page, setPage] = useState(1);

    const { loading, data, refetch } = useQuery(ALL_CUSTOMERS_BY_COMPANIES, {
        variables: { ...filters, skip: (page - 1) * max, first: max },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        setPage(1)
    }, [filters])

    usePopupExportCsv({
        filter: filters,
        query: ALL_CUSTOMERS_BY_COMPANIES,
        headers: [
            { label: 'ID', dataIndex: 'id' },
            { label: 'Name', dataIndex: 'name' },
            { label: 'Email', dataIndex: 'subscription.user.email' },
            { label: 'Created At', dataIndex: 'createdAt' },
            { label: 'Subscription Status', dataIndex: 'subscription.status' },
            { label: 'Subscription Plan Name', dataIndex: 'subscription.plan.name' },
            {
                label: 'Subscription Plan Interval',
                dataIndex: 'subscription.plan.interval',
            },
            {
                label: 'Team Name',
                render: item => item[0]?.name ?? 'N/A',
                dataIndex: 'teams',
            },
            {
                label: 'Assigned Designers',
                render: item =>
                    Array.isArray(item)
                        ? item?.reduce(
                              (prev, current, index) =>
                                  `${prev + current.designer.firstname} ${current.designer.lastname[0]}${index === item.length - 1 ? '' : ' - '}`,
                              ''
                          ) ?? '-'
                        : '-',
                dataIndex: 'assignedDesigners',
            },
        ],
        getArrayData: response => response.allCustomersByCompanies.data,
        fileName: `customer-accounts-${new Date().toISOString()}.csv`,
    });

    if (loading || !data?.allCustomersByCompanies) {
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

    const { data: dataSource = [], total: totalAccounts } = data.allCustomersByCompanies;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '180.54px',
            render: (name, row) => (
                <Text
                    as={Link}
                    to={{
                        pathname: `${ACCOUNT_INFO.replace(':id?', row.id)}`,
                        state: { previousPage: '/customers' },
                    }}
                    $isTruncate
                    $maxW="84"
                    $textVariant="Badge"
                    $colorScheme="cta"
                >
                    {name}
                </Text>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'subscription',
            key: 'subscription',
            width: '220.22px',
            render: (subscription, company) => {
                if (subscription?.user?.email) {
                    return (
                        <Text $textVariant="P4" $colorScheme="primary">
                            {subscription.user.email}
                        </Text>
                    );
                }
                const user = company.users[0];
                if (user) {
                    return (
                        <Text $textVariant="P4" $colorScheme="primary">
                            {user.email}
                        </Text>
                    );
                }
            },
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '141px',
            render: createdAt => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {moment(createdAt).format('DD MMM YYYY')}
                </Text>
            ),
        },
        {
            title: 'Plan',
            dataIndex: 'subscription',
            key: 'plan',
            width: '190.62px',
            render: subscription => {
                const status = subscription?.status;

                return (
                    <Box>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {<StatusColoredText status={status}>{subscription?.plan?.name}</StatusColoredText> ?? 'N/A'}
                        </Text>

                        <Text $textVariant="P5" $colorScheme="secondary">
                            {capitalize(subscription?.plan?.interval ?? '-')}
                        </Text>
                    </Box>
                );
            },
        },
        {
            title: 'Team',
            dataIndex: 'teams',
            key: 'team',
            width: '100.24px',
            render: (teams, row) => (
                <Text $textVariant="P4" $colorScheme="gray">
                    {teams[0]?.name ?? 'N/A'}
                </Text>
            ),
        },
        {
            title: 'Designer(s)',
            dataIndex: 'assignedDesigners',
            key: 'designers',
            width: '226.57px',
            render: (assignedDesigners, row) => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {assignedDesigners && assignedDesigners?.length > 0
                        ? assignedDesigners?.map(
                              (assigned, index) =>
                                  `${assigned.designer.firstname} ${assigned.designer.lastname[0]}${index !== assignedDesigners?.length - 1 ? ', ' : ''}`
                          )
                        : '-'}
                </Text>
            ),
        },
        {
            title: 'Subscription',
            dataIndex: 'subscription',
            key: 'status',
            width: '138.84px',
            render: subscription => {
                const status = subscription?.status;

                if (!status) return '-';

                if (status === 'paused') {
                    return <Badge $variant="BillingPaused">Paused</Badge>;
                }

                let badgeText;

                switch (status) {
                    case 'inactive':
                        badgeText = 'Inactive';
                        break;
                    case 'active':
                        badgeText = 'Active';
                        break;
                    default:
                        return '-';
                }

                return <Badge $variant={badgeText === 'Active' ? 'BillingActive' : 'SubscriptionInactive'}>{badgeText}</Badge>;
            },
        },
    ];

    return (
        <Box>
            <CustomerPopupAddAccount refetch={refetch} />

            {totalAccounts > 0 && (
                <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                    {totalAccounts} account{totalAccounts > 1 && 's'}
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

                                if (max !== pageSize) {
                                    setMax(pageSize);
                                }
                            },
                            pageSize: max,
                            total: totalAccounts,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                        }}
                    />
                </ConfigProvider>
            </Box>
        </Box>
    );
});

export default CustomersByAccountsList;
