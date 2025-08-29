import React, { useCallback, useState } from 'react';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import checkmark from '@public/assets/icons/checkmark.svg';
import isEmpty from 'lodash/isEmpty';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';

const SignUpForm = ({ referrerData, onSubmit, invitationData, windowWidth }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const handleOnSubmitForm = useCallback(() => {
        validateFields()
            .then(async values => {
                if (!isLoading) {
                    setIsLoading(true);
                    await onSubmit(values);
                    setIsLoading(false);
                }
            })
            .catch(err => console.log(err));
    }, [validateFields, onSubmit, isLoading]);

    const handleCompareToFirstPassword = (_, value) => {
        if (!isEmpty(value) && !isEmpty(form.getFieldValue('password'))) {
            if (value !== form.getFieldValue('password')) {
                return Promise.reject(new Error(value.message));
            }
        }

        return Promise.resolve();
    };

    const isInvitationLink = !!invitationData?.creatorId;

    return (
        <Form
            name="signUpForm"
            form={form}
            initialValues={{
                referrer: `${referrerData?.firstname} ${referrerData?.lastname}`,
                invitation: !!invitationData?.id,
                email: invitationData?.email,
            }}
            onFinish={handleOnSubmitForm}
        >
            {referrerData && (
                <Form.Item colon={false} name="referrer" label="Your referrer">
                    <Input prefix={<img src={checkmark} alt="Checkmark" />} disabled />
                </Form.Item>
            )}
            {invitationData && (
                <Box $d="none">
                    <Form.Item colon={false} label="Your team">
                        <Input disabled name="invitation" />
                    </Form.Item>
                </Box>
            )}
            <Box $d={['block', 'flex']}>
                <Box $w={['auto', '48%']} $mr="8">
                    <Form.Item
                        name="firstname"
                        label="First name"
                        colon={false}
                        required
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input placeholder="Enter your first name" name="first_name" />
                    </Form.Item>
                </Box>
                <Box $w={['auto', '48%']} $ml="8">
                    <Form.Item
                        label="Last name"
                        name="lastname"
                        colon={false}
                        required
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input placeholder="Enter your last name" name="last_name" />
                    </Form.Item>
                </Box>
            </Box>
            {!invitationData && (
                <>
                    <Form.Item label={windowWidth > 768 ? '' : 'Company name'} colon={false}>
                        <Box hide="mobile" $mb="9">
                            <TooltipIconBlock
                                tooltipIconSize="16px"
                                $textVariant="H6"
                                $colorScheme="primary"
                                label="Company name"
                                tooltip="If you don't have a company, you can enter your name."
                                required
                                $w="370"
                            />
                        </Box>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                            ]}
                            name="companyName"
                            style={{ margin: '0', padding: '0' }}
                        >
                            <Input placeholder="Enter your company name" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        name="website"
                        label="Company website"
                        colon={false}
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input placeholder="www.example.com" />
                    </Form.Item>
                    <Form.Item
                        name="jobTitle"
                        label="Job Title"
                        colon={false}
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input placeholder="Enter your role" />
                    </Form.Item>
                </>
            )}
            <Box $d={invitationData && !isInvitationLink ? 'none' : 'block'}>
                <Form.Item
                    label="Email"
                    colon={false}
                    required
                    name="email"
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
                >
                    <Input placeholder="Enter your email address" name="email" />
                </Form.Item>
            </Box>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
                label="Create password"
                colon={false}
                required
                name="password"
            >
                <Input type="password" placeholder="Create your password" />
            </Form.Item>
            <Form.Item
                label="Confirm password"
                colon={false}
                required
                name="confirm"
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                    {
                        validator: handleCompareToFirstPassword,
                        message: 'Passwords do not match',
                    },
                ]}
            >
                <Input type="password" placeholder="Confirm your password" />
            </Form.Item>
            <Button $w="100%" type="primary" htmlType="submit">
                Register
            </Button>
        </Form>
    );
};

export default SignUpForm;
