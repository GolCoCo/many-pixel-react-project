import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import numeral from 'numeral';
import { ConfigProvider } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Table } from '@components/Table';
import IconEdit from '@components/Svg/IconEdit';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { EDIT_PLAN_SETTING, PLAN_DETAILS } from '@constants/routes';
import { ALL_PLANS } from '@graphql/queries/plan';
import { EmptyData } from '@components/EmptyData';

function stringEquals(a, b) {
    return a === b;
}

function intervalAbbr(intrvl) {
    let abbr = '';

    switch (intrvl) {
        case 'MONTHLY':
            abbr = 'm';
            break;
        case 'QUARTERLY':
            abbr = 'qtr';
            break;
        case 'BIANNUALLY':
            abbr = 'bn';
            break;
        case 'YEARLY':
            abbr = 'yr';
            break;
        default:
            break;
    }

    return abbr;
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, row) => (
            <Box>
                <Text as={Link} to={PLAN_DETAILS.replace(':id', row.id)} $textVariant="Badge" $colorScheme="cta">
                    {name}
                </Text>
                {row.visible && (
                    <Text $textVariant="P5" $colorScheme="primary">
                        Visible
                    </Text>
                )}
            </Box>
        ),
    },
    {
        title: 'Interval',
        dataIndex: 'interval',
        key: 'interval',
        render: interval => (
            <Text $textVariant="P4" $colorScheme="gray" $textTransform="uppercase">
                {interval}
            </Text>
        ),
    },
    {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateObj = new Date(createdAt);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();

            return (
                <Text $textVariant="P4" $colorScheme="primary">
                    {day} {month} {year}
                </Text>
            );
        },
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price, row) => (
            <Text $textVariant="P4" $colorScheme="primary">
                {numeral(price).format('$0,0[.]00')}/{intervalAbbr(row.interval)}
            </Text>
        ),
    },
    {
        title: 'Active subs',
        dataIndex: '_customerSubscriptionsCount',
        key: '_customerSubscriptionsCount',
        render: _customerSubscriptionsCount => (
            <Text $textVariant="P4" $colorScheme="gray">
                {_customerSubscriptionsCount}
            </Text>
        ),
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (data, row) => (
            <Box as={Link} to={EDIT_PLAN_SETTING.replace(':id', row.id)} $d="flex" $alignItems="center">
                <Text $colorScheme="cta" $mt="4" $mr="8">
                    <IconEdit width="18" height="18" />
                </Text>
                <Text $textVariant="Badge" $colorScheme="cta">
                    Edit
                </Text>
            </Box>
        ),
    },
];

const Plans = () => {
    const { loading: activePlansLoading, data: activePlansData } = useQuery(ALL_PLANS, {
        variables: { activated: true },
        fetchPolicy: 'network-only',
    });
    const { loading: inactivePlansLoading, data: inactivePlansData } = useQuery(ALL_PLANS, {
        variables: { activated: false },
        fetchPolicy: 'network-only',
    });
    const [activeFilter, setActiveFilter] = useState('ACTIVE');
    const [dataSource, setDataSource] = useState(null);
    const loading = activeFilter === 'ACTIVE' ? activePlansLoading : inactivePlansLoading;
    const data = activeFilter === 'ACTIVE' ? activePlansData : inactivePlansData;

    useEffect(() => {
        if (!loading) {
            setDataSource(data?.allPlans);
        }
    }, [loading, data]);

    if (loading) {
        return (
            <Box>
                <Box $d="flex" $alignItems="center" $my="30">
                    <Skeleton $w="45" $h="20" $mr="20" />
                    <Box $d="flex" $alignItems="center">
                        <Skeleton $w="88" $h="34" $mr="10" />
                        <Skeleton $w="88" $h="34" />
                    </Box>
                </Box>
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

    const handleChangeStatus = async selectedStatus => {
        setActiveFilter(selectedStatus);
    };

    return (
        <Box>
            <Box $d="flex" $alignItems="center" $my="30">
                <Text $textVariant="H6" $colorScheme="primary" $mr="20">
                    Status
                </Text>
                <Box $d="flex" $alignItems="center">
                    <Button
                        $mr="10"
                        noColorTransitions
                        type={stringEquals(activeFilter, 'ACTIVE') ? 'primary' : 'default'}
                        isBadge={true}
                        iscapitalized="true"
                        onClick={() => handleChangeStatus('ACTIVE')}
                    >
                        Active
                    </Button>
                    <Button
                        $mr="10"
                        noColorTransitions
                        type={stringEquals(activeFilter, 'INACTIVE') ? 'primary' : 'default'}
                        isBadge={true}
                        iscapitalized="true"
                        onClick={() => handleChangeStatus('INACTIVE')}
                    >
                        Inactive
                    </Button>
                </Box>
            </Box>
            <Box $pos="relative">
                <ConfigProvider renderEmpty={EmptyData}>
                    <Table
                        bordered
                        isAdminTable
                        paginated
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
                {dataSource?.length > 0 && (
                    <Text $pos="absolute" $bottom="30" $left="0" $textVariant="Badge" $colorScheme="primary">
                        Total {dataSource?.length} plans
                    </Text>
                )}
            </Box>
        </Box>
    );
};

export default Plans;
