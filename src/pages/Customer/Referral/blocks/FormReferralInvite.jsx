import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import message from '@components/Message';
import { ME } from '@graphql/queries/userConnected';
import { CREATE_REFERRAL_BY_EMAIL } from '@graphql/mutations/referral';

const FormReferralInvite = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [createReferralByEmail] = useMutation(CREATE_REFERRAL_BY_EMAIL, {
        refetchQueries: [{ query: ME }],
    });

    const handleSubmit = async () => {
        form.validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.destroy();
                message.loading('Sending invitation...', 50000);

                await createReferralByEmail({
                    variables: {
                        email: values.email,
                    },
                })
                    .then(() => {
                        message.destroy();
                        message.success(`Invitation sent to ${values.email}`);
                        form.resetFields();
                    })
                    .catch(err => {
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on sending invitation';
                        message.error(formErrorMessage);
                    });

                setIsLoading(false);
                return true;
            }
        });
    };

    return (
        <Form onFinish={handleSubmit} form={form} name="referralInviteForm">
            <Form.Item
                name="email"
                label="Share via email"
                colon={false}
                required={false}
                style={{ marginBottom: 20 }}
                rules={[
                    {
                        type: 'email',
                        message: 'Please enter a valid email',
                    },
                    {
                        required: true,
                        message: 'Please enter a valid email',
                    },
                ]}
            >
                <Input placeholder="Enter email" $maxW={['100%', '380']} />
            </Form.Item>
            <Button type="primary" $w={['100%', 'auto']} htmlType="submit" loading={isLoading}>
                Send Invite
            </Button>
        </Form>
    );
};

export default FormReferralInvite;
