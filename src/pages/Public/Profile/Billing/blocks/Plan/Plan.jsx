import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import { EDIT_PLAN } from '@constants/routes';
import PauseCancelModal from './modals/PauseCancelModal';
import PauseSelectModal from './modals/PauseSelectModal';
import ConfirmationModal from './modals/ConfirmationModal';
import CancelSubsModal from './modals/CancelSubsModal';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
import { ALL_PLANS_TO_SUB } from '@graphql/queries/plan';
import { PAUSE_PLAN, CANCEL_PLAN } from '@graphql/mutations/plan';
import { ACCEPT_CANCELLATION_PROMOTION } from '@graphql/mutations/subscription';
import { useHistory } from 'react-router-dom';

const PauseConfirmModal = ConfirmCancelModal;

const Plan = memo(({ planStatus, plan, refetch, hasEnded, endedAt, isPromoUsed }) => {
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const [pausePlan] = useMutation(PAUSE_PLAN);
    const [cancelPlan] = useMutation(CANCEL_PLAN);
    const { data } = useQuery(ALL_PLANS_TO_SUB, {
        variables: {
            interval: 'MONTHLY',
        },
    });

    const [pauseType, setPauseType] = useState();

    const history = useHistory();

    const [acceptCancellationPromotion] = useMutation(ACCEPT_CANCELLATION_PROMOTION);
    const [isPauseCancelModalVisible, setIsPauseCancelModalVisible] = useState(false);
    const [isPauseSelectModalVisible, setIsPauseSelectModalVisible] = useState(false);
    const [isCancelSubsModalVisible, setIsCancelSubsModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isConfirmCancelModalVisible, setIsConfirmCancelModalVisible] = useState(false);
    const [isPauseReasonModalVisible, setIsPauseReasonModalVisible] = useState(false);
    const [confirmationModalTitle, setConfirmationModalTitle] = useState('');
    const [confirmationModalDescription, setConfirmationModalDescription] = useState('');
    // const [isResuming, setIsResuming] = useState(false);
    const handlePauseCancelModalVisible = () => {
        setIsPauseCancelModalVisible(!isPauseCancelModalVisible);
    };

    const handlePauseSelectModalVisible = () => {
        setIsPauseSelectModalVisible(!isPauseSelectModalVisible);
    };

    const handleConfirmationModalVisible = () => {
        setIsConfirmationModalVisible(!isConfirmationModalVisible);
    };

    const handleCancelSubsModalVisible = () => {
        setIsCancelSubsModalVisible(!isCancelSubsModalVisible);
    };

    const handleConfirmCancelModalVisible = () => {
        setIsConfirmCancelModalVisible(!isConfirmCancelModalVisible);
    };

    const handleCancelSubs = () => {
        setIsPauseCancelModalVisible(false);
        setIsCancelSubsModalVisible(true);
    };

    const handleCancelAnyway = () => {
        setIsCancelSubsModalVisible(false);
        setIsConfirmCancelModalVisible(true);
        setIsPauseCancelModalVisible(false);
    };

    const handlePauseSelectModalSubs = () => {
        setIsPauseCancelModalVisible(false);
        setIsPauseSelectModalVisible(true)
    }

    const handlePauseSubs = useCallback(async (variables) => {
        await pausePlan({ variables });
        if (mountedRef.current) {
            setConfirmationModalTitle('Your subscription is now on pause.');
            setConfirmationModalDescription('');
            setIsPauseReasonModalVisible(false);
            setIsConfirmationModalVisible(true);
        }
    }, [pausePlan,]);

    const handlePauseLaterSubs = useCallback(async (variables) => {
        await pausePlan({ variables: { delayed: true, ...variables } });
        if (mountedRef.current) {
            setConfirmationModalTitle('Your subscription will go on pause at the end of your billing cycle');
            setConfirmationModalDescription('');
            setIsPauseReasonModalVisible(false);
            setIsConfirmationModalVisible(true);
        }
    }, [pausePlan]);

    const handleConfirmCancel = useCallback(async values => {
        await cancelPlan({ variables: values });
        if (mountedRef.current) {
            setConfirmationModalTitle('Your subscription has been cancelled');
            setConfirmationModalDescription(
                'You will still be able to use the service until the end of your billing cycle.'
            );
            setIsConfirmCancelModalVisible(false);
            setIsConfirmationModalVisible(true);
            await refetch();
        }
    }, [cancelPlan, refetch]);

    const handleAcceptOffer = useCallback(async planId => {
        await acceptCancellationPromotion({
            variables: { planId },
        });
        if (mountedRef.current) {
            setConfirmationModalTitle('Congratulations! 30% off discount claimed');
            setConfirmationModalDescription(
                'Awesome! Thank you for staying with us. The discount has been applied to your subscription for the next 2 months. Enjoy!'
            );
            setIsCancelSubsModalVisible(false);
            setIsConfirmationModalVisible(true);
            await refetch();
        }
    }, [acceptCancellationPromotion, refetch]);

    const handleResumeSubs = useCallback(async () => {
        history.push('/edit-plan')
    }, [history]);

    const handlePauseType = useCallback(async (variables) => {
        if (pauseType === 'now') {
            handlePauseSubs(variables)
        } else {
            handlePauseLaterSubs(variables)
        }
    }, [pauseType, handlePauseSubs, handlePauseLaterSubs])

    return (
        <>
            <ConfirmCancelModal
                visible={isConfirmCancelModalVisible}
                onCancel={handleConfirmCancelModalVisible}
                onConfirmCancel={handleConfirmCancel}
            />
            <PauseConfirmModal
                visible={isPauseReasonModalVisible}
                onCancel={() => setIsPauseReasonModalVisible(false)}
                onConfirmCancel={handlePauseType}
                isCancelling={false}
                refetch={refetch}
            />
            <CancelSubsModal
                visible={isCancelSubsModalVisible}
                onCancel={handleCancelSubsModalVisible}
                onCancelAnyway={handleCancelAnyway}
                onAcceptOffer={handleAcceptOffer}
                dataPlans={data}
                currentPlan={plan}
            />
            <ConfirmationModal
                open={isConfirmationModalVisible}
                onCancel={handleConfirmationModalVisible}
                title={confirmationModalTitle}
                desc={confirmationModalDescription}
            />
            <PauseCancelModal
                visible={isPauseCancelModalVisible}
                onCancel={handlePauseCancelModalVisible}
                onCancelSubs={isPromoUsed || plan?.interval === 'QUARTERLY' || plan?.interval === 'YEARLY' ? handleCancelAnyway : handleCancelSubs}
                onPauseSelectModalSubs={handlePauseSelectModalSubs}
                planStatus={planStatus}
            />
            <PauseSelectModal
                visible={isPauseSelectModalVisible}
                onCancel={handlePauseSelectModalVisible}
                onPauseSubs={() => {
                    setPauseType('now')
                    setIsPauseReasonModalVisible(true)
                    setIsPauseSelectModalVisible(false)
                }}
                onPauseLaterSubs={() => {
                    setPauseType('later')
                    setIsPauseReasonModalVisible(true)
                    setIsPauseSelectModalVisible(false);
                }}
                planStatus={planStatus}
            />
            <Box $mb={['20', '32']}>
                <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                    Plan
                </Text>
                <Box $d="flex" $mb="16">
                    <Box $mr="41">
                        <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                            Status
                        </Text>
                        <Box>
                            {(planStatus === 'active' && !endedAt) && (
                                <Badge $variant="BillingActive" $h="32" $minW="87">Active</Badge>
                            )}
                            {planStatus === 'paused' && <Badge $variant="BillingPaused">Paused</Badge>}
                            {(planStatus === 'cancelled' || planStatus === 'canceled' || planStatus === 'inactive') && (
                                <Badge $variant="SubscriptionInactive" $h="32" $minW="87">Inactive</Badge>
                            )}
                            {(planStatus === 'active' && endedAt) && (
                                <Badge $variant="BillingActive" $h="32" $minW="87">Active</Badge>
                            )}
                        </Box>
                    </Box>
                    {(planStatus === 'active' || (planStatus === 'canceled' && !hasEnded)) && (
                        <Box>
                            <Text $textVariant="P4" $colorScheme="secondary" $mb="13">
                                Plan
                            </Text>
                            {plan?.name === 'DAILY_OUTPUT' ? `${plan?.dailyOutput} Daily Output` : plan?.name}
                        </Box>
                    )}
                </Box>
                <Box $d="flex" $alignItems="center" hide="mobile">
                    <Box $mr="14">
                        {(planStatus === 'active' || planStatus === 'inactive') && !endedAt && (
                            <Link to={EDIT_PLAN}>
                                <Button type="primary" $h="44" $fontSize="12">
                                    {planStatus === 'active' && !endedAt ? 'Edit Plan' : 'Subscribe'}
                                </Button>
                            </Link>
                        )}
                        {(planStatus === 'active' || planStatus === 'inactive') && endedAt && (
                            <Link to={EDIT_PLAN}>
                                <Button type="primary" $h="44" $fontSize="12">
                                    Subscribe
                                </Button>
                            </Link>
                        )}

                        {(planStatus === 'paused' || planStatus === 'willPause') && (
                            <Link to={EDIT_PLAN}>
                                <Button type="primary" $h="44" $fontSize="12">
                                    Subscribe
                                </Button>
                            </Link>
                        )}
                    </Box>
                    <Box>
                        {(planStatus === 'active' || planStatus === 'paused' || planStatus === 'willPause') && !endedAt && (
                            <Button $h="44" $fontSize="12" type="default" onClick={handlePauseCancelModalVisible}>
                                {planStatus === 'active' ? 'Pause / Cancel Subscription' : 'Cancel Subscription'}
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box hide="desktop">
                    <Box $mb="10">
                        {(planStatus === 'active' || planStatus === 'paused' || planStatus === 'willPause') && !endedAt && (
                            <Button
                                $h="44"
                                $fontSize="12"
                                type="default"
                                onClick={handlePauseCancelModalVisible}
                                $w="100%"
                            >
                                {planStatus === 'active' ? 'Pause / Cancel Subscription' : 'Cancel Subscription'}
                            </Button>
                        )}
                    </Box>
                    <Box>
                        {(planStatus === 'active' || planStatus === 'inactive') && !!endedAt && (
                            <Link to={EDIT_PLAN}>
                                <Button $h="44" $fontSize="12" type="primary" $w="100%">
                                    {planStatus === 'active' ? 'Edit Plan' : 'Subscribe'}
                                </Button>
                            </Link>
                        )}
                        {planStatus === 'paused' && planStatus === 'willPause' && (
                            <Button
                                $h="44"
                                $fontSize="12"
                                type="primary"
                                onClick={handleResumeSubs}
                                $w="100%"
                            >
                                Resume subscription
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
});

export default Plan;
