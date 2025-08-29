import React, { memo, useCallback, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_TEAMS } from '@graphql/queries/team';
import { Button } from '@components/Button';
import { Form } from '@components/Form';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Input } from '@components/Input';
import message from '@components/Message';
import { Radio, RadioGroup } from '@components/Radio';
import { ADD_INVITATION } from '@graphql/mutations/invitation';
import RoleField from '../RoleField';
import DesignTypeField from '../DesignTypeField';

const AddUserPopup = memo(({ visible, onCloseModal, companyId, refetchUsers }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const { data } = useQuery(GET_ALL_TEAMS, {
        fetchPolicy: 'network-only',
    });
    const [createInvitation] = useMutation(ADD_INVITATION);

    const [isLoading, setIsLoading] = useState(false);
    const selectedRole = Form.useWatch('role', form);

    const handleSubmit = useCallback(() => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                message.loading('Adding member...', 2000);

                try {
                    const invitationData = {
                        email: values.email,
                        role: values.role,
                        companyId,
                        companyRole: null,
                        teamId: values.teamId ?? null,
                        specialityIds: values.specialityIds ?? [],
                    };

                    await createInvitation({ variables: invitationData });
                    message.destroy();
                    message.success('Invitation has been sent');
                    setIsLoading(false);
                    onCloseModal();
                    form.resetFields()
                    refetchUsers();
                } catch (error) {
                    message.destroy();
                    const errors = error.graphQLErrors || [];
                    const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on sending invitation';
                    message.error(formErrorMessage);
                    setIsLoading(false);
                    return false;
                }
            }
        });
    }, [createInvitation, companyId, isLoading, onCloseModal, refetchUsers, validateFields]);
   
    const teams = data?.allTeams;
    return (
        <Popup $variant="default" width={500} open={visible} onCancel={() => {
            form.resetFields()
            onCloseModal()}} footer={null} destroyOnClose title="Add member">
            <Text $textVariant="P4" $mb="20">
                Your teammate will receive an invitation to join the team in his inbox mail.
            </Text>
            <Form onFinish={handleSubmit} form={form} name="addUserPopupForm">
                <Form.Item
                    name="email"
                    label="Email"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                    rules={[{ required: true, message: 'Please insert team e-mail here' }]}
                >
                    <Input type="email" placeholder="user@example.com" />
                </Form.Item>
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
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <RoleField width={460} showAll={false} onFieldChange={() => {}} />
                </Form.Item>
                {selectedRole && selectedRole !== 'owner' && (
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please select a team',
                            },
                        ]}
                        name="teamId"
                        label="Team"
                        colon={false}
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <RadioGroup>
                            <Box $d="flex">
                                {teams.map(team => (
                                    <Radio value={team.id} key={team.id}>
                                        {team.name}
                                    </Radio>
                                ))}
                            </Box>
                        </RadioGroup>
                    </Form.Item>
                )}
                {selectedRole && selectedRole === 'worker' && (
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please select design type',
                            },
                        ]}
                        name="specialityIds"
                        label="Design Type"
                        colon={false}
                        required
                        style={{ marginBottom: 20 }}
                    >
                        <DesignTypeField multiple showAll={false} onFieldChange={() => {}} width={460} />
                    </Form.Item>
                )}
                <Box $d="flex" $justifyContent="flex-end" $pt="10">
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Send Invitation
                    </Button>
                </Box>
            </Form>
        </Popup>
    );
});

export default AddUserPopup;
