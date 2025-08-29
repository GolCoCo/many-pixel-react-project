import React, { useState } from 'react';
import { Popup } from '@components/Popup';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import message from '@components/Message';
import { Select } from '@components/Select';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_CUSTOMERS_BY_COMPANIES } from '@graphql/queries/company';
import { REGISTER_USER } from '@graphql/mutations/auth';
import { useCustomerPopupContext } from './CustomerPopupContext.jsx';

const CustomerPopupAddUser = ({ refetch }) => {
    const [form] = Form.useForm();
    const { isAdding, setAdding } = useCustomerPopupContext();
    const { validateFields } = form;
    const [isLoading, setLoading] = useState(false);
    const [signupUser] = useMutation(REGISTER_USER);
    const [confirmDirty, setConfirmDirty] = useState('');

    const { data, loading } = useQuery(ALL_CUSTOMERS_BY_COMPANIES, {
        variables: {
            keyword: '',
            plan: 'ALL',
            status: 'ALL',
            team: 'ALL',
        },
    });

    const onClose = () => {
        setAdding(false);
    };

    const handleSubmit = () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setLoading(true);
                message.loading('Adding user...', 2000);
                try {
                    await signupUser({
                        variables: {
                            email: values.email,
                            password: values.password,
                            firstname: values.firstname,
                            lastname: values.lastname,
                            invitation: true,
                            referrer: null,
                            companyId: values.companyId,
                            companyRole: 'MEMBER',
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

    const accounts = data?.allCustomersByCompanies.data ?? [];

    return (
        <Popup open={isAdding} onCancel={onClose} title="Add user" $variant="default" width={500} footer={null} destroyOnClose>
            <Form onFinish={handleSubmit} name="customerPopupAddUserAccount" form={form}>
                <Form.Item
                    rules={[{ required: true, message: 'Please select account' }]}
                    name="companyId"
                    label="Account"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Select showSearch loading={loading}>
                        {accounts?.map(account => (
                            <Select.Option key={account.id} value={account.id}>
                                {account.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: 'Please enter first name' }]}
                    name="firstname"
                    label="First name"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input placeholder="Enter first name" />
                </Form.Item>
                <Form.Item
                    rules={[{ required: true, message: 'Please enter last name' }]}
                    name="lastname"
                    label="Last name"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input placeholder="Enter last name" />
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
                    rules={[
                        { required: true, message: 'Please enter password' },
                        { validator: handleCheckPassword, message: 'Passwords do not match' },
                    ]}
                    name="password"
                    label="Password"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 20 }}
                >
                    <Input type="password" placeholder="Enter password" />
                </Form.Item>
                <Form.Item
                    rules={[
                        { required: true, message: 'Please enter confirmation password' },
                        {
                            validator: handleComparePassword,
                            message: 'Passwords do not match',
                        },
                    ]}
                    name="confirm"
                    label="Confirm Password"
                    colon={false}
                    required={false}
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

export default CustomerPopupAddUser;
