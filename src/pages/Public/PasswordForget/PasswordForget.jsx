import React, { memo, useCallback, useState } from 'react';
import { ONBOARD } from '@constants/routes';
import SideAppPresentation from '@components/SideAppPresentation';
import { Box } from '@components/Box';
import OnboardingNav from '@components/OnboardingNav';
import { withResponsive } from '@components/ResponsiveProvider';
import PasswordForgetForm from './PasswordForgetForm';
import PasswordForgetSuccess from './PasswordForgetSuccess';
import DocumentTitle from '@components/DocumentTitle';

const PasswordForgetPage = memo(({ history, windowWidth }) => {
    const [isEmailSent, setEmailSent] = useState(false);

    const onSuccess = () => setEmailSent(true);

    const onClickSignIn = useCallback(() => history.push('/signin'), [history]);

    return (
        <DocumentTitle title="Forgot Password | ManyPixels">
            <Box $d="flex" $bg="bg-gray" $h="100vh">
                <Box $d={windowWidth > 1024 ? 'block' : 'none'}>
                    <SideAppPresentation />
                </Box>
                <Box $flex="1 1 0%" $px={['16', '40']} $py={['16', '20']} $bg="white">
                    <Box $textAlign="right" $mb={['85', '0']}>
                        <OnboardingNav message="Don't have an account?" btnText="SIGN UP" link={ONBOARD} />
                    </Box>
                    {isEmailSent ? (
                        <PasswordForgetSuccess onClickSignIn={onClickSignIn} />
                    ) : (
                        <PasswordForgetForm onSuccess={onSuccess} />
                    )}
                </Box>
            </Box>
        </DocumentTitle>
    );
});

export default withResponsive(PasswordForgetPage);
