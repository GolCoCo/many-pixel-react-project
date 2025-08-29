import React, { memo, useCallback, useState } from 'react';
import { Form } from '@components/Form';
import { useMutation } from '@apollo/client';
import { FormItemFlex } from '@components/FormItemFlex';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import message from '@components/Message';
import { COMPANY_ROLE_MEMBER } from '@constants/account';
import { UPDATE_PROFILE } from '@graphql/mutations/user';
import UploadPhoto from './UploadPhoto';

const ProfileInfoForm = memo(({ user }) => {
    const [form] = Form.useForm()
    const { validateFields } = form;
    const { id: userId, firstname, lastname, email, picture, companyRole, job } = user || {};
    const { url: profilePic } = picture || {};
    const [isLoading, setIsLoading] = useState(false);
    const [updateUserProfile] = useMutation(UPDATE_PROFILE);

    const handleSubmitProfileInfo = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    message.destroy();
                    message.loading('Updating profile...', 50000);
                    setIsLoading(true);
                    try {
                        await updateUserProfile({ variables: { ...values, userId } });
                        message.destroy();
                        message.success('Profile has been updated');
                        setIsLoading(false);
                        return true;
                    } catch (err) {
                        setIsLoading(false);
                        console.log(err);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on updating profile';
                        message.error(formErrorMessage);
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, userId, updateUserProfile]
    );

    return (
        <>
            <Text $textVariant="H5" $colorScheme="primary" $mt="30">
                Profile information
            </Text>
            <UploadPhoto userId={userId} profilePic={profilePic} />
            <Box $mt="20" $mb="30">
                <Form
                    name="profileInfoForm"
                    onFinish={handleSubmitProfileInfo}
                    initialValues={{
                        firstname: firstname || '',
                        lastname: lastname || '',
                        email: email || '',
                        jobtitle: job || '',
                    }}
                    form={form}
                >
                    <FormItemFlex $justifyContent="space-between" $itemWidthPct={30}>
                        <Form.Item
                            name="firstname"
                            rules={ [
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                            ]}
                            label="First name" colon={false} required={false}>
                            <Input placeholder="Enter your first name" />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                            ]}
                            name="lastname"
                            label="Last name"
                            colon={false}
                            required={false}
                        >
                            <Input placeholder="Enter your last name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            colon={false}
                            required={false}
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
                            <Input placeholder="Enter your email address" />
                        </Form.Item>
                        {companyRole && companyRole !== COMPANY_ROLE_MEMBER && (
                            <Form.Item
                                name="jobtitle"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field cannot be empty',
                                    },
                                ]}
                                label="Job title"
                                colon={false}
                                required={false}
                            >
                                <Input placeholder="Enter your job title" />
                            </Form.Item>
                        )}
                    </FormItemFlex>
                    <Form.Item>
                        <Button
                            $w={['100%', 'auto']}
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Box>
        </>
    );
});

export default ProfileInfoForm;
