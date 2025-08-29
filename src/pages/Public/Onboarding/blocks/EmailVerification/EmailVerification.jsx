import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import message from '@components/Message';
import successRobot from '@public/assets/icons/success-robot.svg';
import { SIGN_IN } from '@constants/routes';
import { SEND_NEW_EMAIL_ACTIVATION_LINK } from '@graphql/mutations/auth';
import { ACTIVATE_ACCOUNT } from '@graphql/queries/tokenUserActivation';

const EmailVerification = ({ viewer, verifyId, refetchViewer }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isReenter, setIsReenter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sendNewEmailActivationLink] = useMutation(SEND_NEW_EMAIL_ACTIVATION_LINK);
    const [activateAccount, { error, data, loading }] = useMutation(ACTIVATE_ACCOUNT)

    useEffect(() => {
        const verify = async () => {
            try {
                await activateAccount({
                    variables: {
                        id: verifyId
                    }
                });
                await refetchViewer();
            } catch (err) {
                console.log(err)
            }
        }
        if (verifyId) {
            verify()
        }
    }, [verifyId])

    const onReenterEmail = () => {
        setIsReenter(!isReenter);
    };

    const handleOnSubmitForm = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    const { email } = values;

                    message.destroy();
                    message.loading('Sending activation link...', 50000);
                    setIsLoading(true);

                    await sendNewEmailActivationLink({ variables: { email, userId: viewer?.id } })
                        .then(async result => {
                            const { data } = result;
                            const { updateEmailTokenUserActivation } = data;
                            message.destroy();
                            if (updateEmailTokenUserActivation?.sent) {
                                message.success('Activation link has been sent to your email');
                            } else {
                                message.error('Failed to send activation link');
                            }
                            setIsLoading(false);
                            setIsReenter(false);
                            await refetchViewer();
                        })
                        .catch(err => {
                            setIsLoading(false);
                            setIsReenter(false);
                            const errors = err.graphQLErrors || [];
                            const formErrorMessage =
                                errors.length > 0 ? errors[0].message : 'Error on sending activation link';
                            message.destroy();
                            message.error(formErrorMessage);
                        });
                }
            });
        },
        [isLoading, validateFields, sendNewEmailActivationLink, viewer, refetchViewer]
    );

    if (loading) {
        return (
            <Box $w="100%" $maxW="480" $my="0" $mx="auto">
                <Box $d="flex" $justifyContent="center" $alignItems="center" $mb="10">
                    <Box $textAlign="center" $mt={['0', '170']} $w={['100%', 'auto']}>
                        <Box $textAlign="center" $mb="20">
                            <Icon component={LoadingOutlined} style={{ fontSize: 80, color: '#0099F6' }} />
                        </Box>
                        <Text hide="mobile" $textVariant="H3" $colorScheme="primary">
                            Verifying email...
                        </Text>
                        <Text hide="desktop" $textVariant="H4" $colorScheme="primary">
                            Verifying email...
                        </Text>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        const errors = error.graphQLErrors || [];
        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on activating account';
        message.destroy();
        message.error(formErrorMessage);

        if (!viewer?.id) {
            return <Redirect to={SIGN_IN} />;
        }
    }

    if (data?.activateAccount?.activated) {
        localStorage.removeItem('localSelectedPlan');
        localStorage.removeItem('localSelectedPromotion');
        localStorage.removeItem('localFrequency');

        if (viewer?.id) {

            return (
                <Box $w="100%" $maxW="480" $my="0" $mx="auto">
                    <Box $d="flex" $justifyContent="center" $alignItems="center" $mb="10">
                        <Box $textAlign="center" $mt={['0', '170']} $w={['100%', 'auto']}>
                            <Box $textAlign="center" $mb="20">
                                <Icon component={LoadingOutlined} style={{ fontSize: 80, color: '#0099F6' }} />
                            </Box>
                            <Text hide="mobile" $textVariant="H3" $colorScheme="primary">
                                Verification successful. Redirecting...
                            </Text>
                            <Text hide="desktop" $textVariant="H4" $colorScheme="primary">
                                Verification successful. Redirecting...
                            </Text>
                        </Box>
                    </Box>
                </Box>
            );
        } else {
            message.destroy();
            message.success('Verification successful. Please sign in to continue');
            return <Redirect to={SIGN_IN} />;
        }
    }

    if (isReenter) {
        return (
            <Box $w="100%" $maxW="480" $my="0" $mx="auto">
                <Box $d="flex" $justifyContent="center" $alignItems="center" $mb="10">
                    <Box $textAlign="center" $mt={['0', '170']} $w={['100%', 'auto']}>
                        <Text hide="mobile" $textVariant="H3" $colorScheme="primary" $mb="10">
                            Re-enter your email address
                        </Text>
                        <Text hide="desktop" $textVariant="H4" $colorScheme="primary" $mb="10">
                            Re-enter your email address
                        </Text>
                        <Text $textVariant="P3" $colorScheme="primary" $mb="29">
                            Once you submit your new email, the link will be sent to your email.
                        </Text>
                        <Box $textAlign="left">
                            <Form
                                onFinish={handleOnSubmitForm}
                                form={form}
                                name="emailVerificationForm"
                            >
                                <Form.Item
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Please enter a valid email address',
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter a valid email address',
                                        },
                                    ]}
                                    name="email"
                                    label="Email"
                                    colon={false}
                                    required
                                >
                                    <Input placeholder="Enter your email address" />
                                </Form.Item>
                                <Box $textAlign="center">
                                    <Button $w="100%" $maxW="300" type="primary" htmlType="submit" loading={isLoading}>
                                        Submit
                                    </Button>
                                </Box>
                            </Form>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $mb="10">
            <Box $textAlign="center" $mt={['0', '115']} $w={['100%', 'auto']}>
                <img src={successRobot} alt="Success Robot" />
                <Text hide="mobile" $textVariant="H3" $colorScheme="primary" $my="10">
                    Check your email!
                </Text>
                <Text hide="desktop" $textVariant="H4" $colorScheme="primary" $my="10">
                    Check your email!
                </Text>
                <Text $textVariant="P3" $colorScheme="primary" $mb="10">
                    We've emailed a link to{' '}
                    <Text $d="inline-block" $fontWeight="400">
                        {viewer?.email}
                    </Text>
                    . Check the link to confirm your email and get started
                </Text>
                <Text $textVariant="P3" $colorScheme="primary">
                    Wrong email? Please{' '}
                    <Text $d="inline-block" $colorScheme="cta" $fontWeight="400" $cursor="pointer" onClick={onReenterEmail}>
                        re-enter your email address
                    </Text>
                </Text>
            </Box>
        </Box>
    );
};

export default EmailVerification;
