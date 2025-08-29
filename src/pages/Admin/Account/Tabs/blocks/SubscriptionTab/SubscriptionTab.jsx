import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import InvoicesHistory from '@pages/Public/Profile/Billing/blocks/InvoicesHistory';
import { COMPANY_SUBSCRIPTIONS } from '@graphql/queries/subscription';
import { useQuery } from '@apollo/client';
import { EmptyData } from '@components/EmptyData';
import moment from 'moment';
import bad from '@public/assets/icons/bad.svg';
import neutral from '@public/assets/icons/neutral.svg';
import great from '@public/assets/icons/great.svg';

const rates = {
    bad: {
        text: 'Bad',
        image: bad,
    },
    neutral: {
        text: 'Neutral',
        image: neutral,
    },
    great: {
        text: 'Great',
        image: great,
    },
};

const mainReasons = {
    NO_NEED_DESIGN: 'I no longer need design services',
    NOT_HAPPY_DESIGN: `I'm not happy with the quality`,
    NOT_HAPPY_TURNAROUND: `I'm not happy with the turnaround time`,
    SERVICE_SWITCH: `I'm switching to another service`,
    FREELANCE_HIRE: `I'm hiring a freelancer or in-house designer`,
    OTHER: 'Other',
};

const CancellationCard = ({ cancelReason }) => {
    const rate = rates[cancelReason.feedback?.rating] ?? undefined;
    return (
        <Box $borderW="1" $borderStyle="solid" $borderColor="outline-gray">
            <Box
                $d="flex"
                $flexDir="row"
                $justifyContent="space-between"
                $alignItems="center"
                $px="24"
                $py="16"
                $borderB="1"
                $borderBottomStyle="solid"
                $borderBottomColor="outline-gray"
            >
                <Box>
                    <Text $textVariant="P4" $colorScheme="secondary">
                        Cancellation reason
                    </Text>
                    <Text $textVariant="P4" $colorScheme="primary">
                        {mainReasons[cancelReason.reason]}. {cancelReason.reason === 'SERVICE_SWITCH' ? `Other Service: ${cancelReason.additionalReason}` : ''}
                        {cancelReason.reason === 'OTHER' ? cancelReason.additionalReason : ''}
                    </Text>
                </Box>
                <Box>
                    <Text $textVariant="P4" $colorScheme="primary">
                        {moment(cancelReason.createdAt).format('DD MMM YYYY')}
                    </Text>
                </Box>
            </Box>
            <Box $px="24" $py="16">
                <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                    Feedback
                </Text>
                {rate ? (
                    <Box $d="flex" $alignItems="center">
                        <Box as="img" src={rate.image} $w="20" $h="20" />
                        <Text $textVariant="H6" $colorScheme="primary" $pl="6">
                            {rate.text}
                        </Text>
                    </Box>
                ) : (
                    <Text $textVariant="P4" $colorScheme="secondary">
                        Not rated
                    </Text>
                )}
                <Text $textVariant="P4" $colorScheme="primary" $mt="8">
                    {cancelReason.feedback?.description}
                </Text>
            </Box>
        </Box>
    );
};

const CancellationHistory = ({ company }) => {
    const { data } = useQuery(COMPANY_SUBSCRIPTIONS, {
        fetchPolicy: 'network-only',
        variables: {
            companyIds: [company.id],
        },
    });

    const companySubscriptions = data?.allCustomerSubscriptions ?? [];
    const feedbacks = companySubscriptions
        .map(item => item?.cancelSubscriptionFeedback)
        .filter(item => item)
        .flat();
    const hasFeedback = feedbacks.length > 0;

    return (
        <Box $mt="-20px">
            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                Cancellation history
            </Text>
            {hasFeedback && feedbacks.map(feedback => <CancellationCard key={feedback.id} cancelReason={feedback} />)}
            {!hasFeedback && <EmptyData />}
        </Box>
    );
};

const SubscriptionTab = ({ company, isWorker }) => {
    if (!company) {
        return (
            <Box $my="30">
                <Skeleton $w="145" $h="26" $mb="20" />
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $px="16" $py="16" $bg="#FAFAFA">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <InvoicesHistory isFromCompany isWorker={isWorker} subscriptionId={company?.subscription?.id} />
            <CancellationHistory company={company} />
        </Box>
    );
};

export default SubscriptionTab;
