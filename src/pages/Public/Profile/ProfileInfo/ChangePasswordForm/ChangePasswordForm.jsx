import React, { memo, useCallback, useState } from 'react';
import { Form } from '@components/Form';
import { useMutation } from '@apollo/client';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { InputPassword } from '@components/Input';
import { FormItemFlex } from '@components/FormItemFlex';
import { Button } from '@components/Button';
import message from '@components/Message';
import { UPDATE_USER_PASSWORD } from '@graphql/mutations/user';

const ChangePasswordForm = memo(({ user }) => {
    const [form] = Form.useForm()
    const { validateFields, resetFields } = form;
    const { id: userId } = user || {};
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);

    const handleSubmitChangePassword = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    message.destroy();
                    message.loading('Updating password...', 50000);
                    setIsLoading(true);

                    try {
                        await updateUserPassword({
                            variables: {
                                userId,
                                currentpassword: values.currentpassword,
                                newpassword: values.newpassword,
                            },
                        });
                        message.destroy();
                        message.success('Password has been updated');
                        resetFields();
                        setIsLoading(false);
                        return true;
                    } catch (err) {
                        setIsLoading(false);
                        console.log(err);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on updating password';
                        if (formErrorMessage === 'Invalid password!') {
                            message.error('Your current password is incorrect');
                        } else {
                            message.error(formErrorMessage);
                        }
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, userId, updateUserPassword, resetFields]
    );

    const handleConfirmPassword = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    const compareToFirstPassword = (_, value) => {
        if (value && value !== form.getFieldValue('newpassword')) {
            return Promise.reject(new Error('Passwords do not match'))
        } else {
            return Promise.resolve();
        }
    };

    const validateToNextPassword = (_, value) => {
        if (value && confirmDirty && value !== form.getFieldValue('confirmpassword')) {
            return Promise.reject(new Error('Passwords do not match'))
        }
        return Promise.resolve();
    };

    return (
        <>
            <Text $textVariant="H5" $colorScheme="primary" $mt="30">
                Change password
            </Text>
            <Box $mt="20" $mb="30">
                <Form
                    form={form}
                    name="changePasswordForm"
                    onFinish={handleSubmitChangePassword}
                >
                    <FormItemFlex $justifyContent="space-between" $itemWidthPct={30}>
                        <Form.Item
                            label="Verify current password"
                            colon={false}
                            required={false}
                            name="currentpassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                            ]}
                        >
                            <InputPassword placeholder="Enter current password" />
                        </Form.Item>
                        <Form.Item
                            name="newpassword"
                            label="New password"
                            colon={false}
                            required={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                                {
                                    validator: validateToNextPassword,
                                },
                            ]}
                        >
                            <InputPassword placeholder="Enter new password" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm new password"
                            colon={false}
                            required={false}
                            name="confirmpassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                                {
                                    validator: compareToFirstPassword,
                                },
                            ]}
                        >
                            <InputPassword placeholder="Confirm new password" onBlur={handleConfirmPassword} />
                        </Form.Item>
                    </FormItemFlex>
                    <Form.Item>
                        <Button $w={['100%', 'auto']} type="primary" htmlType="submit" loading={isLoading}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Box>
        </>
    );
});

export default ChangePasswordForm;
