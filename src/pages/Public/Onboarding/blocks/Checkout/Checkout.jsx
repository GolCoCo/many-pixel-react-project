import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import CheckoutForm from './CheckoutForm.jsx';

const Checkout = memo(({ viewer, total, selectedPlan, selectedPromotion, goNextStep, referrerData }) => {
    return (
        <Box>
            <Text $textVariant="H3" $colorScheme="headline" $mb="30">
                Checkout
            </Text>
            <CheckoutForm
                total={total}
                selectedPlan={selectedPlan}
                selectedPromotion={selectedPromotion}
                onCheckout={goNextStep}
                referrer={referrerData}
                viewer={viewer}
            />
        </Box>
    );
});

export default Checkout;
