import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { openProtectedDownloadLink } from '@constants/client';
// import { SYNC_CANCELLATION_SHEET, SYNC_ONBOARDING_SHEET } from '@graphql/mutations/script';

function doExport(type) {
    if (type === 'cancellationSheet') {
        return openProtectedDownloadLink('/admin/export/stream-sync-cancellation-to-csv');
    }

    if (type === 'onboardingSheet') {
        return openProtectedDownloadLink('/admin/export/stream-sync-onboarding-to-csv');
    }

    if (type === 'orders') {
        return openProtectedDownloadLink('/admin/export/stream-sync-orders-to-csv');
    }

    if (type === 'users') {
        return openProtectedDownloadLink('/admin/export/stream-all-users-to-csv');
    }

    if (type === 'pause') {
        return openProtectedDownloadLink('/admin/export/stream-sync-paused-to-csv');
    }
}

const Tools = () => {
    // const [syncCancellationSheet] = useMutation(SYNC_CANCELLATION_SHEET);
    // const [syncOnboardingSheet] = useMutation(SYNC_ONBOARDING_SHEET);
    const [isSyncingCancellation, setIsSyncingCancellation] = useState(false);
    const [isSyncingOnboarding, setIsSyncingOnboarding] = useState(false);
    const [isGeneratingOrders, setIsGeneratingOrders] = useState(false);
    const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
    const [isGeneratingPaused, setIsGeneratingPaused] = useState(false);

    const handleSyncCancellationSheet = () => {
        setIsSyncingCancellation(true);
        setTimeout(() => {
            doExport('cancellationSheet');
            setIsSyncingCancellation(false);
        }, 2000);
    };

    const handleSyncOnboardingSheet = () => {
        setIsSyncingOnboarding(true);
        setTimeout(() => {
            doExport('onboardingSheet');
            setIsSyncingOnboarding(false);
        }, 2000);
    };

    const handleGenerateOrdersFiles = () => {
        setIsGeneratingOrders(true);
        setTimeout(() => {
            doExport('orders');
            setIsGeneratingOrders(false);
        }, 2000);
    };

    const handleGenerateUsersData = () => {
        setIsGeneratingUsers(true);
        setTimeout(() => {
            doExport('users');
            setIsGeneratingUsers(false);
        }, 2000);
    };

    const handleGeneratePaused = () => {
        setIsGeneratingPaused(true);
        setTimeout(() => {
            doExport('pause');
            setIsGeneratingPaused(false);
        }, 2000);
    };

    return (
        <Box $mt="30">
            <Box $mb="20" $d="flex" $alignItems="center">
                <Button loading={isSyncingCancellation} onClick={handleSyncCancellationSheet} type="default" padding="8px 16px" iscapitalized="true">
                    <Text $textVariant="PrimaryButton" $lineH="24" $colorScheme="gray" $cursor="pointer">
                        Export Cancellation Data
                    </Text>
                </Button>
                {/* {isShowCancellationGoogle && (
                    <Text $ml="10" as="a" href="https://www.google.com">
                        Go to google sheet <img width="16" src={blueRightArrow} alt="arrow" />
                    </Text>
                )} */}
            </Box>
            <Box $mb="20" $d="flex" $alignItems="center">
                <Button loading={isGeneratingPaused} onClick={handleGeneratePaused} type="default" padding="8px 16px" iscapitalized="true">
                    <Text $textVariant="PrimaryButton" $lineH="24" $colorScheme="gray" $cursor="pointer">
                        Export Pause Data
                    </Text>
                </Button>
            </Box>
            <Box $mb="20" $d="flex" $alignItems="center">
                <Button loading={isSyncingOnboarding} onClick={handleSyncOnboardingSheet} type="default" padding="8px 16px" iscapitalized="true">
                    <Text $textVariant="PrimaryButton" $lineH="24" $colorScheme="gray" $cursor="pointer">
                        Export Onboarding data
                    </Text>
                </Button>
                {/* {isShowOnboardingGoogle && (
                    <Text $ml="10" as="a" href="https://www.google.com">
                        Go to google sheet <img width="16" src={blueRightArrow} alt="arrow" />
                    </Text>
                )} */}
            </Box>
            <Box $mb="20" $d="flex" $alignItems="center">
                <Button loading={isGeneratingOrders} onClick={handleGenerateOrdersFiles} type="default" padding="8px 16px" iscapitalized="true">
                    <Text $textVariant="PrimaryButton" $lineH="24" $colorScheme="gray" $cursor="pointer">
                        Export Orders Data
                    </Text>
                </Button>
            </Box>
            <Box $d="flex" $alignItems="center">
                <Button loading={isGeneratingUsers} onClick={handleGenerateUsersData} type="default" padding="8px 16px" iiscapitalized="true">
                    <Text $textVariant="PrimaryButton" $lineH="24" $colorScheme="gray" $cursor="pointer">
                        Export Users Data
                    </Text>
                </Button>
            </Box>
        </Box>
    );
};

export default Tools;
