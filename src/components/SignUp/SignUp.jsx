import React, { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import message from '@components/Message';
import { REGISTER_USER } from '@graphql/mutations/auth';
import { DELETE_INVITATION } from '@graphql/mutations/invitation';
import { Skeleton } from '@components/Skeleton';
import { Box } from '@components/Box';
import SignUpForm from './SignUpForm';

const SignUp = ({
    onSuccess,
    referrerData,
    invitationData,
    loadingData,
    assignedCompanyRole = null,
    isMemberOnboard = false,
    windowWidth,
}) => {
    const [signupUser] = useMutation(REGISTER_USER);
    const [deleteInvitation] = useMutation(DELETE_INVITATION);

    const handleOnSubmitForm = useCallback(
        async values => {
            message.destroy();
            message.loading('Creating a new user account...', 50000);
            try {
                const variables = {
                    email: values.email,
                    password: values.password,
                    firstname: values.firstname,
                    lastname: values.lastname,
                    companyName: values?.companyName,
                    jobTitle: values?.jobTitle,
                    website: values?.website,
                    invitation: invitationData?.id,
                    referrer: referrerData?.id ?? null,
                    companyId: invitationData?.company?.id ?? null,
                    companyRole: invitationData?.companyRole ?? assignedCompanyRole,
                    role: invitationData?.role ?? null,
                    teamId: invitationData?.team?.id ?? null,
                    specialitiesIds:
                        invitationData?.specialities?.length > 0
                            ? invitationData?.specialities?.map(sp => sp.id)
                            : null,
                    sendOnboardingEmail:
                        isMemberOnboard && (invitationData?.companyRole !== null || assignedCompanyRole !== null),
                };
                await signupUser({ variables })
                    .then(async ret => {
                        const { id, token, stripeId } = ret.data.signup;

                        if (invitationData?.id) {
                            await deleteInvitation({ variables: { id: invitationData?.id } });
                        }

                        await onSuccess({
                            id,
                            token,
                            email: values.email,
                            stripeId,
                            firstname: values.firstname,
                            lastname: values.lastname,
                        });

                        message.destroy();
                        message.success('Account successfully created');

                        return true;
                    })
                    .catch(error => {
                        message.destroy();
                        const errors = error.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on signing up';
                        message.error(formErrorMessage);

                        return false;
                    });
            } catch (e) {
                console.error(e);
                message.destroy();
                return false;
            }
        },
        [invitationData]
    );

    if (loadingData) {
        return (
            <Box>
                <Skeleton $w="230" $h="26" $mb="40" />
                <Box $mb="30">
                    <Skeleton $w="86" $h="16" $mb="12" />
                    <Skeleton $w="100%" $maxW="480" $h="40" />
                </Box>
                <Box $mb="30">
                    <Skeleton $w="86" $h="16" $mb="12" />
                    <Skeleton $w="100%" $maxW="480" $h="40" />
                </Box>
                <Box $mb="30">
                    <Skeleton $w="86" $h="16" $mb="12" />
                    <Skeleton $w="100%" $maxW="480" $h="40" />
                </Box>
                <Box $mb="30">
                    <Skeleton $w="86" $h="16" $mb="12" />
                    <Skeleton $w="100%" $maxW="480" $h="40" />
                </Box>
                <Box $mb="34">
                    <Skeleton $w="86" $h="16" $mb="12" />
                    <Skeleton $w="100%" $maxW="480" $h="40" />
                </Box>
                <Skeleton $w="100%" $maxW="480" $h="40" />
            </Box>
        );
    }

    return (
        <SignUpForm
            referrerData={referrerData}
            invitationData={invitationData}
            loadingData={loadingData}
            windowWidth={windowWidth}
            onSubmit={handleOnSubmitForm}
        />
    );
};

export default SignUp;
