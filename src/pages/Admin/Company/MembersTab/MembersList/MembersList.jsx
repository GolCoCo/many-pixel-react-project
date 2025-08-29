import React, { memo, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { ALL_MEMBERS } from '@graphql/queries/user';
import { TEAM } from '@constants/utils';
import IconEdit from '@components/Svg/IconEdit';
import WithLoggedUser from '@components/WithLoggedUser';
import { useLocation } from 'react-router-dom';
import EditUserPopup from '../blocks/EditUserPopup';
import MembersTable from '../blocks/MembersTable';
import { memberColumns } from '../constants';
import AddUserPopup from '../blocks/AddUserPopup';

const MembersList = memo(({ viewer, filters, isAddVisible, onAddClose, order, onOrder = () => {} }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showEditModal, setShowEditModal] = useState(false);
    const [user, setUser] = useState();
    const location = useLocation();

    const handleEditUser = useCallback(record => {
        setUser(record);
        setShowEditModal(true);
    }, []);

    const { field: columnKey, order: orderDirection } = order;

    const variableOrder = useMemo(() => {
        if (orderDirection === 'ascend') {
            return { [columnKey]: 'Asc' };
        }

        if (orderDirection === 'descend') {
            return { [columnKey]: 'Desc' };
        }

        return undefined;
    }, [columnKey, orderDirection]);

    const variables = {
        where: {
            role: {
                in: filters.role === 'ALL' ? TEAM : filters.role,
            },
            AND: [
                {
                    OR: [
                        { firstname: { contains: filters.keyword, mode: 'Insensitive' } },
                        { lastname: { contains: filters.keyword, mode: 'Insensitive' } },
                        { email: { contains: filters.keyword, mode: 'Insensitive' } },
                    ],
                },
                filters.team === 'ALL'
                    ? {}
                    : {
                          OR: [
                              {
                                  designerTeams: {
                                      some: {
                                          teamId: {
                                              in: filters.team,
                                          },
                                      },
                                  },
                              },
                              {
                                  teamLeadersTeams: {
                                      some: {
                                          teamId: {
                                              in: filters.team,
                                          },
                                      },
                                  },
                              },
                          ],
                      },
                filters.designType === 'ALL'
                    ? {}
                    : {
                          AND: [
                              {
                                  specialities: {
                                      some: {
                                          designTypeId: {
                                              equals: filters.designType,
                                          },
                                      },
                                  },
                              },
                          ],
                      },
                filters.status === 'ALL' ? {} : { isArchived: filters.status === 'INACTIVE' },
            ],
        },
        first: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: variableOrder,
    };

    const { loading, data, refetch } = useQuery(ALL_MEMBERS, {
        variables,
        fetchPolicy: 'network-only',
    });

    const { pathname } = location;

    const columns = useMemo(() => {
        const actions = [
            {
                handleClick: handleEditUser,
                label: 'Edit',
                icon: <IconEdit />,
            },
        ];

        const newColumns = [
            memberColumns.name(pathname),
            memberColumns.email(),
            memberColumns.lastLogin(),
            memberColumns.team(),
            memberColumns.role(),
            memberColumns.specialities(),
            memberColumns.status(),
            memberColumns.actions(actions),
        ].map(params => {
            const { key } = params;

            const sortOrder = columnKey === key ? orderDirection : false;

            return {
                ...params,
                sortOrder,
            };
        });

        return newColumns;
    }, [columnKey, handleEditUser, orderDirection, pathname]);

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

    const dataSource = data?.allUsersForAdmin;

    const totalUsers = data?._allUsersCount;

    return (
        <Box>
            <AddUserPopup
                visible={isAddVisible}
                onCloseModal={onAddClose}
                refetchUsers={refetch}
                companyId={viewer?.company?.id}
            />
            {totalUsers > 0 && (
                <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                    {totalUsers} member{totalUsers > 1 && 's'}
                </Text>
            )}

            <MembersTable
                onChange={(
                    _,
                    __,
                    /**
                     * @type {{columnKey: string, field: string, order?: 'ascend' | 'descend'}}
                     */
                    { columnKey: columnKeyParam, order: orderParam }
                ) => {
                    onOrder({ field: columnKeyParam, order: orderParam });
                }}
                columns={columns}
                dataSource={dataSource}
                setPageSize={setPageSize}
                setPage={(newPage, newPageSize) => {
                    if (page !== newPage) {
                        setPage(newPage);
                    }

                    if (pageSize !== newPageSize) {
                        setPageSize(newPageSize);
                    }
                }}
                page={page}
                totalCount={totalUsers}
                pageSize={pageSize}
            />

            <EditUserPopup
                visible={showEditModal}
                user={user}
                onCloseModal={() => setShowEditModal(false)}
                refetchUsers={refetch}
            />
        </Box>
    );
});

export default WithLoggedUser(MembersList);
