import React, { useCallback, useState, forwardRef } from 'react';
import { useMutation } from '@apollo/client';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Form } from '@components/Form';
import { ADD_INVITATION, GET_INVITATION_LINK } from '@graphql/mutations/invitation';
import message from '@components/Message';
import IconCopy from '@components/Svg/IconCopy';
import { debounce } from 'lodash';

const FormTeam = forwardRef(({ firstname, lastname, userId, initialValues = {}, refetchMembers, onClose, isOnlyAdmin, companyId }, ref) => {
    const [form] = Form.useForm();
    const [createInvitation] = useMutation(ADD_INVITATION);
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [hasEmail, setHasEmail] = useState(false);

    const [linkCopied, setLinkCopied] = useState(false);

    const [getInvitationLink] = useMutation(GET_INVITATION_LINK);

    const linkUnCopiedFunc = debounce(() => {
        setLinkCopied(false);
    }, 4000);

    const handleCopyShareLink = useCallback(() => {
        if (linkCopied) return;
        getInvitationLink({ variables: { companyId } })
            .then(res => {
                navigator.clipboard.writeText(res.data.createInvitationLink.link);
            })
            .catch(err => {
                const errors = err.graphQLErrors || [];
                const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on getting invitation link';
                message.error(formErrorMessage);
            });
        setLinkCopied(true);
        linkUnCopiedFunc();
    }, [getInvitationLink, companyId, linkCopied, linkUnCopiedFunc]);

    const handleChangeEmail = useCallback(
        e => {
            setHasEmail(!!e.target.value);
        },
        [form]
    );

    const handleSubmit = useCallback(() => {
        validateFields().then(async values => {
            setIsLoading(true);
            message.destroy();
            message.loading('Sending invitation...', 50000);
            try {
                const invitationData = { ...values, companyId };
                await createInvitation({ variables: invitationData })
                    .then(() => {
                        message.destroy();
                        message.success(
                            <>
                                Invitation sent to{' '}
                                <Text $d="inline-block" $fontWeight="400">
                                    {values.email}
                                </Text>
                            </>
                        );
                        setIsLoading(false);
                        onClose();
                        return true;
                    })
                    .catch(err => {
                        setIsLoading(false);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on sending invitation';
                        message.error(formErrorMessage);

                        return false;
                    });
            } catch (e) {
                setIsLoading(false);
                console.error(e);
                message.destroy();
                message.error('Something went wrong');
                onClose();
                return false;
            }
        });
    }, [createInvitation, refetchMembers, firstname, lastname, onClose, userId, validateFields, isOnlyAdmin, companyId]);

    return (
        <div>
            <Text $textVariant="H5" $mb="20" $colorScheme="primary">
                Invite team member
            </Text>
            <Form
                form={form}
                name="teamFormC"
                ref={ref}
                onFinish={handleSubmit}
                initialValues={{
                    email: initialValues.email,
                    companyRole: initialValues.companyRole || 'MEMBER',
                }}
            >
                <Box $mb="0">
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
                        required={false}
                    >
                        <Input readOnly={false} onChange={handleChangeEmail} placeholder="user@example.com" />
                    </Form.Item>
                </Box>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Box $d="flex" $justifyContent="end">
                        <Button
                            onClick={handleCopyShareLink}
                            $w="149"
                            $mr="16"
                            $cursor="pointer"
                            $radii="10px"
                            $border="1px solid #d5d6dd"
                            $colorScheme={linkCopied ? 'red' : 'black'}
                        >
                            <Box $d="flex" $alignItems="center" $justifyContent="center">
                                {!linkCopied && (
                                    <Text $colorScheme="cta" $mt="4" $mr="8">
                                        <IconCopy size={16} />
                                    </Text>
                                )}
                                <Text $textVariant="Button">{linkCopied ? 'LINK COPIED!' : 'COPY LINK'}</Text>
                            </Box>
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={!hasEmail}>
                            Invite
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </div>
    );
});

export default FormTeam;
