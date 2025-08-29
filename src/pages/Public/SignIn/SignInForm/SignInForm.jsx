import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useApolloClient } from '@apollo/client';
import { Checkbox } from '@components/Checkbox';
import message from '@components/Message';
import { AUTH_USER, SEND_ACTIVATION_LINK } from '@graphql/mutations/auth';
import { login } from '@constants/auth';
import { PASSWORD_FORGET, REQUESTS } from '@constants/routes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Form } from '@components/Form';

const SignInForm = ({ history }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const client = useApolloClient();
    const [showActivationLink, setShowActivationLink] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastEmailValue, setLastEmailValue] = useState(null);
    const [authenticateUser] = useMutation(AUTH_USER);
    const [sendActivationLink] = useMutation(SEND_ACTIVATION_LINK);

    const getRememberedEmail = () => {
        const email = localStorage.getItem('log-email');
        return email === 'null' ? null : email;
    };

    const handleOnClickActivationLink = async () => {
        const variables = {
            email: lastEmailValue,
        };

        try {
            message.destroy();
            message.loading('Sending activation link...', 50000);

            await sendActivationLink({ variables });
            setShowActivationLink(false);

            message.destroy();
            message.success(
                `An activation link will be sent to ${lastEmailValue} in the next 5 minutes. Please check your inbox.`
            );
        } catch (e) {
            message.destroy();
            message.error('Error on sending activation link');
        }
    };

    const handleLoginSuccess = useCallback(
        async ({ token, email }) => {
            await login(token, email, client);
            setLoading(false);
            message.destroy();
            history.push(REQUESTS);
        },
        [client, history]
    );

    const handleSubmit = () => {
        validateFields().then(async (values) => {
            if (!loading) {
                setLoading(true);
                setLastEmailValue(values.email);

                try {
                    message.destroy();
                    message.loading('Logging in...', 50000);

                    const res = await authenticateUser({
                        variables: {
                            email: values.email,
                            password: values.password,
                        },
                    });
                    const { token } = res.data.login;
                    const successData = {
                        token,
                    };

                    successData.email = values.remember ? values.email : null;

                    handleLoginSuccess(successData);
                } catch (err) {
                    setLoading(false);

                    const errors = err.graphQLErrors || [];
                    const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on signing in';
                    message.destroy();
                    message.error(formErrorMessage);

                    err.graphQLErrors.forEach(x => {
                        const { name } = x;

                        if (name && name === 'AccountNotActivated') {
                            setShowActivationLink(true);
                        }
                    });
                }
            }
        });
    };

    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
            <Box $maxW="480" $w="100%">
                <Text $textVariant="H3" $colorScheme="headline" $mb="30">
                    Sign in
                </Text>
                <Form
                    onFinish={handleSubmit}
                    form={form}
                    name="signInForm"
                    initialValues={{
                        email: getRememberedEmail(),
                        remember: true,
                    }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        colon={false}
                        required={false}
                        validateTrigger="onBlur"
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
                        <Input placeholder="Enter your email address" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" colon={false} required={false} rules={[{ required: true, message: 'Please enter a Password' }]}>
                        <Input type="password" placeholder="Enter your password" />
                    </Form.Item>
                    <Box $mb="20" $d="flex" $justifyContent="space-between" $alignItems="center">
                        <Box $mb="-30">
                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>
                                    <Text $d="inline-block" $textVariant="Badge" $colorScheme="primary">
                                        Remember me
                                    </Text>
                                </Checkbox>
                            </Form.Item>
                        </Box>
                        <Link to={PASSWORD_FORGET}>
                            <Text $textVariant="H6" $colorScheme="cta">
                                Forgot your password?
                            </Text>
                        </Link>
                    </Box>
                    <Box>
                        <Button $w="100%" type="primary" htmlType="submit" loading={loading}>
                            Sign In
                        </Button>
                    </Box>
                    {showActivationLink && (
                        <Box
                            $my="8"
                            $cursor="pointer"
                            $textDecoration="underline"
                            onClick={handleOnClickActivationLink}
                            $colorScheme="cta"
                        >
                            Resend user account activation email
                        </Box>
                    )}
                </Form>
            </Box>
        </Box>
    );
};

export default SignInForm;
