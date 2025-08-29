import React, { memo, useCallback, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Switch } from 'antd';
import includes from 'lodash/includes';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import { Image } from '@components/Image';
import { GET_ALL_TEAMS } from '@graphql/queries/team';
import { isEqual, toArray } from 'lodash';
import message from '@components/Message';
import { Text } from '@components/Text';
import {
    CHANGE_USER_ROLE,
    DESIGNER_JOIN_TEAM,
    DESIGNER_LEAVE_TEAM,
    TEAM_LEADER_JOIN_TEAM,
    TEAM_LEADER_LEAVE_TEAM,
    SET_USER_ARCHIVED,
    UPDATE_USER_DESIGN_TYPE,
    DISCONNECT_USER_DESIGN_TYPE,
    DISCONNECT_ASSIGN_ORDERS,
    DISCONNECT_ASSIGN_COMPANIES,
} from '@graphql/mutations/user';
import TeamField from '@pages/Admin/Company/MembersTab/blocks/TeamField';
import RoleField from '../RoleField';
import DesignTypeField from '../DesignTypeField';

const getUserTeam = user => {
    if (user?.role === 'manager' && user?.teamLeadersTeams?.length > 0) {
        return user.teamLeadersTeams.map(t => t.id);
    }
    if (user?.role === 'worker' && user?.designerTeams?.length > 0) {
        return user.designerTeams.map(t => t.id);
    }
    return [];
};
const EditUserPopup = memo(({ visible, onCloseModal, user, refetchUsers }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const { data } = useQuery(GET_ALL_TEAMS, {
        fetchPolicy: 'network-only',
    });
    const [teamLeaderLeaveTeam] = useMutation(TEAM_LEADER_LEAVE_TEAM);
    const [teamLeaderJoinTeam] = useMutation(TEAM_LEADER_JOIN_TEAM);
    const [designerLeaveTeam] = useMutation(DESIGNER_LEAVE_TEAM);
    const [designerJoinTeam] = useMutation(DESIGNER_JOIN_TEAM);
    const [changeRole] = useMutation(CHANGE_USER_ROLE);
    const [setUserArchived] = useMutation(SET_USER_ARCHIVED);
    const [updateUserSpecialities] = useMutation(UPDATE_USER_DESIGN_TYPE);
    const [disconnectUserSpecialities] = useMutation(DISCONNECT_USER_DESIGN_TYPE);
    const [disconnectAssignOrders] = useMutation(DISCONNECT_ASSIGN_ORDERS);
    const [disconnectAssignCompanies] = useMutation(DISCONNECT_ASSIGN_COMPANIES);
    const [isLoading, setIsLoading] = useState(false);
    const selectedRole = Form.useWatch('role', form);
    const teams = data?.allTeams;

    const getUnrelevantAssignments = useCallback(
        specialitiesIds => {
            const assignmentIds = user?.assignedCustomers?.filter(ac => !includes(specialitiesIds, ac.type.id))?.map(ac => ({ id: ac.id })) ?? null;

            return assignmentIds;
        },
        [user]
    );
    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.destroy();
                message.loading('Updating member...', 2000);
                const currentTeam = toArray(values.team);
                try {
                    const teamIds = getUserTeam(user);
                    const isSame = isEqual(currentTeam.sort(), teamIds.sort());

                    if (user?.role === 'manager' && teamIds.length) {
                        await Promise.all(
                            teamIds.map(teamId =>
                                teamLeaderLeaveTeam({
                                    variables: {
                                        id: user.id,
                                        teamId,
                                    },
                                })
                            )
                        );
                    }

                    if (user?.role === 'worker' && teamIds.length) {
                        await Promise.all(
                            teamIds.map(teamId =>
                                designerLeaveTeam({
                                    variables: {
                                        id: user.id,
                                        teamId,
                                    },
                                })
                            )
                        );
                    }
                    if (values.role === 'manager') {
                        if (values.team.length > 0) {
                            await Promise.all(
                                values.team.map(teamId =>
                                    teamLeaderJoinTeam({
                                        variables: {
                                            id: user.id,
                                            teamId,
                                        },
                                    })
                                )
                            );
                        }
                    }

                    if (values.role === 'worker') {
                        if (values.team.length > 0) {
                            await Promise.all(
                                values.team.map(teamId =>
                                    designerJoinTeam({
                                        variables: {
                                            id: user.id,
                                            teamId,
                                        },
                                    })
                                )
                            );
                        }
                    }

                    // remove assigned company
                    if (values.role === 'worker' && !isSame) {
                        await disconnectAssignCompanies({
                            variables: {
                                assignedCompaniesIds: user.assignedCustomers.map(ac => ({ id: ac.id })),
                                id: user.id,
                            },
                        });
                    }

                    // change the role of user
                    await changeRole({
                        variables: {
                            role: values.role,
                            id: user.id,
                        },
                    });

                    // update user archived
                    await setUserArchived({
                        variables: {
                            id: user.id,
                            archived: !values.status,
                        },
                    });

                    // remove specialities
                    if (user?.specialities?.length > 0) {
                        await disconnectUserSpecialities({
                            variables: {
                                specialitiesIds: user.specialities.map(sp => ({ designTypeId: sp.id, userId: user.id })),
                                id: user.id,
                            },
                        });
                    }

                    // update user design types
                    if (values.role === 'worker') {
                        await updateUserSpecialities({
                            variables: {
                                specialitiesIds: values.specialities.map(id => ({ designTypeId: id })),
                                id: user.id,
                            },
                        });
                    }

                    // remove from any assigned requests and accounts
                    if (user.role === 'worker' && values.role !== 'worker') {
                        await disconnectAssignOrders({
                            variables: {
                                id: user.id,
                            },
                        });
                        await disconnectAssignCompanies({
                            variables: {
                                assignedCompaniesIds: user.assignedCustomers.map(ac => ({ id: ac.id })),
                                id: user.id,
                            },
                        });
                    }

                    // update assignments based on specialities
                    if (values.role === 'worker' && isSame) {
                        const spIds = values.specialities.map(id => id);
                        const unrelevantAssignmentIds = getUnrelevantAssignments(spIds);
                        if (unrelevantAssignmentIds && unrelevantAssignmentIds?.length > 0) {
                            await disconnectAssignCompanies({
                                variables: {
                                    assignedCompaniesIds: unrelevantAssignmentIds,
                                    id: user.id,
                                },
                            });
                        }
                    }

                    await refetchUsers();
                    message.destroy();
                    message.success(`${user.firstname} info has been updated`);
                    setIsLoading(false);
                    onCloseModal();
                    return true;
                } catch (error) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(error);
                    return false;
                }
            }
            return false;
        });
    }, [
        teamLeaderLeaveTeam,
        teamLeaderJoinTeam,
        designerLeaveTeam,
        designerJoinTeam,
        refetchUsers,
        setUserArchived,
        changeRole,
        user,
        validateFields,
        onCloseModal,
        updateUserSpecialities,
        disconnectUserSpecialities,
        disconnectAssignOrders,
        disconnectAssignCompanies,
        getUnrelevantAssignments,
        isLoading,
    ]);

    return (
        <Popup $variant="default" width={500} title="Edit member" open={visible} onCancel={onCloseModal} footer={null} destroyOnClose>
            {visible && (
                <Form
                    onFinish={handleSubmit}
                    name="editUserPopupForm"
                    form={form}
                    initialValues={{
                        role: user.role,
                        team: user.role === 'worker' ? user?.designerTeams?.map(d => d.id) : user?.teamLeadersTeams?.map(tl => tl.id),
                        specialities: user?.specialities?.map(sp => sp?.id),
                    }}
                >
                    <Box $d="flex" $alignItems="center" $mb="20">
                        <Image src={user?.picture?.url} size={40} $fontSize={14} isRounded name={`${user?.firstname ?? ''} ${user?.lastname ?? ''}`} />
                        <Box $pl="8">
                            <Text $textVariant="P4">
                                {user.firstname} {user.lastname}
                            </Text>
                            <Text $textVariant="P5" $colorScheme="secondary">
                                {user.email}
                            </Text>
                        </Box>
                    </Box>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please select a role',
                            },
                        ]}
                        name="role"
                        label="Role"
                        colon={false}
                        required
                        style={{ marginBottom: 20 }}
                    >
                        <RoleField width={460} showAll={false} onFieldChange={() => {}} />
                    </Form.Item>
                    {((!selectedRole && user.role !== 'owner') || (selectedRole && selectedRole !== 'owner')) && (
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a team',
                                },
                            ]}
                            name="team"
                            label="Team"
                            colon={false}
                            required
                            style={{ marginBottom: 20 }}
                        >
                            <TeamField width="100%" showAll={false} multiple />
                        </Form.Item>
                    )}
                    {((!selectedRole && user.role === 'worker') || (selectedRole && selectedRole === 'worker')) && (
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select design type',
                                },
                            ]}
                            initialValue={user.specialities.map(sp => sp.id)}
                            name="specialities"
                            label="Design Type"
                            colon={false}
                            required
                            style={{ marginBottom: 20 }}
                        >
                            <DesignTypeField multiple showAll={false} onFieldChange={() => {}} width={460} />
                        </Form.Item>
                    )}
                    <Form.Item initialValue={!user.archived} valuePropName="checked" name="status" label="Status" colon={false} required>
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Box $d="flex" $justifyContent="flex-end">
                            <Button loading={isLoading} type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Box>
                    </Form.Item>
                </Form>
            )}
        </Popup>
    );
});

export default EditUserPopup;
