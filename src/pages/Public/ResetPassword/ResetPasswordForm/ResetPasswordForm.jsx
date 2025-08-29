import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import message from '@components/Message';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Input } from '@components/Input';
import { USER_RESET_PASSWORD } from '@graphql/mutations/auth';

const ResetPasswordForm = ({ onSuccess, userId }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [userResetPassword] = useMutation(USER_RESET_PASSWORD);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = () => {
        validateFields().then(async (values) => {
            if (!isLoading) {
                setIsLoading(true);
                try {
                    message.destroy();
                    message.loading('Resetting password...');

                    await userResetPassword({ variables: { id: userId, password: values.password } });
                    setIsLoading(false);

                    message.destroy();
                    onSuccess();
                } catch (e) {
                    console.error(e);
                    setIsLoading(false);
                }
            }
        });
    };

    const compareToFirstPassword = (_, value,) => {
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject(new Error('The two passwords do not match'));
        } 
        return Promise.resolve()
    };

    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
            <Box $maxW="480" $w="100%">
                <Text $textVariant="H3" $colorScheme="headline" $mb="29">
                    Reset Password
                </Text>
                <Form onFinish={handleOnSubmit} form={form} name="resetPasswordForm">
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please enter new password',
                            },
                        ]}
                        name="password"
                        label="New password"
                        colon={false}
                        required={false}
                    >
                        <Input type="password" />
                    </Form.Item>
                    <Form.Item
                        rules={[
                                {
                                    required: true,
                                    message: 'Please confirm new password',
                                },
                                {
                                    validator: compareToFirstPassword,
                                },
                        ]}
                        name="confirm"
                        validateTrigger="onBlur"
                        label="Confirm new password"
                        colon={false}
                        required={false}
                    >
                        <Input type="password" />
                    </Form.Item>
                    <Button $w="100%" type="primary" htmlType="submit" loading={isLoading}>
                        Reset password
                    </Button>
                </Form>
            </Box>
        </Box>
    );
};

export default ResetPasswordForm;
