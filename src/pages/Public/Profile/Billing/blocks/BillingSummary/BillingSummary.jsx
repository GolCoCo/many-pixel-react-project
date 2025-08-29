import React, { useState, memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import moment from 'moment';
import _ from 'lodash';
import { usdFormatter } from '@constants/utils';
import inactiveRobot from '@public/assets/icons/inactive-robot.svg';
import BillingSummaryModal from './BillingSummaryModal';

const BillingSummary = memo(
    ({ endedAt, hasEnded, paymentMethod, planStatus, nextBillingDate, customer, upcomingInvoice, plan }) => {
        const [isModalVisible, setisModalVisible] = useState(false);
        const handleModalVisible = () => {
            setisModalVisible(!isModalVisible);
        };

        const isCancelled = !!endedAt || planStatus === 'inactive'

        return (
            <>
                {!!endedAt && planStatus !== 'inactive' && (
                    <BillingSummaryModal
                        open={isModalVisible}
                        onOk={handleModalVisible}
                        onCancel={handleModalVisible}
                        {...{
                            planStatus,
                            nextBillingDate,
                            customer,
                            upcomingInvoice,
                            plan,
                            paymentMethod,
                        }}
                    />
                )}
                <Box $bg="bg-gray" $px="24" $py="24" hide="mobile" $radii="10">
                    {!!endedAt || planStatus === 'inactive' ? (
                        <Box $textAlign="center">
                            <Box $d="inline-block" $mb="16">
                                <img src={inactiveRobot} alt="Inactive Robot" />
                            </Box>
                            <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                                No upcoming invoice
                            </Text>
                            <Text $textVariant="P4" $colorScheme="secondary" $mx="16" $mb="16">
                                {hasEnded
                                    ? 'Your subscription has been cancelled, you have no upcoming invoice.'
                                    : 'Your subscription will be cancelled on '}
                                {!hasEnded && (
                                    <Text $textVariant="P4" $colorScheme="text-error">
                                        {endedAt}
                                    </Text>
                                )}
                            </Text>
                        </Box>
                    ) : (
                        <>
                            <Text $textVariant="H5" $colorScheme="primary" $mb="24" style={{ lineHeight: '140%' }}>
                                Upcoming invoice
                            </Text>
                            <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="24">
                                <Text $textVariant="H3" $colorScheme="cta">
                                    {usdFormatter.format(upcomingInvoice?.amountDue ? upcomingInvoice.amountDue / 100 : 0)}
                                </Text>
                            </Box>
                            <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="16">
                                <Text $textVariant="P4" $colorScheme="secondary">
                                    Next payment
                                </Text>
                                <Text $textVariant="P4" $colorScheme="primary">
                                    {moment(nextBillingDate).format('MMM DD, YYYY')}
                                </Text>
                            </Box>
                            <Box $d="flex" $justifyContent="space-between" $alignItems="center">
                                <Text $textVariant="P4" $colorScheme="secondary">
                                    Billing frequency
                                </Text>
                                <Text $textVariant="P4" $colorScheme="primary">
                                    {plan?.interval ? _.upperFirst(_.toLower(plan.interval)) : '-'}
                                </Text>
                            </Box>
                        </>
                    )}
                </Box>
                <Box $bg="bg-gray" $px="16" $py={isCancelled ? '10' : '16'} hide="desktop" $radii="10">
                    {isCancelled ? (
                        <>
                            {nextBillingDate ? (
                                <Text $textVariant="P4" $colorScheme="secondary">
                                    Your subscription will be cancelled on{' '}
                                    <Text as="span" $colorScheme="other-red">
                                        {moment(nextBillingDate).format('MMM DD, YYYY')}
                                    </Text>
                                </Text>
                            ) : (
                                <Box $textAlign="center">
                                    <Box $d="inline-block" $mb="16">
                                        <img src={inactiveRobot} alt="Inactive Robot" />
                                    </Box>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                                        No upcoming invoice
                                    </Text>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Box $d="flex" $justifyContent="space-between">
                            <Box>
                                <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                                    Total amount
                                </Text>
                                <Text $textVariant="H4" $colorScheme="cta" $mb="10">
                                    ${upcomingInvoice?.amountDue ? upcomingInvoice.amountDue / 100 : 0}
                                </Text>plan
                            </Box>
                            <Box>
                                <Box $mb="14">
                                    <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                                        Next payment
                                    </Text>
                                    <Text $textVariant="P4" $colorScheme="primary">
                                        {moment(nextBillingDate).format('MMM DD, YYYY')}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                                        Billing frequency
                                    </Text>
                                    <Text $textVariant="P4" $colorScheme="primary">
                                        {plan?.interval ? _.upperFirst(_.toLower(plan.interval)) : '-'}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </>
        );
    }
);

export default BillingSummary;
