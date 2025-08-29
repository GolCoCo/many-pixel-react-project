import React, { memo, useState } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import { Text } from '@components/Text';
import RoleField from '@pages/Admin/Company/MembersTab/blocks/RoleField';
import TeamField from '@pages/Admin/Company/MembersTab/blocks/TeamField';
import DesignTypeField from '@pages/Admin/Company/MembersTab/blocks/DesignTypeField';
import { Button } from '@components/Button';
import message from '@components/Message';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';

import { useMutation } from '@apollo/client';
import {
    CHANGE_USER_ROLE,
    DESIGNER_JOIN_TEAM,
    DESIGNER_LEAVE_TEAM,
    DISCONNECT_USER_DESIGN_TYPE,
    TEAM_LEADER_JOIN_TEAM,
    TEAM_LEADER_LEAVE_TEAM,
    UPDATE_USER_DESIGN_TYPE,
    DISCONNECT_ASSIGN_ORDERS,
    DISCONNECT_ASSIGN_COMPANIES,
} from '@graphql/mutations/user';

function toArray(arrayLike) {
    const newArray = [];

    if (arrayLike?.length) {
        for (let x = 0; x < arrayLike.length; x += 1) {
            newArray.push(arrayLike[x]);
        }
    }

    return newArray;
}

const getUserTeam = user => {
    if (user?.role === 'manager' && user?.teamLeadersTeams?.length > 0) {
        return user.teamLeadersTeams.map(t => t.id);
    }
    if (user?.role === 'worker' && user?.designerTeams?.length > 0) {
        return user.designerTeams.map(t => t.id);
    }
    return [];
};

const getUnrelevantAssignments = (user, specialitiesIds) => {
    const assignmentIds = user?.assignedCustomers?.filter(ac => !includes(specialitiesIds, ac.type.id))?.map(ac => ({ id: ac.id })) ?? null;

    return assignmentIds;
};

const Profile = memo(({ member, isWorker, refetch }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { validateFields } = form;

    const [teamLeaderLeaveTeam] = useMutation(TEAM_LEADER_LEAVE_TEAM);
    const [teamLeaderJoinTeam] = useMutation(TEAM_LEADER_JOIN_TEAM);
    const [designerLeaveTeam] = useMutation(DESIGNER_LEAVE_TEAM);
    const [designerJoinTeam] = useMutation(DESIGNER_JOIN_TEAM);
    const [changeRole] = useMutation(CHANGE_USER_ROLE);
    const [updateUserSpecialities] = useMutation(UPDATE_USER_DESIGN_TYPE);
    const [disconnectUserSpecialities] = useMutation(DISCONNECT_USER_DESIGN_TYPE);
    const [disconnectAssignOrders] = useMutation(DISCONNECT_ASSIGN_ORDERS);
    const [disconnectAssignCompanies] = useMutation(DISCONNECT_ASSIGN_COMPANIES);
    const selectedRole = Form.useWatch('role', form) ?? member?.role;

    const handleSubmit = () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                message.destroy();
                message.loading('Updating member ...', 2000);
                const currentTeam = toArray(values.team);
                try {
                    const teamIds = getUserTeam(member);
                    const isSame = isEqual(currentTeam.sort(), teamIds.sort());

                    if (member?.role === 'manager' && teamIds.length) {
                        await Promise.all(
                            teamIds.map(teamId =>
                                teamLeaderLeaveTeam({
                                    variables: {
                                        id: member.id,
                                        teamId,
                                    },
                                })
                            )
                        );
                    }

                    if (member?.role === 'worker' && teamIds.length) {
                        await Promise.all(
                            teamIds.map(teamId =>
                                designerLeaveTeam({
                                    variables: {
                                        id: member.id,
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
                                            id: member.id,
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
                                            id: member.id,
                                            teamId,
                                        },
                                    })
                                )
                            );
                        }
                    }

                    if (values.role === 'worker' && !isSame) {
                        await disconnectAssignCompanies({
                            variables: {
                                assignedCompaniesIds: member.assignedCustomers.map(ac => ({ id: ac.id })),
                                id: member.id,
                            },
                        });
                    }

                    if (member?.specialities?.length > 0) {
                        await disconnectUserSpecialities({
                            variables: {
                                specialitiesIds: member.specialities.map(sp => ({ designTypeId: sp.id, userId: member.id })),
                                id: member.id,
                            },
                        });
                    }

                    // update user design types
                    if (values.role === 'worker') {
                        await updateUserSpecialities({
                            variables: {
                                specialitiesIds: values.specialities.map(id => ({ designTypeId: id })),
                                id: member.id,
                            },
                        });
                    }

                    await changeRole({
                        variables: {
                            role: values.role,
                            id: member.id,
                        },
                    });

                    // remove from any assigned requests and accounts
                    if (member.role === 'worker' && values.role !== 'worker') {
                        await disconnectAssignOrders({
                            variables: {
                                id: member.id,
                            },
                        });
                        await disconnectAssignCompanies({
                            variables: {
                                assignedCompaniesIds: member.assignedCustomers.map(ac => ({ id: ac.id })),
                                id: member.id,
                            },
                        });
                    }

                    // update assignments based on specialities
                    if (values.role === 'worker' && isSame) {
                        const spIds = values.specialities.map(id => id);
                        const unrelevantAssignmentIds = getUnrelevantAssignments(member, spIds);
                        if (unrelevantAssignmentIds && unrelevantAssignmentIds?.length > 0) {
                            await disconnectAssignCompanies({
                                variables: {
                                    assignedCompaniesIds: unrelevantAssignmentIds,
                                    id: member.id,
                                },
                            });
                        }
                    }

                    message.destroy();
                    message.success('Profile updated');

                    await refetch();
                    setIsLoading(false);
                    return true;
                } catch (error) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(error);
                    return false;
                }
            }
        });
    };
    return (
        <Box $my={['20', '30']}>
            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                Profile
            </Text>
            <Form
                onFinish={handleSubmit}
                name="profileForm"
                initialValues={{
                    role: member?.role,
                    team: selectedRole === 'worker' ? member?.designerTeams?.map(d => d.id) : member?.teamLeadersTeams?.map(tl => tl.id),
                    specialities: member?.specialities?.map(sp => sp?.id),
                }}
                form={form}
            >
                <Box $mb={['16', '20']}>
                    <Form.Item name="role" label="Role" colon={false} style={{ marginBottom: 0 }}>
                        <RoleField disabled={isWorker} width="100%" showAll={false} onFieldChange={() => {}} />
                    </Form.Item>
                </Box>
                {selectedRole !== 'owner' && (
                    <Box $mb={['16', '20']}>
                        <Form.Item name="team" label="Team" colon={false} style={{ marginBottom: 0 }}>
                            <TeamField disabled={isWorker} width="100%" showAll={false} multiple />
                        </Form.Item>
                    </Box>
                )}
                {selectedRole === 'worker' && (
                    <Box $mb={['16', '20']}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select design type',
                                },
                            ]}
                            name="specialities"
                            label="Design typess"
                            colon={false}
                            required={false}
                            style={{ marginBottom: 0 }}
                        >
                            <DesignTypeField disabled={isWorker} multiple width="100%" showAll={false} />
                        </Form.Item>
                    </Box>
                )}
                {!isWorker && (
                    <Form.Item>
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </Box>
    );
});

export default Profile;
