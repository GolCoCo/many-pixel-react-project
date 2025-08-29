import React, { useMemo, memo } from 'react';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Col, Row, ConfigProvider } from 'antd';
import { Table } from '@components/Table';
import IconCompany from '@components/Svg/IconCompany';
import { useQuery } from '@apollo/client';
import { GET_TEAMS_PLANNING } from '@graphql/queries/team';
import { Skeleton } from '@components/Skeleton';
import { EmptyData } from '@components/EmptyData';
import { useLocation } from 'react-router-dom';
import Icon, { ContainerOutlined, TeamOutlined } from '@ant-design/icons';
import { generateColumns } from './constants';

const TeamsList = memo(({ filters }) => {
    const location = useLocation();
    const variables = useMemo(() => {
        const vars = { where: { AND: [] } };
        if (filters.team && filters.team !== 'ALL') {
            vars.where.AND.push({
                id: { equals: filters.team },
            });
        }

        if (filters.designer && filters.designer !== 'ALL') {
            vars.where.AND.push({
                designers: {
                    some: {
                        designerId: {
                            equals: filters.designer,
                        },
                    },
                },
            });
        }

        return vars;
    }, [filters]);

    const { data, loading } = useQuery(GET_TEAMS_PLANNING, {
        fetchPolicy: 'network-only',
        variables,
    });

    const teams = useMemo(() => data?.allTeams, [data]);

    const columns = generateColumns({ location });

    if (loading) {
        return (
            <Box>
                <Skeleton $w="90" $h="26" $mb="8" />
                <Box $d="flex" $flexDir="row" $mb="20">
                    <Skeleton $w="24" $h="24" $mr="8" />
                    <Skeleton $w="67" $h="24" $mr="33" />
                    <Skeleton $w="24" $h="24" $mr="8" />
                    <Skeleton $w="67" $h="24" $mr="33" />
                    <Skeleton $w="24" $h="24" $mr="8" />
                    <Skeleton $w="67" $h="24" $mr="33" />
                </Box>
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $d="flex" $flexDir="row">
                        <Box $px="16" $py="16" $bg="#FAFAFA" $h="106" $alignItems="center" $d="flex">
                            <Skeleton $w="128px" $h="18" />
                        </Box>
                        <Box $px="16" $py="16" $bg="#FAFAFA" $w="100%" $h="106" $borderB="1" $borderBottomStyle="solid" $borderBottomColor="other-gray">
                            <Box>
                                <Skeleton $w="100%" $h="18" $mb="32" />
                                <Row gutter={32}>
                                    {Array.from({ length: 6 }, (_, i) => (
                                        <Col key={`skel-${i}`} span={4}>
                                            <Skeleton $w="100%" $h="18" $mb="16" />
                                        </Col>
                                    ))}
                                </Row>
                            </Box>
                        </Box>
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

    if (teams.length === 0) {
        return <EmptyData />;
    }

    return teams.map((team, index) => {
        const totalDailyOutput = team?.companies?.reduce((total, company) => {
            const dailyOutput = company?.subscription?.plan?.dailyOutput;
            return total + dailyOutput;
        }, 0);

        const totalAccounts = team?._companiesCount;
        const totalDesigners = team?._designersCount;

        return (
            <Box key={team.id} $mb={index === teams.length - 1 ? '4' : '30'}>
                <Text $textVariant="H5" $mb="8">
                    {team.name}
                </Text>
                <Box $d="flex" $flexDir="row" $alignItems="center" $mb="20">
                    <Box $colorScheme="secondary" $d="inline-flex" $w="24" $h="24" $alignItems="center" $justifyContent="center">
                        <Icon component={TeamOutlined} tyle={{ fontSize: '18.75px' }} />
                    </Box>
                    <Text $ml="10" $textVariant="Badge" $colorScheme="secondary" $mr="33">
                        {totalDesigners} Designer{totalDesigners > 1 && 's'}
                    </Text>
                    <Box $colorScheme="secondary" $d="inline-flex" $w="24" $h="24" $alignItems="center" $justifyContent="center">
                        <Icon component={ContainerOutlined} style={{ fontSize: '21px' }} />
                    </Box>
                    <Text $ml="10" $textVariant="Badge" $colorScheme="secondary" $mr="33">
                        {totalDailyOutput} Output{totalDailyOutput > 1 && 's'}
                    </Text>
                    <Box $colorScheme="secondary" $d="inline-flex" $w="24" $h="24" $alignItems="center" $justifyContent="center">
                        <Icon component={IconCompany} />
                    </Box>
                    <Text $ml="10" $textVariant="Badge" $colorScheme="secondary">
                        {totalAccounts} Account{totalDailyOutput > 1 && 's'}
                    </Text>
                </Box>
                <Box>
                    <ConfigProvider renderEmpty={EmptyData}>
                        <Table isAdminTable dataSource={team?.designers} columns={columns} pagination={false} rowKey={row => row.id} scroll={{ x: 1300 }} />
                    </ConfigProvider>
                </Box>
            </Box>
        );
    });
});

export default TeamsList;
