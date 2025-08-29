import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import moment from 'moment';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import message from '@components/Message';
import { Skeleton } from '@components/Skeleton';
import { CONNECT_AS } from '@graphql/mutations/auth';
import { PopupDelete, Popup } from '@components/Popup';
import { UPDATE_USER_ACTIVATION } from '@graphql/mutations/user';
import { Image } from '@components/Image';
import { USER_TYPE_WORKER } from '@constants/account';
import IconMail from '@components/Svg/IconMail';
import IconCalendar from '@components/Svg/IconCalendar';

const Header = ({ member, loading, refetch, viewer }) => {
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showActivating, setShowActivating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [connectAs] = useMutation(CONNECT_AS);
    const history = useHistory();
    const [updateUserActivation] = useMutation(UPDATE_USER_ACTIVATION);
    const showActivationPopup = useCallback(() => {
        if (!member?.archived) {
            setShowDeactivate(true);
        } else {
            setShowActivating(true);
        }
    }, [member]);
    const handleActivation = useCallback(async () => {
        try {
            setIsUpdating(true);
            await updateUserActivation({
                variables: {
                    id: member?.id,
                    activated: !member?.archived,
                },
            });
            await refetch();
            setIsUpdating(false);
            setShowActivating(false);
            setShowDeactivate(false);
            message.success(`Member has been ${member?.archived ? 'deactivated' : 'activated'}`);
        } catch (err) {
            console.log(err);
            message.destroy();
        }
    }, [member, updateUserActivation, refetch]);

    const handleConnectAs = useCallback(async () => {
        try {
            const response = await connectAs({
                variables: {
                    userId: member?.id,
                },
            });
            const { token } = response?.data?.connectAs;
            if (!token) {
                message.error('Cannot login as company');
                return;
            }
            history.push(`/connect/${token}`);
        } catch (error) {
            const errors = error.graphQLErrors || [];
            const errorMessage = errors.length > 0 ? errors[0].message : 'Error on signing up';
            message.error(errorMessage);
        }
    }, [member, connectAs, history]);

    const picture = member?.picture?.url;
    const memberName = [member?.firstname ?? '', member?.lastname ?? ''].join(' ');
    const isWorker = viewer?.role === USER_TYPE_WORKER;

    return (
        <Box $radii="10" $w="100%" $h="150" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $py="20" $px="30" $mb="28">
            {loading ? (
                <Box $d="flex" $alignItems="flex-start">
                    <Skeleton $variant="avatar" avatarSize="110" $w="auto" />
                    <Box $px="35" $flex="1 1 0%">
                        <Box $d="flex" $alignItems="center">
                            <Skeleton $w="100" $h="26" $mr="4" />
                            <Skeleton $w="48" $h="23" />
                        </Box>
                        <Box $d="flex" $alignItems="center" $mt="18">
                            <Skeleton $w="137" $h="18" $mr="31" />
                            <Skeleton $w="137" $h="18" $mr="31" />
                            <Skeleton $w="137" $h="18" />
                        </Box>
                        <Box $mt="17" $d="flex" $alignItems="center">
                            <Skeleton $w="87" $h="32" $mr="10" />
                            <Skeleton $w="133" $h="20" />
                        </Box>
                    </Box>
                    <Skeleton $w="133" $h="40" />
                </Box>
            ) : (
                <Box $d="flex" $alignItems="flex-start">
                    <Image src={picture} size={110} isRounded $fontSize={20} name={memberName} />
                    <Box $px="35" $flex="1 1 0%">
                        <Box $d="flex" $alignItems="center">
                            <Text $textVariant="H5" $colorScheme="primary" $mr="4">
                                {memberName}
                            </Text>
                        </Box>
                        <Box $d="flex" $alignItems="center" $mt="16">
                            <Box $d="flex" $alignItems="center" $mr="30">
                                <Box $colorScheme="secondary" $d="inline-flex" $w="20" $h="20" $alignItems="center" $justifyContent="center" $mr="6">
                                    <IconCalendar $fontSize="20" />
                                </Box>
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    Created on {moment(member?.createdAt).format('DD MMM YYYY')}
                                </Text>
                            </Box>
                            <Box $d="flex" $alignItems="center" $mr="30">
                                <Box $colorScheme="secondary" $d="inline-flex" $w="20" $h="20" $alignItems="center" $justifyContent="center" $mr="6">
                                    <IconMail $fontSize="20" />
                                </Box>
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    {member?.email}
                                </Text>
                            </Box>
                        </Box>
                        <Box $mt="16" $d="flex" $alignItems="center">
                            <Badge $variant={!!member?.archived ? 'UserInactive' : 'UserActive'}>{!!member?.archived ? 'Inactive' : 'Active'}</Badge>
                        </Box>
                    </Box>
                    {!isWorker && (
                        <>
                            <Box $mr="20">
                                <Button outlined="true" type={!member?.archived ? 'danger' : 'secondary'} $w={['100%', 'auto']} onClick={showActivationPopup}>
                                    {!member?.archived ? 'Deactivate' : 'Activate'}
                                </Button>
                            </Box>
                            <Box>
                                <Button type="primary" $w={['100%', 'auto']} onClick={handleConnectAs}>
                                    Connect As
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            )}
            <PopupDelete
                title="Are you sure you want to deactivate this member?"
                $variant="delete"
                open={showDeactivate}
                onOk={handleActivation}
                confirmLoading={isUpdating}
                okText="Deactivate"
                onCancel={() => setShowDeactivate(false)}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    You can still reactivate this member later
                </Text>
            </PopupDelete>
            <Popup
                title="Do you want to activate this member?"
                open={showActivating}
                confirmLoading={isUpdating}
                onCancel={() => setShowActivating(false)}
                onOk={handleActivation}
                okText="Activate"
                closable={false}
                maskClosable={false}
                centered
                $variant="delete"
                width={436}
                title$colorScheme="primary"
            >
                <Box $d="flex" $justifyContent="center">
                    <Text $textVariant="P4" $colorScheme="secondary">
                        You can still deactivate this member later
                    </Text>
                </Box>
            </Popup>
        </Box>
    );
};

export default Header;
