import React, { memo } from 'react';
import { ONBOARD } from '@constants/routes';
import { Box } from '@components/Box';
import SideAppPresentation from '@components/SideAppPresentation';
import OnboardingNav from '@components/OnboardingNav';
import { withResponsive } from '@components/ResponsiveProvider';
import SignInForm from './SignInForm';
import DocumentTitle from '@components/DocumentTitle';

const SignIn = memo(({ history, windowWidth }) => {
    return (
        <DocumentTitle title="Sign In | ManyPixels">
            <Box $d="flex" $bg="bg-gray" $h="100vh">
                <Box $d={windowWidth > 1024 ? 'block' : 'none'}>
                    <SideAppPresentation />
                </Box>
                <Box $flex="1 1 0%" $px={['16', '40']} $py={['16', '20']} $bg="white">
                    <Box $textAlign="right" $mb={['85', '0']}>
                        <OnboardingNav message="Don't have an account?" btnText="SIGN UP" link={ONBOARD} />
                    </Box>
                    <SignInForm history={history} />
                </Box>
            </Box>
        </DocumentTitle>
    );
});

export default withResponsive(SignIn);
