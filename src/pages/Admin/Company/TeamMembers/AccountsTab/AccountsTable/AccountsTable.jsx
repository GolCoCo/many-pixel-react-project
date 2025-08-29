import React, { useState, useMemo, useCallback } from 'react';
import { ConfigProvider } from 'antd';
import { Table } from '@components/Table';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import { GET_TEAM_ACCOUNTS } from '@graphql/queries/team';
import { useQuery, useMutation } from '@apollo/client';
import { useRouteMatch } from 'react-router-dom';
import { MANAGE_TEAM } from '@constants/routes';
import { USER_TYPE_OWNER, USER_TYPE_MANAGER } from '@constants/account';
import { CustomIconDelete } from '@components/Svg/IconDelete';
import { COLOR_OTHERS_RED } from '@components/Theme/color';
import { PopupDelete } from '@components/Popup';
import { REMOVE_ACCOUNT_FROM_TEAM } from '@graphql/mutations/company';
import { DELETE_ASSIGNMENT } from '@graphql/mutations/assignment';
import message from '@components/Message';
import withLoggedUser from '@components/WithLoggedUser';
import _ from 'lodash';
import { EmptyData } from '@components/EmptyData';
import AddUserToTeamPopup from '../../MembersTab/blocks/AddUserToTeamPopup';
import TeamPopup from '../../../TeamsTab/blocks/TeamPopup';
import { columns as cols } from './constants';

const AccountsTable = ({ filters, viewer, team, isAddVisible, isEditVisible, onAddClose, onEditClose }) => {
    const routeMatch = useRouteMatch(MANAGE_TEAM);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState({});
    const variables = useMemo(() => {
        const vars = { id: routeMatch.params.id, where: { AND: [] } };
        if (filters.search) {
            vars.where.AND.push({
                OR: [
                    {
                        users: {
                            some: {
                                OR: [
                                    { firstname: { contains: filters.search, mode: 'Insensitive' } },
                                    { lastname: { contains: filters.search, mode: 'Insensitive' } },
                                    { email: { contains: filters.search, mode: 'Insensitive' } },
                                ],
                            },
                        },
                    },
                    {
                        name: { contains: filters.search, mode: 'Insensitive' },
                    },
                ],
            });
        }
        if (filters.status && filters.status !== 'ALL') {
            vars.where.AND.push({
                subscription: {
                    status: _.toLower(filters.status),
                },
            });
        }

        return {
            ...vars,
            first: pageSize,
            skip: (page - 1) * pageSize,
        };
    }, [filters, pageSize, page, routeMatch.params.id]);

    const { data, loading, refetch } = useQuery(GET_TEAM_ACCOUNTS, {
        variables,
        fetchPolicy: 'network-only',
    });

    const [removeTeam] = useMutation(REMOVE_ACCOUNT_FROM_TEAM);
    const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);
    const handleDeleteAccount = useCallback(async () => {
        try {
            setIsDeleting(true);
            await removeTeam({
                variables: {
                    teamId: routeMatch.params.id,
                    id: accountToDelete.id,
                },
            });
            const [companyToDelete] = data?.Team?.companies?.filter(company => company.id === accountToDelete.id);
            if (companyToDelete?.assignedDesigners?.length > 0) {
                await Promise.all(
                    companyToDelete?.assignedDesigners?.map(
                        async ad =>
                            await deleteAssignment({
                                variables: {
                                    id: ad.id,
                                },
                            })
                    )
                );
            }
            await refetch();
            message.success('Account has been removed');
            setIsDeleting(false);
            setShowDelete(false);
        } catch (err) {
            console.error(err);
        }
    }, [removeTeam, routeMatch.params.id, accountToDelete, refetch, data, deleteAssignment]);

    const handleShowDelete = acc => {
        setShowDelete(true);
        setAccountToDelete(acc);
    };

    const isManagerOrOwner = viewer?.role === USER_TYPE_MANAGER || viewer?.role === USER_TYPE_OWNER;

    const actions = isManagerOrOwner
        ? [
              {
                  handleClick: handleShowDelete,
                  label: 'Delete',
                  icon: <CustomIconDelete style={{ color: COLOR_OTHERS_RED }} />,
              },
          ]
        : [];

    const columns = [cols.name(team.id), cols.email(), cols.creationDate(), cols.plan(), cols.designers(), cols.status(), cols.actions(actions)];
    const teamName = useMemo(() => data?.Team.name, [data]);
    const companies = useMemo(() => data?.Team?.companies, [data]);
    const totalCompanies = useMemo(() => data?.Team?._companiesCount, [data]);

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

    return (
        <Box>
            <AddUserToTeamPopup visible={isAddVisible} onCloseModal={onAddClose} refetchSource={refetch} team={team} isAccount />
            <TeamPopup
                visible={isEditVisible}
                onCloseModal={onEditClose}
                refetch={refetch}
                initialData={{
                    id: team.id,
                    name: team.name,
                }}
            />
            <Text $textVariant="Badge" $colorScheme="primary" $mb="21">
                {totalCompanies ?? 0} account{totalCompanies > 1 && 's'}
            </Text>
            <ConfigProvider renderEmpty={EmptyData}>
                <Table
                    columns={columns}
                    isAdminTable
                    rowKey={row => row.id}
                    dataSource={companies}
                    pagination={{
                        total: totalCompanies,
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
            <PopupDelete
                title={`Are you sure you want to remove this account from the ${teamName} Team?`}
                $variant="delete"
                open={showDelete}
                onOk={handleDeleteAccount}
                onCancel={() => setShowDelete(false)}
                confirmLoading={isDeleting}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </Box>
    );
};

export default withLoggedUser(AccountsTable);
