import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { ALL_PLANS_TO_SUB } from '@graphql/queries/plan';
import { USER_NAME } from '@graphql/queries/user';
import { Radio, RadioGroup } from '@components/Radio';
import OnboardingHeader from '@components/OnboardingHeader';
import { Skeleton } from '@components/Skeleton';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { PLANS } from '@constants/plans';
import { REQUESTS } from '@constants/routes';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import message from '@components/Message';
import DocumentTitle from '@components/DocumentTitle';
import { withResponsive } from '@components/ResponsiveProvider';
import withLoggedUser from '@components/WithLoggedUser';
import Steps from './blocks/Steps';
import OnboardingWizard from './blocks/OnboardingWizard';
import OnboardingCouponForm from './blocks/OnboardingCouponForm';
import ModalPlan from './modals/ModalPlan';
import { FIND_STRIPE_DISCOUNT } from '@graphql/mutations/subscription';
import CloseIcon from '@components/Svg/Close';
import { Button } from '@components/Button';

const Onboarding = memo(({ viewer, windowWidth, refetchViewer }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [selectedPlanName, setSelectedPlanName] = useState('Advanced');
    const [frequency, setFrequency] = useState('MONTHLY');
    const [plansModalVisible, setPlansModalVisible] = useState(false);
    const [referrerData, setReferrerData] = useState(null);
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const referrerId = params.get('referral');
    const verifyId = params.get('verify');
    const planId = params.get('plan');
    const couponCode = params.get('coupon');
    const { loading: referrerLoading, data: referralData } = useQuery(USER_NAME, {
        variables: { id: referrerId },
        skip: !referrerId,
    });
    const { loading: plansLoading, data: plansData } = useQuery(ALL_PLANS_TO_SUB, {fetchPolicy: 'cache-first'});
    const [findStripeDiscount] = useLazyQuery(FIND_STRIPE_DISCOUNT);
    const [step, setStep] = useState(() => {
        if (viewer?.id) {
            return viewer?.company?.onboarding ? viewer.company.onboarding : 2;
        } 
            return verifyId ? 5 : 2;
        
    });

    useEffect(() => {
        if (!plansLoading && !selectedPlan) {
            setSelectedPlan(plansData?.allPlans[0]);
        }
    }, [plansLoading, plansData, selectedPlan]);

    useEffect(() => {
        const localSelectedPlan = localStorage.getItem('localSelectedPlan');
        const localSelectedPromotion = localStorage.getItem('localSelectedPromotion');
        const localFrequency = localStorage.getItem('localFrequency');
        if (localSelectedPlan && localFrequency) {
            const parsedLocalSelectedPlan = JSON.parse(localSelectedPlan);
            setSelectedPlan(parsedLocalSelectedPlan);
            setSelectedPlanName(parsedLocalSelectedPlan?.name);
            setFrequency(localFrequency);
        }
        if (localSelectedPromotion && !referrerId) {
            setSelectedPromotion(JSON.parse(localSelectedPromotion));
        }
    }, [referrerId]);

    useEffect(() => {
        if (step <= 3 && selectedPlan) {
            localStorage.setItem('localSelectedPlan', JSON.stringify(selectedPlan));
            localStorage.setItem('localSelectedPromotion', JSON.stringify(selectedPromotion));
            localStorage.setItem('localFrequency', frequency);
        }
    }, [selectedPlan, selectedPromotion, frequency, step]);

    useEffect(() => {
        const localSelectedPromotion = localStorage.getItem('localSelectedPromotion');
        if (!referrerLoading) {
            if (referralData?.User) {
                setReferrerData(referralData?.User);
                setSelectedPromotion(null);
            } else {
                if (referrerId && !referralData?.User) {
                    if (localSelectedPromotion) {
                        setSelectedPromotion(JSON.parse(localSelectedPromotion));
                    }
                    message.destroy();
                    message.error('Your referral is invalid');
                }
            }
        }
    }, [referrerLoading, referralData, referrerId]);

    useEffect(() => {
        if (selectedPromotion) {
            const ref = params.get('ref')
            if (ref) {
                window.history.pushState('', '', `/onboard?ref=${ref}`);
            } else {
                window.history.pushState('', '', '/onboard');
            }
            setReferrerData(null);
        }
    }, [selectedPromotion, params]);

    const findPlan = useCallback(
        (newFrequency, newSelectedPlanName) =>
            plansData?.allPlans.find(plan => plan.interval === newFrequency && plan.name === newSelectedPlanName),
        [plansData]
    );

    useEffect(() => {
        if (planId) {
            const [planName, planInterval] = planId.split('_');
            if (planName && planInterval) {
                const foundPlan = findPlan(planInterval.toUpperCase(), planName.split('_').join(' '));
                if (foundPlan) {
                    setSelectedPlanName(planName);
                    setSelectedPlan(foundPlan);
                    setFrequency(planInterval.toUpperCase())
                }
            }
        }
    }, [planId, findPlan]);

    const handleCoupon = useCallback(
        async value => {
            try {
                const stripeDiscount = await findStripeDiscount({
                    variables: {
                        code: value,
                    },
                });
                const promotion = {
                    name: stripeDiscount?.data?.findStripeDiscount?.name,
                    couponValue: stripeDiscount?.data?.findStripeDiscount?.value,
                    couponType: !stripeDiscount?.data?.findStripeDiscount?.percent ? 'amount' : 'percent',
                    id: stripeDiscount?.data?.findStripeDiscount?.id,
                    enteredCode: value,
                };
               
                message.destroy();
                if (promotion.name) {
                    setSelectedPromotion(promotion);
                    message.success('Coupon successfully applied');
                } else {
                    message.error('Coupon not valid');
                }
            } catch (error) {
                console.log('Error while applying coupon', error);
                message.destroy();
                message.error(error.message.replace('GraphQL error: ', '') ?? 'Error while applying coupon');
            }
        },
        [findStripeDiscount]
    );

    useEffect(() => {
        if (couponCode) {
            handleCoupon(couponCode);
        }
    }, [couponCode, handleCoupon]);

    const goNextStep = useCallback(() => {
        setStep(step + 1);
    }, [step]);

    const handleFrequency = e => {
        const newFrequency = e.target.value;
        const newSelectedPlan = findPlan(newFrequency, selectedPlanName);
        setFrequency(newFrequency);
        setSelectedPlan(newSelectedPlan);

        if (newFrequency !== 'MONTHLY') {
            setSelectedPromotion(null);
        } else {
            setSelectedPromotion(JSON.parse(localStorage.getItem('localSelectedPromotion')));
        }
    };

    const handleShowPlansModal = () => {
        setPlansModalVisible(!plansModalVisible);
    };

    const onConfirmChangePlan = useCallback(
        planSelected => {
            const newSelectedPlan = findPlan(frequency, planSelected);
            setSelectedPlanName(planSelected);
            setSelectedPlan(newSelectedPlan);
            setSelectedPromotion(null);
            setPlansModalVisible(false);
        },
        [findPlan, frequency]
    );

    const calculPromotion = useMemo(
        () =>
            selectedPromotion
                ? selectedPromotion.couponType === 'amount'
                    ? (selectedPromotion.couponValue ?? 0)
                    : ((selectedPromotion.couponValue ?? 0) * selectedPlan.price) / 100
                : 0,
        [selectedPlan, selectedPromotion]
    );

    const calculTotal = useMemo(() => {
        const pricePlan = selectedPlan ? selectedPlan.price : 0;
       
        const referralReduction = referrerData?.id ? 100 : 0;
        console.log(pricePlan, referralReduction, calculPromotion, selectedPromotion)
        return pricePlan - calculPromotion - referralReduction;
    }, [selectedPlan, calculPromotion, referrerData]);

    if (viewer?.activated && viewer?.company?.subscription?.id) {
        return <Redirect to={REQUESTS} />;
    }

    return (
        <DocumentTitle title="Onboarding | ManyPixels">
            <OnboardingHeader />
            <Box $pt="60">
                <Box $d={['block', 'flex']}>
                    <Box $flex="1 1 0%" $px={['16', '20']} $pt="20" $pb="30">
                        <Box $d={windowWidth > 1279 ? 'block' : 'none'}>
                            <Steps indexStep={step} />
                        </Box>
                        <OnboardingWizard
                            step={step}
                            goNextStep={goNextStep}
                            selectedPlan={selectedPlan}
                            selectedPromotion={selectedPromotion}
                            frequency={frequency}
                            total={calculTotal}
                            referrerData={referrerData}
                            referrerLoading={referrerLoading}
                            windowWidth={windowWidth}
                            viewer={viewer}
                            verifyId={verifyId}
                            refetchViewer={refetchViewer}
                        />
                    </Box>
                    <Box $px={['16', '30']} $py="30" $bg="bg-gray" $w={['100%', '430']} $minH={['auto', '93vh']}>
                        {plansLoading ? (
                            <>
                                <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="19">
                                    <Skeleton $w="95" $h="20" />
                                    <Skeleton $w="106" $h="20" />
                                </Box>
                                <Skeleton $w="156" $h="24" $mb="21" />
                                <hr />
                                <Box $pt="24" $pb="29">
                                    <Skeleton $w="230" $h="20" $mb="18" />
                                    <Skeleton $w="180" $h="16" $mb="18" />
                                    <Skeleton $w="180" $h="16" $mb="18" />
                                    <Skeleton $w="180" $h="16" $mb="18" />
                                    <Skeleton $w="180" $h="16" $mb="18" />
                                    <Skeleton $w="180" $h="16" />
                                </Box>
                                <hr />
                                <Box $pt="22" $pb="22">
                                    <Skeleton $w="100%" $h="16" $mb="28" />
                                    <Skeleton $w="100%" $h="16" $mb="28" />
                                    <Skeleton $w="100%" $h="16" />
                                </Box>
                                <hr />
                                <Box $pt="20" $pb="20">
                                    <Skeleton $w="100%" $h="40" />
                                </Box>
                                <hr />
                                <Box $pt="22">
                                    <Skeleton $w="100%" $h="16" $mb="20" />
                                    <Skeleton $w="100%" $h="16" />
                                </Box>
                            </>
                        ) : (
                            <>
                                <ModalPlan
                                    visible={plansModalVisible}
                                    plans={plansData?.allPlans?.filter(plan => plan.name !== 'DAILY_OUTPUT')}
                                    frequency={frequency}
                                    selectedPlanName={selectedPlanName}
                                    onConfirm={onConfirmChangePlan}
                                    onCancel={handleShowPlansModal}
                                    windowWidth={windowWidth}
                                    modalOnRegistration={true}
                                />
                                <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="5">
                                    <Text $textVariant="H5" $colorScheme="primary">
                                        Your plan
                                    </Text>
                                    {step < 4 && (
                                        <Text
                                            $textVariant="PrimaryButton"
                                            $colorScheme="cta"
                                            $cursor="pointer"
                                            onClick={handleShowPlansModal}
                                        >
                                            Change plan
                                        </Text>
                                    )}
                                </Box>
                                <Text $textVariant="H4" $colorScheme="other-pink" $mb="20">
                                    {selectedPlanName}
                                </Text>
                                <hr />
                                <Box $py="20">
                                    {selectedPlan?.featuresTitle && (
                                        <Text $textVariant="Button" $colorScheme="primary" $mb="11">
                                            {selectedPlan?.featuresTitle}
                                        </Text>
                                    )}
                                    <Box>
                                        {selectedPlan?.features.map((feature, indexFeature) => (
                                            <Box
                                                key={`${feature}-${indexFeature}`}
                                                $d="flex"
                                                $alignItems="center"
                                                $mb={selectedPlan?.features.length - 1 === indexFeature ? '0' : '16'}
                                            >
                                                
                                                <Box $w="8" $h="8" $bg="other-yellow" $mr="16" />
                                                {selectedPlan?.tooltips && selectedPlan?.tooltips[feature] ? (
                                                    <>
                                                        <TooltipIconBlock
                                                            label={feature}
                                                            tooltip={selectedPlan?.tooltips[feature]}
                                                            $textVariant="P4"
                                                            $colorScheme="primary"
                                                        />
                                                        <Text hide="desktop" $textVariant="P4" $colorScheme="primary">
                                                            {feature}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <Text $textVariant="P4" $colorScheme="primary">
                                                        {feature}
                                                    </Text>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                {step < 4 && (
                                    <Box>
                                        <hr />
                                        <Box $py="20">
                                            <RadioGroup onChange={handleFrequency} value={frequency}>
                                                {PLANS.map(plan => {
                                                    const planType = plansData?.allPlans.find(
                                                        p => p.name === selectedPlanName && p.interval === plan.name
                                                    );

                                                    const price = planType?.price || 0;

                                                    let monthlyRate;
                                                    switch (plan.name) {
                                                        case 'YEARLY':
                                                            monthlyRate = price / 12;
                                                            break;
                                                        case 'BIANNUALLY':
                                                            monthlyRate = price / 6;
                                                            break;
                                                        case 'QUARTERLY':
                                                            monthlyRate = price / 3;
                                                            break;
                                                        case 'MONTHLY':
                                                            monthlyRate = price;
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    const formattedMonthlyRate =
                                                        monthlyRate % 1 !== 0 ? monthlyRate.toFixed(2) : monthlyRate;

                                                    return (
                                                        <Radio key={plan.name} value={plan.name}>
                                                            <Box
                                                                $d="flex"
                                                                $justifyContent="space-between"
                                                                $alignItems="center"
                                                            >
                                                                <Box $d="flex" $alignItems="center">
                                                                    <Text
                                                                        $textVariant="P4"
                                                                        $colorScheme="primary"
                                                                        $mr="10"
                                                                    >
                                                                        {`Billed ${plan.name.toLowerCase()}`}
                                                                    </Text>
                                                                    {plan.reduction && (
                                                                        <Text
                                                                            $textVariant="SmallTitle"
                                                                            $colorScheme={plan.colorScheme}
                                                                        >{`SAVE ${plan.reduction}%`}</Text>
                                                                    )}
                                                                </Box>
                                                                <Text $textVariant="P4" $colorScheme="primary">
                                                                    {`$${formattedMonthlyRate} / m`}
                                                                </Text>
                                                            </Box>
                                                        </Radio>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </Box>
                                        {frequency === 'MONTHLY' && (
                                            <>
                                                <hr />
                                                <Box $py="20">
                                                    <OnboardingCouponForm
                                                        referrerId={referrerData?.id}
                                                        handleCoupon={handleCoupon}
                                                        initialCoupon={couponCode}
                                                    />
                                                </Box>
                                            </>
                                        )}
                                        <Box>
                                            {referrerData?.id && !selectedPromotion && (
                                                <Box
                                                    $d="flex"
                                                    $justifyContent="space-between"
                                                    $alignItems="center"
                                                    $mb="15"
                                                >
                                                    <Text $textVariant="P4" $colorScheme="secondary">
                                                        Referral bonus
                                                    </Text>
                                                    <Text $textVariant="P4" $colorScheme="primary">
                                                        -$100
                                                    </Text>
                                                </Box>
                                            )}
                                            {selectedPromotion && (
                                                <>
                                                    <Box
                                                        $d="flex"
                                                        $justifyContent="space-between"
                                                        $alignItems="center"
                                                        $mb="15"
                                                    >
                                                        <Text $textVariant="P4" $colorScheme="secondary">
                                                            {selectedPromotion?.enteredCode || selectedPromotion.name}
                                                        </Text>
                                                        <Button
                                                            icon={<CloseIcon />}
                                                            onClick={() => {
                                                                setSelectedPromotion(null)
                                                                message.success('Coupon removed')
                                                            }}
                                                                
                                                            type="ghost"
                                                        />
                                                    </Box>
                                                    <hr />
                                                </>
                                            )}
                                                
                                            <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mt="20">
                                                <Text $textVariant="H5" $colorScheme="primary">
                                                    Billed today
                                                </Text>
                                                <Text $textVariant="H4" $colorScheme="cta">{`$${calculTotal.toLocaleString()}`}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </DocumentTitle>
    );
});

export default withResponsive(withLoggedUser(Onboarding));
