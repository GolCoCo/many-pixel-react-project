import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Link } from 'react-router-dom';
import { SEND_RESET_EMAIL } from '@graphql/mutations/auth';
import message from '@components/Message';
import { SIGN_IN } from '@constants/routes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';

const PasswordForgetForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [loading, setLoading] = useState(false);
    const [sendResetEmail] = useMutation(SEND_RESET_EMAIL);

    const handleOnSubmit = () => {
        validateFields().then(async (values) => {
            if (!loading) {
                setLoading(true);

                message.destroy();
                message.loading('Sending email...');

                await sendResetEmail({ variables: values })
                    .then(() => {
                        setLoading(false);
                        message.destroy();
                        message.success('Link has been sent to your email');
                        onSuccess();
                    })
                    .catch(err => {
                        setLoading(false);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on sending email';
                        message.error(formErrorMessage);
                    });
            }
        });
    };

    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
            <Box $maxW="480" $w="100%">
                <Text $textVariant="H3" $colorScheme="headline" $mb="10">
                    Forgot Password
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="19">
                    Enter the email address you signed up with below. We will send you an email containing a link to
                    reset your password.
                </Text>
                <Form onFinish={handleOnSubmit} form={form} name="passwordForgetForm">
                    <Form.Item
                        rules={[
                            {
                                type: 'email',
                                message: 'Please enter a valid email',
                            },
                            {
                                required: true,
                                message: 'Please enter your email',
                            },
                        ]}
                        name="email"
                        label="Email"
                        colon={false}
                        required={false}
                        validateTrigger="onBlur"
                    >
                        <Input placeholder="Enter your email address" />
                    </Form.Item>
                    <Link to={SIGN_IN}>
                        <Box $d="flex" $alignItems="center" $colorScheme="cta">
                            <ArrowLeftIcon style={{ fontSize: 14 }} />
                            <Text $textVariant="H6" $ml="8">
                                Go back to sign in
                            </Text>
                        </Box>
                    </Link>
                    <Box $mt="17">
                        <Button $w="100%" type="primary" htmlType="submit" loading={loading}>
                            Send
                        </Button>
                    </Box>
                </Form>
            </Box>
        </Box>
    );
};

export default PasswordForgetForm;
