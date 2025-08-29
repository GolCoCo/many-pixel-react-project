import React, { memo, useState } from 'react';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Popup } from '@components/Popup';
import { Input } from '@components/Input';
import message from '@components/Message';
import { useMutation } from '@apollo/client';
import { CREATE_TEAM, UPDATE_TEAM } from '@graphql/mutations/team';

const TeamPopup = memo(({ visible, onCloseModal, refetch, initialData }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;

    const [isLoading, setIsLoading] = useState(false);
    const [createTeam] = useMutation(CREATE_TEAM);
    const [updateTeam] = useMutation(UPDATE_TEAM);

    const handleSubmit = () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                const loadingText = initialData?.id ? 'Updating team...' : 'Adding team...';
                message.destroy();
                message.loading(loadingText, 2000);

                try {
                    if (initialData?.id) {
                        await updateTeam({
                            variables: {
                                data: {
                                    name: values.name,
                                    status: 'ACTIVE',
                                },
                                where: {
                                    id: initialData.id,
                                },
                            },
                        });
                    } else {
                        await createTeam({
                            variables: {
                                data: {
                                    name: values.name,
                                    status: 'ACTIVE',
                                },
                            },
                        });
                    }

                    message.destroy();
                    if (initialData?.id) {
                        message.success('Team name has been updated');
                    } else {
                        message.success('Team has been created');
                    }
                    setIsLoading(false);
                    onCloseModal();
                    if (refetch) {
                        await refetch();
                    }
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

    return (
        <Popup
            $variant="default"
            width={500}
            open={visible}
            onCancel={onCloseModal}
            footer={null}
            destroyOnClose
            title={initialData?.id ? 'Edit team name' : 'Create team'}
        >
            <Form
                onFinish={handleSubmit}
                initialValues={{
                    name: initialData?.name ?? '',
                }}
                form={form}
            >
                <Form.Item name="name" label="Name" colon={false} required={false} rules={[{ required: true, message: 'Please insert team name' }]}>
                    <Input placeholder="Enter team name" />
                </Form.Item>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Save
                    </Button>
                </Box>
            </Form>
        </Popup>
    );
});

export default TeamPopup;
