import React, { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { Redirect, useHistory } from 'react-router-dom';
import { INVITATION } from '@graphql/queries/invitation';
import { login } from '@constants/auth';
import { SIGN_IN } from '@constants/routes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import SideAppPresentation from '@components/SideAppPresentation';
import OnboardingNav from '@components/OnboardingNav';
import SignUp from '@components/SignUp';
import OnboardingSuccess from '@pages/Public/Onboarding/blocks/OnboardingSuccess';
import { withResponsive } from '@components/ResponsiveProvider';
import message from '@components/Message';
import DocumentTitle from '@components/DocumentTitle';

const OnboardingMember = ({ windowWidth }) => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const invitationId = params.get('invitation');
    const client = useApolloClient();

    const [isSigned, setIsSigned] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const history = useHistory();

    const { loading, data } = useQuery(INVITATION, {
        variables: { id: invitationId },
        skip: !invitationId,
    });

    const onSuccessSignUp = ({ token, email }) => {
        setUserToken(token);
        setUserEmail(email);
        setIsSigned(true);
    };

    const onLogin = useCallback(async () => {
        message.destroy();
        console.log(userToken, userEmail, client);
        setIsLoggingIn(true);
        await login(userToken, userEmail, client);
        setIsLoggingIn(false);
        history.push('/requests');
        
    }, [userToken, userEmail, client, history]);

    useEffect(() => {
        if (data?.Invitation?.token && !loading) {
            setTimeout(() => {
                localStorage.setItem('token', data?.Invitation?.token);
                history.push('/requests');
            }, 3000)
            
        }
    }, [data, loading, history]);

    if (!invitationId || (invitationId && !loading && !data?.Invitation)) return <Redirect to={SIGN_IN} />;

    return (
        <DocumentTitle title="Onboarding Member | ManyPixels">
            <Box $d="flex" $bg="bg-gray" $h="100vh">
                <Box $d={windowWidth > 1024 ? 'block' : 'none'}>
                    <SideAppPresentation />
                </Box>
                <Box $flex="1 1 0%" $px={['16', '40']} $py={['16', '20']} $bg="white">
                    <Box $textAlign="right" $mb={['85', '0']}>
                        <OnboardingNav message="Already a member?" btnText="SIGN IN" link={SIGN_IN} />
                    </Box>
                    {isSigned ? (
                        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
                            <Box $maxW="480" $w="100%">
                                <OnboardingSuccess onLogin={onLogin} isLoggingIn={isLoggingIn} />
                            </Box>
                        </Box>
                    ) : (
                        <Box $d="flex" $justifyContent="center" $alignItems="center">
                            <Box $maxW="480" $w="100%" $mt={['0', '88']}>
                                {!loading && (
                                    <Text $textVariant="H3" $colorScheme="headline" $mb="29">
                                        Create account
                                    </Text>
                                )}
                                <SignUp
                                    onSuccess={onSuccessSignUp}
                                    loadingData={loading}
                                    invitationData={data?.Invitation?.invitation}
                                    isMemberOnboard
                                    windowWidth={windowWidth}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </DocumentTitle>
    );
};

export default withResponsive(OnboardingMember);
