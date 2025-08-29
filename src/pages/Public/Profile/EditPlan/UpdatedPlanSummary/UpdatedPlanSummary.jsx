import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import message from '@components/Message';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { Button } from '@components/Button';
import { UPDATE_SUBSCRIPTION , FIND_STRIPE_DISCOUNT } from '@graphql/mutations/subscription';
import { GET_INVOICE_PREVIEW, GET_STRIPE_BALANCE } from '@graphql/queries/stripe'
import { capitalize, usdFormatter } from '@constants/utils';
import UpdatePlanConfirmationModal from '../UpdatePlanConfirmationModal';
import CouponForm from '../CouponForm';
import CloseIcon from '@components/Svg/Close';
import Icon, { LoadingOutlined } from '@ant-design/icons';

const getDiscountedValue = (price, discount) => {
    if (discount.couponType === 'percent') {
        return price * ((100 - discount.couponValue) / 100)
    }

    return price - discount.couponValue
}


const UpdatedPlanSummary = ({ selectedPlan, preBuiltPlan, customPlan, priceUnit, subscription, frequency: selectedFrequency }) => {
    const history = useHistory();
    const { price, name, interval, id } = preBuiltPlan || customPlan || {};
    const hasSelectedPlan = (selectedPlan === 'prebuilt' && preBuiltPlan) || (selectedPlan === 'custom' && customPlan);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION);
    const [findStripeDiscount] = useLazyQuery(FIND_STRIPE_DISCOUNT);
    const [getInvoicePreview, { loading, data }] = useLazyQuery(GET_INVOICE_PREVIEW, {fetchPolicy: 'no-cache'});
    const [shouldReset, setShouldReset] = useState(false);
    const { data: d } = useQuery(GET_STRIPE_BALANCE);
    const handleConfirmationModalVisible = () => {
        setIsConfirmationModalVisible(!isConfirmationModalVisible);
    };

    useEffect(() => {
        if (id) {
            getInvoicePreview({ variables: { newPlanId: id, discount: selectedPromotion?.id } })
        }
    }, [id, selectedPromotion, getInvoicePreview]);

    useEffect(() => {
        if (selectedPromotion && selectedFrequency !== 'MONTHLY') {
            setSelectedPromotion(null)
        }
    }, [selectedPromotion, selectedFrequency])


    const frequency = hasSelectedPlan && interval && capitalize(interval, true);

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
                    code: value
                };
                setSelectedPromotion(promotion);
                message.destroy();
                if (promotion.name) {
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

    const handleConfirm = useCallback(async () => {
        
        setIsConfirmationModalVisible(false);
        message.destroy();
        message.loading('Updating plan...');
        setIsLoading(true);
        try {
            await updateSubscription({
                variables: {
                    planId: preBuiltPlan ? preBuiltPlan.id : customPlan.id,
                    quantity: 1,
                    discount: selectedPromotion?.id ?? null,
                },
            });
            message.destroy();
            message.success('Your plan has been updated');
            setIsLoading(false);
            history.push('/profile?tab=3');
            return true;
        } catch (e) {
            // This promotion code cannot be redeemed because the associated customer has prior transactions.
            if(e.message.includes('This promotion code cannot be redeemed')) {
                message.destroy();
                message.error('This promotion code cannot be redeemed because it\'s limited or expired.', 5);
            }
            setIsLoading(false);
            console.error(e);
            return false;
        }
    }, [history, preBuiltPlan, updateSubscription, selectedPromotion, customPlan]);

    const isMonthly = preBuiltPlan?.interval === 'MONTHLY'

    return (
        <>
            <UpdatePlanConfirmationModal
                visible={isConfirmationModalVisible}
                onCancel={handleConfirmationModalVisible}
                onConfirm={handleConfirm}
                plan={
                    selectedPlan === 'prebuilt' ? (
                        <Text $d="inline" $textTransform="capitalize" $colorScheme="primary" $fontWeight="500">
                            {name}
                        </Text>
                    ) : (
                        <Text $d="inline" $textTransform="capitalize" $colorScheme="primary" $fontWeight="500">
                            Custom plan - {customPlan?.dailyOutput} daily outputs
                        </Text>
                    )
                }
            />
            <Box
                $flex={{ xs: 'none', sm: 'none', md: 'none', lg: '0 0 auto', xl: '0 0 auto', xxl: '0 0 auto' }}
                $w={{ xs: 'auto', sm: 'auto', md: 'auto', lg: '360', xl: '360', xxl: '360' }}
            >
                <Box $bg="bg-gray" $p={['16', '20']} $radii="10" >
                    <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                        Updated plan
                    </Text>
                    {selectedFrequency === 'MONTHLY' && isMonthly
                        && (subscription.status !== 'active' || (subscription.status === 'active' && subscription.endAt)) && (
                            <CouponForm
                                handleCoupon={handleCoupon}
                                shouldReset={shouldReset}
                                setShouldReset={setShouldReset}
                            />
                        )
                    }
                    {/* Should be available only to paused and inactive customer with monthly plans only */}
                    <Text $textVariant="H6" $colorScheme="primary" $mb="20">
                        Price summary
                    </Text>
                    {hasSelectedPlan ? (
                        <Box $d="flex" $justifyContent="space-between" $mb="20">
                            <Box>
                                <Text
                                    $textVariant="Badge"
                                    $colorScheme="other-pink"
                                    $textTransform={selectedPlan === 'prebuilt' ? 'capitalize' : 'none'}
                                >
                                    {selectedPlan === 'prebuilt' || !customPlan.dailyOutput
                                        ? name
                                        : `Custom plan - ${customPlan.dailyOutput} daily outputs`}
                                </Text>
                                <Text $textVariant="P4" $colorScheme="primary" $textTransform="capitalize">
                                    {frequency}
                                </Text>
                            </Box>
                            {price && priceUnit && (
                                <Text $textVariant="P4" $colorScheme="primary">
                                    {usdFormatter.format(price)} / {priceUnit}
                                </Text>
                            )}
                        </Box>
                    ) : (
                        <Text $mb="20" $textVariant="P4" $colorScheme="secondary">
                            No plan selected
                        </Text>
                    )} 
                      
                    {selectedPromotion && selectedFrequency === 'MONTHLY' && isMonthly && (
                        <Box $d="flex" $justifyContent="space-between" $mb="20">
                            <Text $textVariant="P4" $colorScheme="secondary" $w="135" $wordBreak="break-word">
                                {selectedPromotion.code}
                            </Text>
                            <CloseIcon style={{ color: '#0099F6' }} $cursor="pointer" onClick={() => {
                                setSelectedPromotion(null)
                                setShouldReset(true)
                                message.success('Coupon removed')
                            }}/>
                        </Box>
                    )}

                    {d?.stripeBalance > 0 && (
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mt="23" $mb="27">
                            <Text $textVariant="P4" $colorScheme="secondary">
                                Credit Balance
                            </Text>
                            <Text $textVariant="P4" $colorScheme="secondary">
                              ({usdFormatter.format(d?.stripeBalance / 100)})
                            </Text>
                        </Box>
                    )}
                    <hr />
                    <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mt="23" $mb="27">
                        <TooltipIconBlock   
                            label="Total due today"
                            tooltipIconSize="16px"
                            tooltip="This is the prorated amount based on your current billing cycle and possible remaining credits and discounts. Resuming your subscription will start a new billing cycle."
                            $textVariant="H6"
                            $colorScheme="primary"
                        />
                        <Text hide="desktop" $textVariant="H6" $colorScheme="primary">
                            Total due today
                        </Text>
                        
                        <Text $textVariant="H5" $colorScheme="cta">
                            {
                                loading
                                    ? <Icon component={LoadingOutlined} style={{ fontSize: 24, color: '#0099F6' }} />
                                    : data?.getInvoicePreview?.amount
                                        ? subscription.status === "inactive" && selectedPromotion
                                            ? usdFormatter.format(getDiscountedValue(data?.getInvoicePreview?.amount / 100, selectedPromotion))
                                            : usdFormatter.format(data?.getInvoicePreview?.amount / 100)
                                        : '$0'
                            }
                        </Text>
                    </Box>
                    <Box>
                        <Button
                            type="primary"
                            $w="100%"
                            disabled={!hasSelectedPlan}
                            loading={isLoading}
                            onClick={handleConfirmationModalVisible}
                        >
                            Update plan
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default UpdatedPlanSummary;
