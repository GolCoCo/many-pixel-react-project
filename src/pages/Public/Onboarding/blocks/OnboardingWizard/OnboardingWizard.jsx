import React, { memo } from 'react';
import { Box } from '@components/Box';
import CreateAccount from '../CreateAccount';
import Checkout from '../Checkout';
import CompanyInformation from '../CompanyInformation';
import EmailVerification from '../EmailVerification';

const OnboardingWizard = memo(
    ({
        step,
        total,
        selectedPlan,
        selectedPromotion,
        goNextStep,
        referrerData,
        referrerLoading,
        windowWidth,
        viewer,
        verifyId,
        refetchViewer,
    }) => {
        const renderStep = () => {
            switch (step) {
                case 5:
                    return <EmailVerification viewer={viewer} verifyId={verifyId} refetchViewer={refetchViewer} />;
                case 4:
                    return <CompanyInformation goNextStep={goNextStep} windowWidth={windowWidth} />;
                case 3:
                    return (
                        <Checkout
                            total={total}
                            selectedPlan={selectedPlan}
                            selectedPromotion={selectedPromotion}
                            goNextStep={goNextStep}
                            referrerData={referrerData}
                            viewer={viewer}
                        />
                    );
                default:
                    return (
                        <CreateAccount
                            goNextStep={goNextStep}
                            referrerData={referrerData}
                            referrerLoading={referrerLoading}
                            windowWidth={windowWidth}
                        />
                    );
            }
        };

        return (
            <Box $w="100%" $maxW={step === 5 ? '600' : '480'} $mt="15" $mb="0" $mx="auto">
                {renderStep()}
            </Box>
        );
    }
);

export default OnboardingWizard;
