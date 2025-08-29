import React, { useState } from 'react';
import { Popup } from '@components/Popup';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { useCustomerPopupContext } from './CustomerPopupContext.jsx';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import message from '@components/Message';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '@graphql/mutations/auth';

const CustomerPopupAddAccount = ({ refetch }) => {
    const [form] = Form.useForm();
    const { isAdding, setAdding } = useCustomerPopupContext();
    const { validateFields } = form;
    const [isLoading, setLoading] = useState(false);
    const [signupUser] = useMutation(REGISTER_USER);
    const [confirmDirty, setConfirmDirty] = useState('');

    const onClose = () => {
        setAdding(false);
    };

    const handleSubmit = () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setLoading(true);
                message.destroy();
                message.loading('Adding account...', 2000);
                try {
                    const [firstname, ...lastNames] = values.name.split(' ');
                    const lastname = lastNames.join(' ') ?? '';
                    await signupUser({
                        variables: {
                            email: values.email,
                            password: values.password,
                            firstname,
                            lastname,
                            invitation: false,
                            referrer: null,
                            companyId: null,
                            companyRole: 'ADMIN',
                            withEmailSent: true,
                        },
                    });

                    message.destroy();
                    message.success('Invitation has been sent');

                    setLoading(false);
                    setAdding(false);
                    refetch();
                    return true;
                } catch (error) {
                    message.destroy();
                    const errors = error.graphQLErrors || [];
                    const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on sending invitation';
                    message.error(formErrorMessage);
                    setLoading(false);
                    return false;
                }
            }
        });
    };

    const handleConfirmBlur = e => setConfirmDirty(confirmDirty || !!e.target.value);

    const handleCheckPassword = (_, value) => {
        if (value && confirmDirty && value !== form.getFieldValue('confirm')) {
            return Promise.reject(new Error('Passwords do not match'));
        }
        return Promise.resolve();
    };

    const handleComparePassword = (_, value) => {
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject(new Error('Passwords do not match'));
        }
        return Promise.resolve();
    };

    return (
        <Popup open={isAdding} onCancel={onClose} title="Add account" $variant="default" width={500} footer={null} destroyOnClose>
            <Form onFinish={handleSubmit} name="customerPopupAddAccountForm" form={form}>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter account name' }]}
                    label="Account name"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input placeholder="Enter account name" />
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: 'Please enter email address' }]}
                    name="email"
                    label="Email"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input type="email" placeholder="Enter email address" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter password' },
                        { validator: handleCheckPassword, message: 'Password do not match' },
                    ]}
                    label="Password"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input type="password" placeholder="Enter password" />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    colon={false}
                    required={false}
                    rules={[
                        { required: true, message: 'Please enter confirmation password' },
                        {
                            validator: handleComparePassword,
                            message: 'Passwords do not match',
                        },
                    ]}
                >
                    <Input type="password" placeholder="Enter password" onBlur={handleConfirmBlur} />
                </Form.Item>
                <Box $textAlign="right">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            SEND INVITATION
                        </Button>
                    </Form.Item>
                </Box>
            </Form>
        </Popup>
    );
};

export default CustomerPopupAddAccount;
