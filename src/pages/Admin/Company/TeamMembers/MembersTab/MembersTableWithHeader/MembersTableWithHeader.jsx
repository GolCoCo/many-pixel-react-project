import React, { memo, useEffect, useMemo, useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { useQuery } from '@apollo/client';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { MANAGE_TEAM } from '@constants/routes';
import { Skeleton } from '@components/Skeleton';
import withLoggedUser from '@components/WithLoggedUser';
import MembersTable from '../../../MembersTab/blocks/MembersTable';
import { memberColumns as cols } from '../../../MembersTab/constants';

const teamRoles = {
    teamLeaders: 'Team Leaders',
    designers: 'Designers',
};

const countRoles = {
    teamLeaders: '_teamLeadersCount',
    designers: '_designersCount',
};

const MembersTableWithHeader = memo(({ filters, role, Query, countRefetch }) => {
    const routeMatch = useRouteMatch(MANAGE_TEAM);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const location = useLocation();
    const variables = useMemo(() => {
        const vars = { id: routeMatch.params.id };
        if (filters) {
            vars.where = {
                OR: [
                    { firstname: { contains: filters, mode: 'Insensitive' } },
                    { lastname: { contains: filters, mode: 'Insensitive' } },
                    { email: { contains: filters, mode: 'Insensitive' } },
                ],
            };

            if (filters.toLowerCase() === 'inactive') {
                vars.where = {
                    ...vars.where,
                    archived: true,
                };
            }

            if (filters.toLowerCase() === 'active') {
                vars.where = {
                    ...vars.where,
                    OR: [{ isArchived: false }],
                };
            }
        }

        return {
            ...vars,
            first: pageSize,
            skip: (page - 1) * pageSize,
        };
    }, [filters, pageSize, page, routeMatch.params.id]);

    const { data, loading, refetch } = useQuery(Query, {
        variables,
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (countRefetch > 1) {
            refetch();
        }
    }, [countRefetch, refetch]);

    const team = useMemo(() => data?.Team, [data]);
    const columns = [cols.name(location), cols.email(), cols.lastLogin(), cols.role(), cols.specialities(), cols.status()];

    if (loading) {
        return (
            <Box>
                <Skeleton $w="90" $h="20" $mb="21" />
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

    const count = team[countRoles[role]];

    return (
        <React.Fragment>
            <Box $mt="20">
                {!loading && (
                    <Text $textVariant="H5" $mb="10">
                        {teamRoles[role]}
                    </Text>
                )}
                {!loading && (
                    <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                        {count} member{count > 1 && 's'}
                    </Text>
                )}
                <MembersTable
                    dataSource={team[role]}
                    columns={columns}
                    page={page}
                    totalCount={count}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />
            </Box>
        </React.Fragment>
    );
});

export default withLoggedUser(MembersTableWithHeader);
