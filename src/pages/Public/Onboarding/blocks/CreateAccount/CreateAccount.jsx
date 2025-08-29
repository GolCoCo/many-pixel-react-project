import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { login } from '@constants/auth';
import SignUp from '@components/SignUp';
import useScript from '../hooks/useForms.js';
import { useApolloClient } from '@apollo/client';

const CreateAccount = memo(
    ({ referrerData, referrerLoading, goNextStep, windowWidth }) => {
        const client = useApolloClient();
        const onSuccessSignUp = async ({ token, email, stripeId }) => {
            await login(token, email, client);
            try {
                if (window.tap && stripeId) {
                    window.tap('trial', stripeId);
                }
            } catch (e) {
                console.error(e);
                console.log('not an affiliate link');
            }
            goNextStep();
        };

        useScript();

        return (
            <Box>
                {!referrerLoading && (
                    <Text $textVariant="H3" $colorScheme="primary" $mb="30">
                        Create account
                    </Text>
                )}
                <SignUp
                    assignedCompanyRole="ADMIN"
                    referrerData={referrerData}
                    loadingData={referrerLoading}
                    onSuccess={onSuccessSignUp}
                    windowWidth={windowWidth}
                />
            </Box>
        );
    }
);

export default CreateAccount;
