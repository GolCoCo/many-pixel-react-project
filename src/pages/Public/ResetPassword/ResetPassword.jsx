import React, { memo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { ONBOARD } from '@constants/routes';
import SideAppPresentation from '@components/SideAppPresentation';
import { Box } from '@components/Box';
import OnboardingNav from '@components/OnboardingNav';
import { RESET_PASSWORD_TOKEN } from '@graphql/queries/tokenResetPassword';
import { withResponsive } from '@components/ResponsiveProvider';
import ResetPasswordContent from './ResetPasswordContent';
import DocumentTitle from '@components/DocumentTitle';

const ResetPasswordPage = memo(({ match, history, windowWidth }) => {
    const { id } = match.params;
    const [isReset, setIsReset] = useState(false);
    const { loading, error, data } = useQuery(RESET_PASSWORD_TOKEN, {
        variables: { id },
    });

    const onClickSignIn = useCallback(() => history.push('/signin'), [history]);
    const onSuccess = () => setIsReset(true);

    return (
        <DocumentTitle title="Reset Password | ManyPixels">
            <Box $d="flex" $bg="bg-gray" $h="100vh">
                <Box $d={windowWidth > 1024 ? 'block' : 'none'}>
                    <SideAppPresentation />
                </Box>
                <Box $flex="1 1 0%" $px={['16', '40']} $py={['16', '20']} $bg="white">
                    <Box $textAlign="right" $mb={['85', '0']}>
                        <OnboardingNav message="Don't have an account?" btnText="SIGN UP" link={ONBOARD} />
                    </Box>
                    <ResetPasswordContent
                        userId={id}
                        error={error}
                        isReset={isReset}
                        loadingData={loading}
                        onSuccess={onSuccess}
                        onClickSignIn={onClickSignIn}
                        getTokenResetPassword={data?.getTokenResetPassword}
                    />
                </Box>
            </Box>
        </DocumentTitle>
    );
});

export default withResponsive(ResetPasswordPage);
