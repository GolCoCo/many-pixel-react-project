import React, { useEffect, useMemo, useState } from 'react';
import { Popup } from '@components/Popup';
import { Form } from '@components/Form';
import { Select } from '@components/Select';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import message from '@components/Message';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_USERS } from '@graphql/queries/user';
import { ALL_COMPANY_ACCOUNTS_WITH_OWNER } from '@graphql/queries/company';
import { DESIGNER_JOIN_TEAM, DESIGNER_LEAVE_TEAM, TEAM_LEADER_JOIN_TEAM, TEAM_LEADER_LEAVE_TEAM, DISCONNECT_ASSIGN_COMPANIES } from '@graphql/mutations/user';
import { UPDATE_TEAM } from '@graphql/mutations/team';
import { DELETE_ASSIGNMENT } from '@graphql/mutations/assignment';
import { Image } from '@components/Image';

const EmailAvatarItem = ({ user, isAccount }) => {
    let roleName;
    let specialities;
    if (!isAccount) {
        if (user?.role === 'admin') {
            roleName = 'Administrator';
        } else if (user?.role === 'manager') {
            roleName = 'Team Leader';
        } else if (user?.role === 'worker') {
            roleName = 'Designer';
            specialities = user?.specialities.map(item => item.name) ?? [];
        }
    }

    return (
        <Box $d="flex" $alignItems="center" $py="8" $pl="5">
            <Image src={user?.picture?.url} size={40} $fontSize="14" isRounded name={`${user?.firstname ?? ''} ${user?.lastname ?? ''}`} />
            <Box $pl="8">
                <Text $textVariant="P4">
                    {user.firstname} {user.lastname}
                </Text>
                <Text $textVariant="P5" $colorScheme="secondary">
                    {user.email}
                </Text>
                {!isAccount && (
                    <Box $d="flex" $flexDir="row">
                        <Text $textVariant="P5" $colorScheme="secondary">
                            {roleName}
                            {specialities?.length > 0 && ' - '}
                            {specialities?.join(', ')}
                        </Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const getUserTeam = user => {
    if (user.role === 'manager' && user.teamLeadersTeams.length) {
        return user.teamLeadersTeams[0].id;
    }
    if (user.role === 'worker' && user.designerTeams.length) {
        return user.designerTeams[0].id;
    }
};

const AddUserToTeamPopup = ({ visible, onCloseModal, refetchSource, team, isAccount }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { validateFields } = form;
    const [teamLeaderJoinTeam] = useMutation(TEAM_LEADER_JOIN_TEAM);
    const [teamLeaderLeaveTeam] = useMutation(TEAM_LEADER_LEAVE_TEAM);
    const [designerJoinTeam] = useMutation(DESIGNER_JOIN_TEAM);
    const [designerLeaveTeam] = useMutation(DESIGNER_LEAVE_TEAM);
    const [updateTeam] = useMutation(UPDATE_TEAM);
    const [disconnectAssignCompanies] = useMutation(DISCONNECT_ASSIGN_COMPANIES);
    const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);

    const variables = useMemo(() => {
        if (!isAccount) {
            return {
                where: {
                    role: {
                        in: ['manager', 'worker'],
                    },
                    teamLeadersTeams: {
                        none: {
                            teamId: {
                                equals: team.id,
                            },
                        },
                    },
                    designerTeams: {
                        none: {
                            teamId: {
                                equals: team.id,
                            },
                        },
                    },
                },
            };
        }
        return {
            teamId: team.id,
        };
    }, [isAccount, team]);

    const Query = useMemo(() => {
        return isAccount ? ALL_COMPANY_ACCOUNTS_WITH_OWNER : ALL_USERS;
    }, [isAccount]);

    const { loading: isFetchLoading, data, refetch } = useQuery(Query, { variables, fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true });

    useEffect(() => {
        if (visible) {
            refetch();
        }
    }, [visible, refetch]);

    const [options, cacheOptions] = useMemo(() => {
        const optionsData = isAccount
            ? data?.allCompanies?.map(company => {
                  const accountOwnerCompany = company.users.find(user => user.role === 'customer' && user.companyRole === 'ADMIN');

                  return {
                      id: company.id,
                      email: accountOwnerCompany?.email,
                      firstname: company.name,
                      lastname: '',
                      picture: {
                          url: company.logo?.url || null,
                      },
                      teams: company.teams,
                      assignedDesigners: company.assignedDesigners,
                  };
              }) ?? []
            : data?.allUsers ?? [];

        const cache = optionsData.reduce((prev, value) => {
            return {
                ...prev,
                [value.id]: value,
            };
        }, {});

        return [optionsData, cache];
    }, [data, isAccount]);

    const handleSubmit = () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                message.loading('Adding members...');

                try {
                    if (isAccount) {
                        const ids = values.members.map(company => ({ id: company }));
                        // Disconnect other team first
                        await Promise.all(
                            ids.map(item => {
                                const foundCompany = options.find(opt => opt.id === item.id);

                                if (foundCompany) {
                                    const foundTeam = foundCompany.teams[0];

                                    if (foundTeam) {
                                        updateTeam({
                                            variables: {
                                                data: {
                                                    companies: {
                                                        delete: [{ companyId_teamId: { companyId: item.id, teamId: foundTeam.id } }],
                                                    },
                                                },
                                                where: {
                                                    id: foundTeam.id,
                                                },
                                            },
                                        });

                                        if (foundCompany?.assignedDesigners?.length > 0) {
                                            Promise.all(
                                                foundCompany?.assignedDesigners?.map(ad =>
                                                    deleteAssignment({
                                                        variables: {
                                                            id: ad.id,
                                                        },
                                                    })
                                                )
                                            );
                                        }

                                        return true;
                                    }
                                }
                                return Promise.resolve();
                            })
                        );

                        // Connect company in team
                        await updateTeam({
                            variables: {
                                data: {
                                    companies: {
                                        create: ids.map(item => ({ companyId: item.id })),
                                    },
                                },
                                where: {
                                    id: team.id,
                                },
                            },
                        });
                    } else {
                        for (let i = 0; i < values.members.length; i += 1) {
                            const userId = values.members[i];
                            const userInfo = cacheOptions[userId];
                            const previousTeamId = getUserTeam(userInfo);

                            if (userInfo.role === 'manager') {
                                if (previousTeamId) {
                                    await teamLeaderLeaveTeam({
                                        variables: {
                                            id: userInfo.id,
                                            teamId: previousTeamId,
                                        },
                                    });
                                }
                                await teamLeaderJoinTeam({
                                    variables: {
                                        id: userInfo.id,
                                        teamId: team.id,
                                    },
                                });
                            }
                            if (userInfo.role === 'worker') {
                                if (previousTeamId) {
                                    await designerLeaveTeam({
                                        variables: {
                                            id: userInfo.id,
                                            teamId: previousTeamId,
                                        },
                                    });

                                    await disconnectAssignCompanies({
                                        variables: {
                                            assignedCompaniesIds: userInfo.assignedCustomers.map(ac => ({ id: ac.id })),
                                            id: userInfo.id,
                                        },
                                    });
                                }
                                await designerJoinTeam({
                                    variables: {
                                        id: userInfo.id,
                                        teamId: team.id,
                                    },
                                });
                            }
                        }
                    }

                    message.destroy();
                    message.success(`${isAccount ? 'Account' : 'Member'} successfuly added to the team`);
                    setIsLoading(false);
                    onCloseModal();
                    refetch();
                    refetchSource();
                    form.resetFields(['members']);
                    return true;
                } catch (error) {
                    message.destroy();
                    setIsLoading(false);
                    console.log(error);
                    return false;
                }
            }
        });
    };

    const handleFilterUser = (input, option) => {
        const lowercasedInput = input?.toLowerCase() || '';
        return option.props.title?.toLowerCase().indexOf(lowercasedInput) >= 0 || option.props.label?.toLowerCase().indexOf(lowercasedInput) >= 0;
    };

    return (
        <Popup
            $variant="default"
            width={500}
            open={visible}
            onCancel={onCloseModal}
            footer={null}
            destroyOnClose
            title={`Add ${isAccount ? 'account' : 'member'} to the team`}
        >
            <Form onFinish={handleSubmit} form={form} name="addUserTeamPopupForm" initialValues={{ members: [] }}>
                <Form.Item rules={[{ required: true, message: 'Please select member at least one' }]} name="members" label="Email" colon={false} required={false}>
                    <Select loading={isFetchLoading} placeholder="user@example.com" mode="multiple" optionLabelProp="label" filterOption={handleFilterUser}>
                        {options?.map(item => (
                            <Select.Option
                                key={item?.id}
                                value={item?.id}
                                style={{ height: 'auto' }}
                                label={item.email}
                                title={`${item?.firstname ?? ''} ${item?.lastname ?? ''}`}
                            >
                                <EmailAvatarItem user={item} isAccount={isAccount} />
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Add
                    </Button>
                </Box>
            </Form>
        </Popup>
    );
};

export default AddUserToTeamPopup;
