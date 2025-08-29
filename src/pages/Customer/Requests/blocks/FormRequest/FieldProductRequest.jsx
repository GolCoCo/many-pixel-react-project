import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import ModalPlan from '@pages/Public/Onboarding/modals/ModalPlan';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_PLANS_TO_SUB } from '@graphql/queries/plan';
import { ME_SUBSCRIPTION } from '@graphql/queries/userConnected';
import { useHistory } from 'react-router';
import { BILLING } from '@constants/routes';
import { UPDATE_SUBSCRIPTION } from '@graphql/mutations/subscription';
import defaultImage from '@public/assets/icons/default-image.svg';
import { Image } from '@components/Image';

const CardProduct = ({ style, cardWidth, product, value, setShowUpgrade, onChange, enableShowUpgrade }) => {
    const [hovered, setHovered] = useState(false);

    const isActive = value === product.id;

    const handleClickCard = () => {
        if (!enableShowUpgrade) {
            onChange(!isActive ? product.id : undefined);
        }
    };

    return (
        <Col key={product.id} lg={4}>
            <Box $w="100%" $pos="relative" $userSelect="none" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                {enableShowUpgrade && (
                    <Box $pos="absolute" $top="0" $zIndex="1" $left="0" $w="100%" $h="140" $bg="rgba(0, 153, 246, 0.4)" style={{ borderRadius: '10px' }} />
                )}
                <Card
                    style={style}
                    $h="140"
                    $w="100%"
                    $alignItems="center"
                    $hoverable
                    $flexDir="column"
                    $justifyContent="center"
                    $mb="20"
                    $maxW={cardWidth ? cardWidth : '140'}
                    $pos="relative"
                    $isActive={isActive || hovered}
                    onClick={handleClickCard}
                >
                    <Image
                        src={product.icon?.url}
                        name={product.title}
                        size={76}
                        isBorderLess
                        imageProps={{ $objectFit: 'contain' }}
                        fallbackSrc={defaultImage}
                    />
                    <Text $textVariant="Badge" $pt="8" $colorScheme="primary" $textAlign="center" $maxW={cardWidth ? 'none' : '110'}>
                        {product.name}
                    </Text>
                </Card>
                {(true || isActive) && enableShowUpgrade && (
                    <Box $pos="absolute" $h="34" $top="49" $zIndex="2" $left="50%" $transform="translateX(-50%)" $w="auto" $px="10">
                        <Button
                            type="primary"
                            style={{
                                fontSize: '12px',
                                height: '34px',
                                lineHeight: '18px',
                                padding: '0 10px',
                            }}
                            onClick={() => setShowUpgrade(true)}
                        >
                            Upgrade Plan
                        </Button>
                    </Box>
                )}
            </Box>
        </Col>
    );
};

export const FieldProductRequest = forwardRef(({ showUpgrade, setShowUpgrade, value, onChange, category, viewer, windowWidth }, ref) => {
    const [frequency] = useState('MONTHLY');
    const history = useHistory();
    const [selectedPlanName, setSelectedPlanName] = useState('Essentials');
    const [fetchedSelectedPlan, setFetchedSelectedPlan] = useState(false);
    const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION);
    const [isUpdating, setIsUpdating] = useState(false);
    const { data: plansData } = useQuery(ALL_PLANS_TO_SUB);
    const { data: subscriptionData } = useQuery(ME_SUBSCRIPTION);

    useEffect(() => {
        const subscribedPlanName = subscriptionData?.user?.company?.subscription?.plan?.name;
        if (subscribedPlanName) {
            setSelectedPlanName(subscribedPlanName);
            setFetchedSelectedPlan(true);
        }
    }, [subscriptionData]);

    const handleConfirmUpgrade = useCallback(
        async newPlan => {
            setIsUpdating(true);
            const selectedPlan = plansData.allPlans?.find(plan => plan.interval === frequency && plan.name === newPlan);
            await updateSubscription({
                variables: {
                    planId: selectedPlan.id,
                    quantity: 1,
                },
            });
            setIsUpdating(false);
            history.push(BILLING);
        },
        [plansData, history, updateSubscription, frequency]
    );

    const handleCancelUpgrade = useCallback(() => {
        setShowUpgrade(false);
    }, [setShowUpgrade]);

    const enabledServices = subscriptionData?.user?.company?.subscription?.plan?.services ?? [];
    const enabledServiceIds = enabledServices.map(item => item.id);

    if (!category) {
        return (
            <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                Please choose a category first
            </Text>
        );
    }

    return windowWidth > 720 ? (
        <>
            <Row gutter={20}>
                {Array.isArray(category.services) &&
                    category.services.length > 0 &&
                    category.services.map(product => (
                        <CardProduct
                            key={product.id}
                            product={product}
                            setShowUpgrade={setShowUpgrade}
                            onChange={onChange}
                            value={value}
                            enableShowUpgrade={enabledServiceIds.indexOf(product.id) < 0}
                        />
                    ))}
            </Row>
            {fetchedSelectedPlan && (
                <ModalPlan
                    visible={showUpgrade}
                    onConfirm={handleConfirmUpgrade}
                    onCancel={handleCancelUpgrade}
                    plans={plansData?.allPlans}
                    frequency={frequency}
                    selectedPlanName={selectedPlanName}
                    setSelectedPlanName={setSelectedPlanName}
                    currentPlanName={selectedPlanName}
                    windowWidth={windowWidth}
                    isUpdating={isUpdating}
                    title="Upgrade plan"
                    okText="Upgrade plan"
                />
            )}
        </>
    ) : (
        <>
            <Col gutter={20}>
                {Array.isArray(category.services) &&
                    category.services.length > 0 &&
                    category.services.map((product, index) => (
                        <CardProduct
                            cardWidth="100%"
                            key={product.id}
                            product={product}
                            setShowUpgrade={setShowUpgrade}
                            onChange={onChange}
                            value={value}
                            enableShowUpgrade={enabledServiceIds.indexOf(product.id) < 0}
                            style={index === category.services.length - 1 ? { marginBottom: 0 } : {}}
                        />
                    ))}
            </Col>
            {fetchedSelectedPlan && (
                <ModalPlan
                    visible={showUpgrade}
                    onConfirm={handleConfirmUpgrade}
                    onCancel={handleCancelUpgrade}
                    plans={plansData?.allPlans}
                    frequency={frequency}
                    currentPlanName={selectedPlanName}
                    selectedPlanName={selectedPlanName}
                    setSelectedPlanName={setSelectedPlanName}
                    windowWidth={windowWidth}
                    isUpdating={isUpdating}
                    title="Upgrade plan"
                    okText="Upgrade plan"
                />
            )}
        </>
    );
});
