import React, { memo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import withLoggedUser from '@components/WithLoggedUser';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { LoadingWithLogo } from '@components/LoadingWithLogo';
import { withResponsive } from '@components/ResponsiveProvider';
import DocumentTitle from '@components/DocumentTitle';
import { PLANS_REVERSE } from '@constants/plans';
import { BILLING } from '@constants/routes';
import { ME_SUBSCRIPTION } from '@graphql/queries/userConnected';
import { ALL_PLANS_TO_SUB } from '@graphql/queries/plan';
import { usdFormatter } from '@constants/utils';
import UpdatedPlanSummary from './UpdatedPlanSummary';
import { DailyOutputSlider } from './DailyOutputSlider';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import canvaLogo from '@public/assets/icons/canva.png';
import figmaLogo from '@public/assets/icons/figma.png';
import multiLogo from '@public/assets/icons/multi.png';
import { CheckOutlined, LockOutlined } from '@ant-design/icons';
import { Skeleton } from '@components/Skeleton';
import { COLOR_CTA, COLOR_TEXT_TERTIARY } from '@components/Theme';

const CATEGORIES = [
    'Graphic Design',
    'Web Design',
    'Illustrations',
    'Motion graphics',
    'Video Editing',
]

const calculatePricePerMonth = (frequency, price) => {
    let monthlyPrice = price;
    switch (frequency) {
        case 'QUARTERLY':
            monthlyPrice = price / 3;
            break;
        case 'BIANNUALLY':
            monthlyPrice = price / 6;
            break;
        case 'YEARLY':
            monthlyPrice = price / 12;
            break;
        default:
            monthlyPrice = price;
            break;
    }
    return monthlyPrice % 1 === 0 ? monthlyPrice : parseFloat(monthlyPrice).toFixed(2);
};

const handlePriceUnit = value => {
    let priceUnit;
    switch (value) {
        case 'MONTHLY': {
            priceUnit = 'mo';
            break;
        }
        case 'QUARTERLY': {
            priceUnit = 'qtr';
            break;
        }
        case 'BIANNUALLY': {
            priceUnit = 'bn';
            break;
        }
        case 'YEARLY': {
            priceUnit = 'yr';
            break;
        }
        default:
            break;
    }

    return priceUnit;
};

const EditPlan = memo(({ windowWidth }) => {
    const [frequency, setFrequency] = useState('MONTHLY'); // Should be based from data
   // const selectedPlan = 'prebuilt';
    const [selectedPlan, setSelectedPlan] = useState('prebuilt');
    const [preBuiltPlan, setPreBuiltPlan] = useState(null);
    const [preBuiltPlanName, setPreBuiltPlanName] = useState(null);
    const [customPlan, setCustomPlan] = useState();
    const [dailyOutput, setDailyOutput] = useState();
    const [currentPlanFrequency, setCurrentPlanFrequency] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const { loading: plansLoading, data: plansData } = useQuery(ALL_PLANS_TO_SUB);
    const { data: subscriptionData } = useQuery(ME_SUBSCRIPTION, {
        variables: {},
    });

    const subscription = subscriptionData?.user?.company?.subscription
    const plan = subscription?.status === 'inactive' ? null : subscription?.plan;

    useEffect(() => {
        if (plan) {
            const subscribedPlanName = plan?.name;
            const _frequency = plan?.interval;
            if (subscribedPlanName) {
                setCurrentPlan(subscribedPlanName);
                setCurrentPlanFrequency(_frequency);
                setFrequency(_frequency);
            }
        }
    }, [plan]);

    const handleChangeFrequency = useCallback(
        value => {
            if (selectedPlan === 'custom') {
                const selectedCustomPlan = plansData?.allPlans.find(
                    _plan => _plan.dailyOutput === dailyOutput && _plan.name === 'DAILY_OUTPUT' && _plan.interval === value
                );
                setCustomPlan(selectedCustomPlan);
            }
            setFrequency(value);
        },
        [selectedPlan, dailyOutput, plansData]
    );
    // Commenting this out as we will add custom plans later
    const handleChangePlans = value => {
         setSelectedPlan(value);
    };

    const findPlan = (newFrequency, newSelectedPlanName) =>
        plansData?.allPlans.find(_plan => _plan.interval === newFrequency && _plan.name === newSelectedPlanName);

    const handleChangePreBuiltPlan = value => {
        const newSelectedPlan = findPlan(frequency, value);
        setPreBuiltPlan(newSelectedPlan);
        setPreBuiltPlanName(value);
    };

    const handleChangeDailyOutput = value => {
        const selectedCustomPlan = plansData?.allPlans.find(
            _plan => _plan.dailyOutput === value && _plan.name === 'DAILY_OUTPUT' && _plan.interval === frequency
        );
        setDailyOutput(value);
        setCustomPlan(selectedCustomPlan);
    };

    const isStatusCanceled = subscription?.status === 'canceled';

    const checkIfCurrentPlan = value => {
        let planStatus = currentPlan === value && currentPlanFrequency === frequency && !isStatusCanceled
            ? 'Current plan'
            : 'Select Plan';
        if (subscriptionData?.user?.company?.subscription?.endAt) {
            planStatus = 'Select Plan';
        }
        if (subscriptionData?.user?.company?.subscription?.status === 'paused') {
            planStatus = 'Select Plan';
        }
        return planStatus
    }

    const handleWebFlowClick = () => {
        if (window && window.HubSpotConversations && window.HubSpotConversations.widget) {
            const status = window.HubSpotConversations.widget.status();
            if (status.loaded) {
                window.HubSpotConversations.widget.open();
            }
        }
    }

    if (plansLoading) {
        return (
            <DocumentTitle title="Edit Plan | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1200">
                    <Box $d={{ xs: 'block', sm: 'block', md: 'block', lg: 'flex', xl: 'flex', xxl: 'flex' }}>
                        <Box $pos="absolute" $left="-56px" $d={windowWidth > 1044 ? 'block' : 'none'} $w="56" $pt="5" $radii="10">
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                as={Link}
                                to={BILLING}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        </Box>
                        <Box $flex="1 1 0%">
                            <Box $d="flex" $alignItems="center" $mb="15">
                                <Box $d={windowWidth > 1044 ? 'none' : 'block'} $mr="14" $radii="10">
                                    <Button
                                        $w="36"
                                        $h="36"
                                        mobileH="36"
                                        type="default"
                                        className="ant-btn ant-btn-default"
                                        as={Link}
                                        to={BILLING}
                                        icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                    />
                                </Box>
                                <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                                    Edit plan
                                </Text>
                                <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                                    Billing
                                </Text>
                            </Box>
                            <Box $d={['none', 'block']}>
                                <Breadcrumb>
                                    <BreadcrumbItem isFirst as={Link} to={BILLING}>
                                        Billing
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>Edit plan</BreadcrumbItem>
                                </Breadcrumb>
                            </Box>
                            <Box
                        $d={{ xs: 'block', sm: 'block', md: 'block', lg: 'flex', xl: 'flex', xxl: 'flex' }}
                        $justifyContent="space-between"
                        $mt="30"
                    >
                        <Box $flex="1 1 auto">
                            <Box $d="flex" $justifyContent="space-between" $gap="60px">
                                <Box $w="100%" $maxW="800px">
                                    <Skeleton $w="100%" $maxW="325" $h="20" $mb="44" />
                                    <Skeleton $w="100%" $maxW="568px" $h="44" $mb="30" />
                                    <Box $d="flex" $gap="82px" $mb="20">
                                        <Skeleton $w="134" $h="20" />
                                        <Skeleton $w="134" $h="20" />
                                    </Box>
                                    {Array.from({ length: 3 }, (_, i) => (
                                        <Box $d="flex" $mb="20px" $flexDir="column" $border="1px solid #D5D6DD" style={{borderRadius:'10px'}} $pl="16px" $pr="16px">
                                            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mt="23px" $mb="23px">
                                                <Box>
                                                    <Skeleton $w="99" $h="20" $mb="12px" />
                                                    <Skeleton $w="121" $h="20" />
                                                </Box>
                                                <Skeleton $w="152" $h="40" />
                                            </Box>
                                            <Box $d="flex" $flexWrap="wrap" $gap="20px 48px" $pt="22px" style={{borderTop:'1px solid #D5D6DD'}} $mb="22px">
                                                <Skeleton $w="142" $h="16" />
                                                <Skeleton $w="145" $h="16" />
                                                <Skeleton $w="128" $h="16" />
                                                <Skeleton $w="130" $h="16" />
                                                <Skeleton $w="163" $h="16" />
                                                <Skeleton $w="131" $h="16" />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Box $w="320px" style={window.innerWidth < 900 ? { display: "none"} : {}} >
                                    <Skeleton $w="136" $h="20" $mb="20" />
                                    <Skeleton $w="100%" $h="40" $mb="22" />
                                    <Skeleton $w="104" $h="16" $mb="24" />
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="4px" >
                                        <Skeleton $w="58" $h="16" />
                                        <Skeleton $w="58" $h="16" />
                                    </Box>
                                    <Skeleton $w="70" $h="16" $mb="22px" />
                                    <Box style={{borderTop:'1px solid #D5D6DD'}} $pt="22px" $mb="22px">
                                        <Skeleton $w="100%" $h="16" $mb="32px" />
                                        <Skeleton $w="100%" $h="40" />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                        </Box>
                    </Box>
                    </PageContainer>
                </Basepage>
            </DocumentTitle>
        )
    }
    

    return (
        <DocumentTitle title="Edit Plan | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1200">
                    <Box $d={{ xs: 'block', sm: 'block', md: 'block', lg: 'flex', xl: 'flex', xxl: 'flex' }}>
                        <Box $pos="absolute" $left="-56px" $d={windowWidth > 1044 ? 'block' : 'none'} $w="56" $pt="5" $radii="10">
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                as={Link}
                                to={BILLING}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        </Box>
                        <Box $flex="1 1 0%">
                            <Box $d="flex" $alignItems="center" $mb="15">
                                <Box $d={windowWidth > 1044 ? 'none' : 'block'} $mr="14" $radii="10">
                                    <Button
                                        $w="36"
                                        $h="36"
                                        mobileH="36"
                                        type="default"
                                        className="ant-btn ant-btn-default"
                                        as={Link}
                                        to={BILLING}
                                        icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                    />
                                </Box>
                                <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                                    Edit plan
                                </Text>
                                <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                                    Billing
                                </Text>
                            </Box>
                            <Box $d={['none', 'block']}>
                                <Breadcrumb>
                                    <BreadcrumbItem isFirst as={Link} to={BILLING}>
                                        Billing
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>Edit plan</BreadcrumbItem>
                                </Breadcrumb>
                            </Box>
                            <Box
                                $d={{ xs: 'block', sm: 'block', md: 'block', lg: 'flex', xl: 'flex', xxl: 'flex' }}
                                $justifyContent="space-between"
                                $mt="30"
                            >
                                <Box $flex="1 1 auto" $mr={{ xs: '0', sm: '0', md: '0', lg: '32', xl: '32', xxl: '32' }} $maxW="800">
                                    <Text $textVariant="H5" $colorScheme="headline" $mb="17">
                                        Select billing frequency and plan
                                    </Text>
                                    <Box $w={{ xs: '100%', sm: '100%', md: '100%', lg: '568', xl: '568', xxl: '568' }}>
                                        <Box $d="flex" $alignItems="center" $mb="30" $w="100%">
                                        {PLANS_REVERSE.map((plan, planIndex) => (
                                                <Box key={planIndex}>
                                                    <Text
                                                        $flex="1 1 0%"
                                                        $textAlign="center"
                                                        $textVariant={{
                                                            xs: 'SmallNotification',
                                                            sm: 'SmallTitle',
                                                            md: 'SmallTitle',
                                                            lg: 'SmallTitle',
                                                            xl: 'SmallTitle',
                                                            xxl: 'SmallTitle',
                                                        }}
                                                        $colorScheme={plan.colorScheme}
                                                        $mb="6"
                                                    >
                                                        {plan.reduction ? `SAVE ${plan.reduction}%` : <br />}
                                                    </Text>
                                                    <Box
                                                        $p="1"
                                                        $cursor="pointer"
                                                        $borderT="1"
                                                        $borderB="1"
                                                        $borderL={planIndex === 0 ? '1' : '0'}
                                                        $borderR={planIndex === PLANS_REVERSE.length - 1 ? '1' : '0'}
                                                        $borderStyle="solid"
                                                        $radii={planIndex === 0 ? '10px 0 0 10px' : (planIndex === PLANS_REVERSE.length - 1 ? '0 10px 10px 0' : '0')}
                                                        $borderColor="outline-gray"
                                                    >
                                                        <Text
                                                            $textVariant={{
                                                                xs: 'SmallNotification',
                                                                sm: 'H6',
                                                                md: 'H6',
                                                                lg: 'H6',
                                                                xl: 'H6',
                                                                xxl: 'H6',
                                                            }}
                                                            $colorScheme={frequency === plan.name ? 'white' : 'primary'}
                                                            $bg={frequency === plan.name ? 'cta' : 'transparent'}
                                                            $px={{
                                                                xs: '14',
                                                                sm: '14',
                                                                md: '14',
                                                                lg: '32',
                                                                xl: '32',
                                                                xxl: '32',
                                                            }}
                                                            $py={{
                                                                xs: '12',
                                                                sm: '10',
                                                                md: '10',
                                                                lg: '10',
                                                                xl: '10',
                                                                xxl: '10',
                                                            }}
                                                            $radii={planIndex === 0 ? '10px 0 0 10px' : (planIndex === PLANS_REVERSE.length - 1 ? '0 10px 10px 0' : '0')}
                                                            $flex="1 1 0%"
                                                            $textAlign="center"
                                                            onClick={() => handleChangeFrequency(plan.name)}
                                                        >
                                                            {plan.name}
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                
                                    {/* <Box $d="flex" $alignItems="center" $mb="20">
                                        <Box $w="211">
                                            <Radio
                                                value="prebuilt"
                                                checked={selectedPlan === 'prebuilt'}
                                                onClick={() => handleChangePlans('prebuilt')}
                                            >
                                                Prebuilt plans
                                            </Radio>
                                        </Box>
                                        <Box $w="211">
                                            <Radio
                                                value="custom"
                                                checked={selectedPlan === 'custom'}
                                                onClick={() => handleChangePlans('custom')}
                                            >
                                                <TooltipIconBlock
                                                    tooltipIconSize="16px"
                                                    label="Custom plans"
                                                    tooltip="For companies with larger design needs."
                                                    $textVariant="P4"
                                                    $colorScheme="primary"
                                                    $w="278"
                                                />
                                                <Text
                                                    $textVariant="P4"
                                                    $colorScheme="primary"
                                                    $d={['inline-block', 'none']}
                                                >
                                                    Custom plans
                                                </Text>
                                            </Radio>
                                        </Box>
                                    </Box>  */}
                                    {selectedPlan === 'prebuilt' &&
                                        (plansLoading ? (
                                            <LoadingWithLogo $w="100%" $h="58vh" />
                                        ) : (
                                            plansData?.allPlans
                                                ?.filter(plan => plan.name !== 'DAILY_OUTPUT')
                                                ?.filter(plan => plan.interval === frequency)
                                                .map((plan, indexPlan) => (
                                                  
                                                    <Box
                                                        key={indexPlan}
                                                        $borderW="1"
                                                        $borderStyle="solid"
                                                        $borderColor={
                                                            preBuiltPlanName === plan.name &&
                                                                preBuiltPlan.interval === frequency
                                                                ? 'cta'
                                                                : 'outline-gray'
                                                        }
                                                        $bg={
                                                            preBuiltPlanName === plan.name &&
                                                                preBuiltPlan.interval === frequency
                                                                ? 'cta'
                                                                : 'white'
                                                        }
                                                        $px="16"
                                                        $pt="19"
                                                        $pb={['24', '4']}
                                                        $mb="20"
                                                        $radii="10"
                                                    >
                                                        <Box

                                                            $d="flex"
                                                            $justifyContent="space-between"
                                                            $alignItems="flex-start"
                                                            $mb="20"

                                                        >
                                                            <Box>
                                                                <Text
                                                                    $textVariant="H5"
                                                                    $colorScheme={
                                                                        preBuiltPlanName === plan.name &&
                                                                            preBuiltPlan.interval === frequency
                                                                            ? 'white'
                                                                            : 'primary'
                                                                    }
                                                                    $mb={['20', '6']}
                                                                >
                                                                    {plan.name}
                                                                </Text>
                                                                {plan?.featuresTitle && (
                                                                    <Text
                                                                        $mt="6"
                                                                        $mb='6'
                                                                        fontFamily='Geomanist'
                                                                        $textVariant="Button"
                                                                        $fontWeight='400'
                                                                        $colorScheme={
                                                                            preBuiltPlanName === plan.name &&
                                                                                preBuiltPlan.interval === frequency
                                                                                ? 'white'
                                                                                : 'primary'
                                                                        }
                                                                    >
                                                                        {plan?.featuresTitle}
                                                                    </Text>
                                                                )}
                                                                <Text
                                                                    $textVariant="H5"
                                                                    $colorScheme={
                                                                        preBuiltPlanName === plan.name &&
                                                                            preBuiltPlan.interval === frequency
                                                                            ? 'white'
                                                                            : 'cta'
                                                                    }
                                                                >

                                                                    {` USD ${usdFormatter.format(
                                                                        calculatePricePerMonth(
                                                                            plan.interval,
                                                                            plan.price
                                                                        )
                                                                    )}/mo`}
                                                                </Text>
                                                            </Box>
                                                            <Box $d={['none', 'block']}>
                                                                <Button
                                                                    type="primary"
                                                                    disabled={
                                                                        currentPlan === plan.name && !subscriptionData?.user?.company?.subscription?.endAt &&
                                                                        currentPlanFrequency === frequency && subscriptionData?.user?.company?.subscription?.status !== 'paused'
                                                                    }
                                                                    onClick={() => handleChangePreBuiltPlan(plan.name)}
                                                                    $w="152"
                                                                    noColorTransitions
                                                                >
                                                                    {preBuiltPlanName === plan.name &&
                                                                        preBuiltPlan.interval === frequency
                                                                        ? 'Selected'
                                                                        : checkIfCurrentPlan(plan.name)}
                                                                </Button>
                                                            </Box>
                                                        </Box>

                                                        <hr />



                                                        <Box $d={['block', 'none']}>
                                                            <hr />
                                                        </Box>
                                                        <Box $d={['block', 'none']} $mt="24">
                                                            <Button
                                                                type="primary"
                                                                disabled={
                                                                    currentPlan === plan.name && !subscriptionData?.user?.company?.subscription?.endAt &&
                                                                    currentPlanFrequency === frequency && subscriptionData?.user?.company?.subscription?.status !== 'paused'
                                                                }
                                                                onClick={() => handleChangePreBuiltPlan(plan.name)}
                                                                $w="100%"
                                                            >
                                                                {preBuiltPlanName === plan.name &&
                                                                    preBuiltPlan.interval === frequency
                                                                    ? 'Selected'
                                                                    : checkIfCurrentPlan(plan.name)}
                                                            </Button>
                                                        </Box>
                                                        <Box $py='15' $d='flex' $alignItems='flex-start' $justifyContent='space-between'>
                                                            <Box $pt="0">
                                                                <Text
                                                                    $textVariant="H5"
                                                                    $colorScheme={
                                                                        preBuiltPlanName === plan.name &&
                                                                            preBuiltPlan.interval === frequency
                                                                            ? 'white'
                                                                            : 'primary'
                                                                    }
                                                                    $mb="20"
                                                                >
                                                                    Features
                                                                </Text>
                                                                {plan.features.map((feature, indexFeature) => (
                                                                    <Box
                                                                        key={indexFeature}
                                                                        $d="flex"
                                                                        $alignItems="center"
                                                                        $mb={plan?.features.length - 1 === indexFeature ? '0' : '16'}
                                                                    >
                                                                        <Box $mr="10">
                                                                            <CheckOutlined style={{ color:  preBuiltPlanName === plan.name &&
                                                                                preBuiltPlan.interval === frequency
                                                                                ? 'white'
                                                                                : COLOR_CTA }} />
                                                                        </Box>
                                                                        {(plan.tooltips && plan?.tooltips[indexFeature]) ? (
                                                                            <TooltipIconBlock
                                                                                label={feature}
                                                                                tooltip={plan?.tooltips[indexFeature]}
                                                                                tooltipIconSize="16px"
                                                                                $textVariant="P4"
                                                                                $colorScheme={'primary'}
                                                                                tooltipIconColor={'primary'}
                                                                            />
                                                                        ) :  (
                                                                            <Text
                                                                                $textVariant="P4" 
                                                                                $colorScheme={
                                                                                    preBuiltPlanName === plan.name &&
                                                                                        preBuiltPlan.interval === frequency
                                                                                        ? 'white'
                                                                                        : 'primary'
                                                                                }
                                                                            >
                                                                                {feature}
                                                                            </Text>
                                                                        )}
                                                                    </Box>
                                                                ))}
    { (plan.name === 'Advanced' || plan.name === 'Business') && <Box
    $w='180'
                                        $d="flex"
                                        $alignItems="center"
                                     
                                        $mt="16"
                                        $opacity={ "1"}
                                    >
                                        <Box $mr="10">
                                            <LockOutlined style={{ color:  COLOR_TEXT_TERTIARY }} />
                                        </Box>
                                        <Text
                                            $textVariant="P4"
                                            $colorScheme={COLOR_TEXT_TERTIARY}
                                        >
                                            Real Time Slack Communication
                                        </Text>
                                    </Box>}
                                                            </Box>
                                                            <Box $pt="0" $pb="20">
                                                                <Text
                                                                    $textVariant="H5"
                                                                    $colorScheme={
                                                                        preBuiltPlanName === plan.name &&
                                                                            preBuiltPlan.interval === frequency
                                                                            ? 'white'
                                                                            : 'primary'
                                                                    }
                                                                    $mb="20"
                                                                >
                                                                    Design Services
                                                                </Text>
                                                                {CATEGORIES.map((category, indexCategory) => (
                                                                    <Box
                                                                        key={indexCategory}
                                                                        $d="flex"
                                                                        $alignItems="center"
                                                                        $mb={CATEGORIES.length - 1 === indexCategory ? '0' : '16'}
                                                                    >
                                                                        <Box $mr="10">
                                                                            {indexCategory > 2 && plan.name === 'Advanced' ? <LockOutlined style={{ color:  COLOR_TEXT_TERTIARY }} /> : <CheckOutlined style={{ color:  preBuiltPlanName === plan.name &&
                                                                                preBuiltPlan.interval === frequency
                                                                                ? 'white'
                                                                                : COLOR_CTA }} />}
                                                                        </Box>
                                                                        <Text
                                                                            $textVariant="P4"
                                                                            $colorScheme={indexCategory > 2 && plan.name === 'Advanced' ? COLOR_TEXT_TERTIARY : 
                                                                                preBuiltPlanName === plan.name &&
                                                                                    preBuiltPlan.interval === frequency
                                                                                    ? 'white'
                                                                                    : 'primary'
                                                                            }
                                                                            $opacity={'1'}
                                                                        >
                                                                            {category}
                                                                        </Text>
                                                                        {indexCategory < 2 && (
                                                                            <TooltipIconBlock
                                                                                label={''}
                                                                                tooltip={category}
                                                                                tooltipIconSize="16px"
                                                                                $textVariant="P4"
                                                                                $colorScheme={'primary'}
                                                                                tooltipIconColor={'primary'}
                                                                            />
                                                                        )}  
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                            <Box $w='30%' $py="0">
                                                                <Text
                                                                    $textVariant="H5"
                                                                    $colorScheme={
                                                                        preBuiltPlanName === plan.name &&
                                                                            preBuiltPlan.interval === frequency
                                                                            ? 'white'
                                                                            : 'primary'
                                                                    }
                                                                    $mb="20"
                                                                >
                                                                    Tools
                                                                </Text>
                                                                <Box
                                                                    $d="flex"
                                                                    $alignItems="flex-start"
                                                                >
                                                                    <Box as="img" src={multiLogo} alt="multi" $mr="10" $w="34" $h="34" />
                                                                    <Box as="img" src={figmaLogo} alt="figma" $mr="10" $w="34" $h="34" />
                                                                    <Box as="img" src={canvaLogo} alt="canva" $w="34" $h="34" />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                ))
                                        ))}
                                    {/* {!plansLoading && (
                                        <Box
                                            $borderW="1"
                                            $borderStyle="solid"
                                            $borderColor="outline-gray"
                                            $bg="white"
                                            $px="16"
                                            $pt="19"
                                            $pb={['24', '4']}
                                            $mb="20"
                                            $radii="10"
                                        >
                                            <Box
                                                $d="flex"
                                                $justifyContent="space-between"
                                                $alignItems="center"
                                                $mb="20"
                                            >
                                                <Box>
                                                    <Badge $isNotification $py="8" $px="24" $mb="11">
                                                        ADD-ON
                                                    </Badge>
                                                    <Text
                                                        $textVariant="H5"
                                                        $colorScheme="primary"
                                                        $mb={['20', '6']}
                                                        $alignItems="center"
                                                        $d="flex"
                                                    >
                                                        Webflow Development
                                                        &nbsp;
                                                        <IconWebFlow />
                                                    </Text>
                                                    <Text
                                                        $textVariant="H5"
                                                        $colorScheme="cta"
                                                    >
                                                        {`USD ${usdFormatter.format(
                                                            calculatePricePerMonth(
                                                                frequency,
                                                                WEBFLOW_BASE_PRICE[frequency]
                                                             )
                                                          
                                                        )}/mo`}
                                                    </Text>
                                                </Box>
                                                <Box $d={['none', 'block']}>
                                                    <Button
                                                        type="primary"
                                                        $w="152"
                                                        noColorTransitions
                                                        onClick={handleWebFlowClick}
                                                    >
                                                        talk to sales
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <hr />
                                            <Text
                                                $mt="20"
                                                $textVariant="Button"
                                                $colorScheme="primary"
                                            >
                                            </Text>
                                            <Box
                                                $textVariant="P4"
                                                $colorScheme="primary"
                                                $mb="16"
                                                $mx="6"
                                                $d="flex"
                                            >
                                                Transform your Figma design into live webflow websites
                                            </Box>
                                        </Box>
                                    )} */}
                                    {selectedPlan === 'custom' && (
                                        <Box $maxW={['100%', '700']}>
                                            <Text $textVariant="H6" $colorScheme="headline" $mb="10">
                                                Choose the number of daily output
                                            </Text>
                                            <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                                                Adding more daily outputs to your account will increase your daily
                                                capacity. Multiple designers will work on your projects every business
                                                day. To learn more about daily output, visit our{' '}
                                                <Text
                                                    as="a"
                                                    href="https://help.manypixels.co/daily-output-delivery-time"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    $fontWeight="400"
                                                >
                                                    Help Center
                                                </Text>
                                                .
                                            </Text>
                                            <DailyOutputSlider
                                                value={customPlan?.dailyOutput}
                                                onChange={handleChangeDailyOutput}
                                            />
                                        </Box>
                                    )}
                                    <Box $d={['block', 'none']} $mb="20" $mt="42">
                                        <hr />
                                    </Box>
                                </Box>
                                <UpdatedPlanSummary
                                    selectedPlan={selectedPlan}
                                    preBuiltPlan={preBuiltPlan}
                                    subscription={subscription}
                                    customPlan={customPlan}
                                    frequency={frequency}
                                    $variant="secondary"
                                    priceUnit={handlePriceUnit(
                                        selectedPlan === 'prebuilt' ? preBuiltPlan?.interval : customPlan?.interval
                                    )}
                                />
                            </Box>
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default withResponsive(withLoggedUser(EditPlan));
