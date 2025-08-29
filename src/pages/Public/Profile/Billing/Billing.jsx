import React, { memo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import Plan from './blocks/Plan';
import PaymentMethod from './blocks/PaymentMethod';
import EmailAccount from './blocks/EmailAccount';
import BillingAddress from './blocks/BillingAddress';
import InvoicesHistory from './blocks/InvoicesHistory';
import BillingSummary from './blocks/BillingSummary';
import { SUBSCRIPTION } from '@graphql/queries/subscription';
import moment from 'moment';

const transformData = data => {
    return {
        subscriptionId: data?.CustomerSubscription?.id,
        planStatus: data?.CustomerSubscription?.status,
        isPromoUsed: data?.CustomerSubscription?.isCancellationPromoUsed,
        nextBillingDate: data?.CustomerSubscription?.stripeData.nextBillingDate,
        upcomingInvoice: data?.CustomerSubscription?.upcomingInvoice,
        customer: data?.CustomerSubscription?.user,
        plan: data?.CustomerSubscription?.plan,
        paymentMethod: data?.CustomerSubscription?.paymentMethod,
        hasEnded: data?.CustomerSubscription?.endAt && moment().isAfter(data?.CustomerSubscription?.endAt),
        endedAt: data?.CustomerSubscription?.endAt ? moment(data?.CustomerSubscription?.endAt).format('MMM DD, YYYY') : null,
    };
};

const Billing = memo(({ user }) => {
    const { loading, data, refetch: _refetch } = useQuery(SUBSCRIPTION, {
        fetchPolicy: 'network-only',
        variables: {
            userId: user?.id,
        },
    });

    const [refetching, setRefetching] = useState(false);

    const refetch = useCallback(() => { setTimeout(() => _refetch(), 0) }, [_refetch]);
    const refetchSubscriptionInvoice = useCallback(async () => {
        setRefetching(true);
        refetch();
        setRefetching(false);
    }, [refetch]);

    const {
        planStatus,
        nextBillingDate,
        upcomingInvoice,
        customer,
        plan,
        isPromoUsed,
        subscriptionId,
        paymentMethod,
        hasEnded,
        endedAt,
    } = transformData(data);
    return (
        <>
            <Box
                $d="flex"
                $justifyContent="space-between"
                $mt="32"
                $flexDir={window.innerWidth < 700 ? "column" : "initial"}
            >
                <Box
                    $d={loading ? "initial" : { xs: 'block', sm: 'block', md: 'block', lg: 'flex', xl: 'flex', xxl: 'flex' }}
                    $flexWrap={loading ? "initial" : "wrap"}
                    $justifyContent={loading ? "initial" : "space-between"}
                    $w={loading ? "initial" : "100%"}
                >
                    <Box $w="100%" $mb="20" hide="desktop">
                        {loading && !refetching ? (
                            <>
                                <Box>
                                    <Skeleton $w="123" $h="18" />
                                </Box>
                                <Box $mt="26" $d="flex">
                                    <Skeleton $w="72" $h="28" $mr="150" />
                                    <Skeleton $w="98" $h="24" />
                                </Box>
                                <Skeleton $w="320" $h="16" $mt="30" />
                                <Skeleton $w="320" $h="16" $mt="20" />
                                <Skeleton $w="320" $h="16" $mt="20" />
                            </>
                        ) : (
                            <BillingSummary
                                {...{
                                    planStatus,
                                    nextBillingDate,
                                    upcomingInvoice,
                                    customer,
                                    plan,
                                    user,
                                    paymentMethod,
                                    hasEnded,
                                    endedAt,
                                }}
                            />
                        )}
                    </Box>
                    <Box $flex="1 1 0%">
                        {loading && !refetching ? (
                            <>
                                <Box>
                                    <Skeleton $w="48" $h="20" $mr="26" />
                                </Box>
                                <Box $mt="26" $d="flex">
                                    <Skeleton $w="41" $h="18" $mr="87" />
                                    <Skeleton $w="36" $h="16" />
                                </Box>
                                <Box $mt="8" $d="flex">
                                    <Skeleton $w="87" $h="32" $mr="41" />
                                    <Skeleton $w="59" $h="16" />
                                </Box>

                                <Box $mt="8" $mb="30" $d="flex">
                                    <Skeleton $w="106" $h="34" $mr="14" />
                                    <Skeleton $w="237" $h="34" />
                                </Box>
                            </>
                        ) : (
                            <Plan
                                {...{
                                    subscriptionId,
                                    isPromoUsed,
                                    planStatus,
                                    nextBillingDate,
                                    upcomingInvoice,
                                    customer,
                                    plan,
                                    endedAt,
                                    refetch: refetchSubscriptionInvoice,
                                    hasEnded,
                                }}
                            />
                        )}
                        <hr />
                        {loading && !refetching ? (
                            <Box $mt="36" $mb="30">
                                <Skeleton $w="169" $h="20" />
                                <Skeleton $w="300" $h="64" $mt="20" />
                                <Skeleton $w="107" $h="34" $mt="20" />
                            </Box>
                        ) : (
                            <PaymentMethod
                                paymentMethod={paymentMethod}
                                refetchSubscriptionInvoice={refetchSubscriptionInvoice}
                            />
                        )}
                        <hr />
                        <Box hide="mobile">
                            {loading && !refetching ? (
                                <Box $mt="34" $mb="30">
                                    <Skeleton $w="147" $h="20" />
                                    <Skeleton $w="116" $h="16" $mt="20" />
                                    <Skeleton $w="780" $h="40" $mt="11" />
                                </Box>
                            ) : (
                                <EmailAccount paymentMethod={paymentMethod} refetch={refetchSubscriptionInvoice} />
                            )}
                            {loading ? <></> : <hr />}
                        </Box>
                        {loading && !refetching ? (
                            <Box $mt="34" $mb="30">
                                <Box>
                                    <Skeleton $w="116" $h="16" $mr="84" />
                                </Box>
                                <Box $mt="11">
                                    <Skeleton $w="780" $h="40" $mr="84" />
                                </Box>
                                <Box $d="flex" $mt="28">
                                    <Skeleton $w="116" $h="16" $mr="84" />
                                    <Skeleton $w="116" $h="16" $mr="84" />
                                    <Skeleton $w="116" $h="16" $mr="84" />
                                    <Skeleton $w="116" $h="16" />
                                </Box>
                                <Box $d="flex" $mt="11">
                                    <Skeleton $w="180" $h="40" $mr="20" />
                                    <Skeleton $w="180" $h="40" $mr="20" />
                                    <Skeleton $w="180" $h="40" $mr="20" />
                                    <Skeleton $w="180" $h="40" />
                                </Box>
                                <Skeleton $w="90" $h="34" $mt="20px" />
                            </Box>
                        ) : (
                            <BillingAddress paymentMethod={paymentMethod} refetch={refetchSubscriptionInvoice} />
                        )}
                        <Box hide="mobile">
                            <hr />
                            <InvoicesHistory billLoading={loading && !refetching} />
                        </Box>
                    </Box>
                    <Box
                        $flex="0 1 auto"
                        $w={{ xs: '100%', sm: '100%', md: '100%', lg: '360', xl: '360', xxl: '360' }}
                        $ml={{ xs: '0', sm: '0', md: '0', lg: '60', xl: '60', xxl: '60' }}
                        hide="mobile"
                    >
                        {!loading && (
                            <BillingSummary
                                {...{
                                    planStatus,
                                    nextBillingDate,
                                    upcomingInvoice,
                                    customer,
                                    plan,
                                    user,
                                    paymentMethod,
                                    hasEnded,
                                    endedAt,
                                }}
                            />
                        )}
                    </Box>
                </Box>
                {loading &&
                    (<Box $w="320px">
                        <Skeleton $w="123" $h="16" $mb="30px" />
                        <Box $mb="30px" $d="flex" $justifyContent="space-between" $alignItems="center">
                            <Skeleton $w="72" $h="28" />
                            <Skeleton $w="98" $h="24" />
                        </Box>
                        <Box $d="flex" $gap="20px" $mb="22px" $flexDir="column">
                            <Skeleton $w="100%" $h="16" />
                            <Skeleton $w="100%" $h="16" />
                            <Skeleton $w="100%" $h="16" />
                        </Box>
                        <Box $d="flex" $flexDir="column" style={{ borderTop: '1px solid #D5D6DD' }}>
                            <Skeleton $w="131px" $h="16" $mt="22px" />
                            <Skeleton $w="100%" $h="16" $mt="24px" />
                            <Skeleton $w="100%" $h="16" $mt="20px" />
                        </Box>
                    </Box>)}
            </Box>
        </>
    );
});

export default Billing;
