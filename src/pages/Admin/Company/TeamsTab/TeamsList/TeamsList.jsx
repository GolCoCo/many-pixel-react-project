import React, { memo, useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import { GET_TEAMS } from '@graphql/queries/team';
import { Link } from '@components/Link';
import { ConfigProvider } from 'antd';
import TeamPopup from '../blocks/TeamPopup';
import { EmptyData } from '@components/EmptyData';
import { MEMBER_INFO } from '@constants/routes';
import { useLocation } from 'react-router-dom';

const TeamsList = memo(({ search, isAddVisible, onAddClose }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const location = useLocation();
    const variables = useMemo(() => {
        const vars = {
            first: pageSize,
            orderBy: { createdAt: 'Asc' },
            skip: page ? (page - 1) * pageSize : 0,
        };
        vars.where = { AND: [] };
        if (search) {
            vars.where.AND.push({
                OR: [
                    { name: { contains: search } },
                    {
                        customers: {
                            some: {
                                customer: {
                                    OR: [{ firstname: { contains: search, mode: 'Insensitive' } }, { lastname: { contains: search, mode: 'Insensitive' } }],
                                },
                            },
                        },
                    },
                    {
                        designers: {
                            some: {
                                designer: {
                                    OR: [{ firstname: { contains: search, mode: 'Insensitive' } }, { lastname: { contains: search, mode: 'Insensitive' } }],
                                },
                            },
                        },
                    },
                    {
                        teamLeaders: {
                            some: {
                                teamLeader: {
                                    OR: [{ firstname: { contains: search, mode: 'Insensitive' } }, { lastname: { contains: search, mode: 'Insensitive' } }],
                                },
                            },
                        },
                    },
                ],
            });
        }
        return vars;
    }, [pageSize, page, search]);

    const { loading, data, refetch } = useQuery(GET_TEAMS, {
        variables,
        fetchPolicy: 'network-only',
    });

    const teams = useMemo(() => data?.allTeams, [data]);
    const totalTeams = useMemo(() => data?._allTeamsCount, [data]);

    const renderName = useCallback(
        (name, record) => (
            <Text as={Link} to={`/company/teams/${record.id}?tab=members`} $textVariant="Badge" $colorScheme="cta">
                {name}
            </Text>
        ),
        []
    );
    const renderDesigners = useCallback(
        users => (
            <>
                {users.length > 1 && `${users.length} Designers`}
                <Box>
                    {users.map((user, key) => (
                        <React.Fragment key={key}>
                            {key !== 0 && <span>, </span>}
                            <Text
                                as={Link}
                                to={{
                                    pathname: MEMBER_INFO.replace(':id', user.id),
                                    state: { previousPage: location.pathname },
                                }}
                                key={user.id}
                                $fontSize="14"
                                $textVariant="Badge"
                                $colorScheme="cta"
                            >
                                {`${user.firstname} ${user.lastname}`}
                            </Text>
                        </React.Fragment>
                    ))}
                </Box>
            </>
        ),
        [location.pathname]
    );

    const renderUsers = useCallback(
        users =>
            users?.map((user, key) => (
                <React.Fragment key={key}>
                    {key !== 0 && <span>, </span>}
                    <Text
                        as={Link}
                        to={{
                            pathname: MEMBER_INFO.replace(':id', user.id),
                            state: { previousPage: location.pathname },
                        }}
                        key={user.id}
                        $textVariant="Badge"
                        $colorScheme="cta"
                    >
                        {`${user.firstname} ${user.lastname}`}
                    </Text>
                </React.Fragment>
            )),
        [location.pathname]
    );

    const renderCount = useCallback(
        array => (
            <Box $d="flex" $alignItems="center">
                <Text>{array?.length ?? 0}</Text>
            </Box>
        ),
        []
    );

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: renderName,
        },
        {
            title: '# of accounts',
            dataIndex: 'companies',
            key: 'companies',
            render: renderCount,
        },
        {
            // This one haven't implemented from backend
            title: '# of outputs',
            dataIndex: 'outputs',
            key: 'outputs',
            render: renderCount,
        },
        {
            title: 'Team Leader',
            dataIndex: 'teamLeaders',
            key: 'teamLeaders',
            render: renderUsers,
        },
        {
            // This one haven't implemented from backend
            title: 'QC',
            dataIndex: 'qualityControls',
            key: 'qualityControls',
            render: renderUsers,
        },
        {
            title: 'Designers',
            dataIndex: 'designers',
            key: 'designers',
            render: renderDesigners,
        },
    ];

    if (loading) {
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

    return (
        <Box>
            <TeamPopup visible={isAddVisible} onCloseModal={onAddClose} refetch={refetch} />
            {totalTeams > 0 && (
                <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                    {totalTeams} team{totalTeams > 1 && 's'}
                </Text>
            )}
            <Box>
                <ConfigProvider renderEmpty={EmptyData}>
                    <Table
                        isAdminTable
                        columns={columns}
                        dataSource={teams}
                        rowKey={row => row.id}
                        pagination={{
                            total: totalTeams,
                            pageSize,
                            onShowSizeChange: (current, choice) => setPageSize(choice),
                            current: page,
                            onChange: newPage => setPage(newPage),
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                        }}
                    />
                </ConfigProvider>
            </Box>
        </Box>
    );
});

export default TeamsList;
