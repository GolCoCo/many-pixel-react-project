import React, { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import stripeLogo from '@public/assets/icons/stripe-logo.png';
import { CalendarOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Badge } from '@components/Badge';
import _ from 'lodash';
import { Button } from '@components/Button';
import { CONNECT_AS } from '@graphql/mutations/auth';
import message from '@components/Message';
import { Skeleton } from '@components/Skeleton';
import { Image } from '@components/Image';
import { CUSTOMERS, MANAGE_TEAM, STRIPE_CUSTOMER_PROFILE } from '@constants/routes';
import { TIMEZONES } from '@constants/forms';
import StatusColoredText from '@components/Text/StatusColoredText';
import { computeStatusFinal } from '@utils/subscription';
import { PopupDelete } from '@components/Popup';
import { DELETE_USER_ACCOUNT } from '@graphql/mutations/user';
import { Tooltip } from 'antd';
import IconWarning from '@components/Svg/IconWarning';
import { Link } from '@components/Link';

const Header = memo(({ loading, company, isWorker }) => {
    const history = useHistory();
    const [connectAs] = useMutation(CONNECT_AS);
    const [deleteAccount] = useMutation(DELETE_USER_ACCOUNT);
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = useCallback(async () => {
        const [user] = company?.users || [];
        if (user) {
            setIsDeleting(true);
            message.loading('Deleting User and Account...', 2000);
            await deleteAccount({
                variables: {
                    userId: user.id,
                    companyId: company.id,
                },
            });
            message.destroy();
            message.success('User and Account Deleted');
            setIsDeleting(false);
            history.push(CUSTOMERS);
        }
    }, [company, deleteAccount, history]);
    const handleConnectAs = useCallback(async () => {
        try {
            const response = await connectAs({
                variables: {
                    companyId: company?.id,
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
    }, [company, connectAs, history]);

    const companyBrandWithLogo = company?.brands?.find(brand => brand?.logos?.length > 0);
    const companyBrandLogo = companyBrandWithLogo?.logos?.length > 0 ? companyBrandWithLogo?.logos[0]?.url : null;
    const companyLogo = company?.logo?.url ?? null;
    const accountLogo = companyLogo || companyBrandLogo;
    const timezone = TIMEZONES.find(tz => tz.value === company?.timezone);
    const planStatus = company?.subscription?.status;

    return (
        <Box $w="100%" $h="158" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $p="24" $mb="24" style={{ borderRadius: '10px' }}>
            {loading ? (
                <Box $d="flex" $alignItems="flex-start">
                    <Skeleton $variant="avatar" avatarSize="110" $w="auto" />
                    <Box $px="32" $flex="1 1 0%">
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
                    <Box>
                        <Image src={accountLogo} size={110} isRounded $fontSize={20} name={company?.name} />
                    </Box>
                    <Box $px="32" $flex="1 1 0%">
                        <Box $d="flex" $alignItems="center">
                            <Text $textVariant="H5" $colorScheme="primary" $mr="4">
                                {company?.name}
                            </Text>
                            {!isWorker && !company?.isNotesCleared && company?.notes?.length > 0 && (
                                <Tooltip color="white" title={company?.notes[0]?.text} trigger="hover">
                                    <Box $h="19.52">
                                        <IconWarning />
                                    </Box>
                                </Tooltip>
                            )}
                            <Box
                                as="a"
                                href={STRIPE_CUSTOMER_PROFILE.replace(':customerId', company?.subscription?.paymentMethod?.customer ?? '')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Box as="img" src={stripeLogo} alt="Stripe" />
                            </Box>
                        </Box>
                        <Box $mt="16px" $w="100%" $gap="16px" $d="flex" $alignItems="center" $h="32px">
                            <Box>
                                {planStatus === 'active' && (
                                    <Badge $w="87px" $h="32px" $variant="BillingActive">
                                        Active
                                    </Badge>
                                )}
                                {planStatus === 'paused' && <Badge $variant="BillingPaused">Paused</Badge>}
                                {(planStatus === 'cancelled' || planStatus === 'canceled' || planStatus === 'inactive') && (
                                    <Badge $variant="SubscriptionInactive">Inactive</Badge>
                                )}
                            </Box>
                            <Box $w="1px" $h="28px" style={{ borderRight: '1px solid #d5d6dd' }} />
                            <Box $d="flex">
                                <Text $textVariant="P4" $colorScheme="primary">
                                    <StatusColoredText status={computeStatusFinal(company?.subscription)}>{company?.subscription?.plan?.name}</StatusColoredText>{' '}
                                    -
                                </Text>
                                <Text $textVariant="P4" $colorScheme="secondary">
                                    &nbsp;{_.upperFirst(_.toLower(company?.subscription?.plan?.interval))}
                                </Text>
                            </Box>
                            <Box $w="1px" $h="28px" style={{ borderRight: '1px solid #d5d6dd' }} />
                            <Box $d="flex">
                                <Text $textVariant="P4" $colorScheme={company?.teams?.length > 0 ? 'primary' : 'other-red'}>
                                    Team:{' '}
                                    {company?.teams?.length > 0 ? (
                                        <Text $textVariant="Badge" as={Link} to={MANAGE_TEAM.replace(':id', company?.teams[0]?.id)}>
                                            {company?.teams[0]?.name}
                                        </Text>
                                    ) : (
                                        <Box as="span">Not assigned yet</Box>
                                    )}
                                </Text>
                            </Box>
                            <Box $w="1px" $h="28px" style={{ borderRight: '1px solid #d5d6dd' }} />
                            <Box>
                                {company?.assignedDesigners?.length > 0 && (
                                    <>
                                        <Text $textVariant="P4" $colorScheme="primary" $maxW="420">
                                            {company.assignedDesigners.map((assignedDesigner, index) => {
                                                if (!assignedDesigner?.designer) return null;

                                                const { designer, type } = assignedDesigner;

                                                if (designer?.id && type?.id) {
                                                    return (
                                                        <Text as="span" $colorScheme="primary" key={`${type.id}-${designer.id}`}>
                                                            [{type.name}]{' '}
                                                            <Link to={`/member/${designer.id}`}>
                                                                {designer.firstname} {designer.lastname[0]}
                                                            </Link>
                                                            {index + 1 !== company.assignedDesigners.length ? ', ' : ''}
                                                        </Text>
                                                    );
                                                }

                                                return null;
                                            })}
                                        </Text>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Box $d="flex" $alignItems="center" $mt="16" $gap="30px">
                            {!isWorker && (
                                <Box $d="flex" $alignItems="center">
                                    <Box $colorScheme="secondary" $d="inline-flex" $w="20" $h="20" $alignItems="center" $justifyContent="center" $mr="6">
                                        <CalendarOutlined style={{ fontSize: '16px' }} />
                                    </Box>
                                    <Text $textVariant="P5" $colorScheme="secondary">
                                        Created on {moment(company?.createdAt).format('DD MMM YYYY')}
                                    </Text>
                                </Box>
                            )}
                            {!isWorker && (
                                <Box $d="flex" $alignItems="center">
                                    <Box $colorScheme="secondary" $d="inline-flex" $w="20" $h="20" $alignItems="center" $justifyContent="center" $mr="6">
                                        <MailOutlined style={{ fontSize: '16px' }} />
                                    </Box>
                                    <Text $textVariant="P5" $colorScheme="secondary">
                                        {company?.subscription?.user?.email}
                                    </Text>
                                </Box>
                            )}
                            <Box $d="flex" $alignItems="center">
                                <Box $colorScheme="secondary" $d="inline-flex" $w="20" $h="20" $alignItems="center" $justifyContent="center" $mr="6">
                                    <ClockCircleOutlined style={{ fontSize: '16px' }} />
                                </Box>
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    {timezone ? `${timezone.name}` : company?.timezone ?? '-'}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                    {!isWorker && (
                        <Box $d="flex" $flexDir="column">
                            <Button onClick={handleConnectAs} $w="148px" $h="34">
                                Connect As
                            </Button>
                            {!planStatus && (
                                <Button type="danger" onClick={() => setShowDelete(true)} $mt="10">
                                    Delete Account
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            )}
            <PopupDelete
                title={`Are you sure you want to remove this account?`}
                $variant="delete"
                open={showDelete}
                onOk={handleDeleteAccount}
                onCancel={() => setShowDelete(false)}
                confirmLoading={isDeleting}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    The user has no subscription but this action cannot be undone.
                </Text>
            </PopupDelete>
        </Box>
    );
});

export default Header;
