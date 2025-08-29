import React from 'react';
import successSend from '@public/assets/icons/success-robot.svg';
import errorSend from '@public/assets/icons/error-robot.svg';
import { LoadingWithLogo } from '@components/LoadingWithLogo';
import ResetPasswordForm from '../ResetPasswordForm';
import ResetPasswordPrompt from '../ResetPasswordPrompt';

const ResetPasswordContent = ({
    getTokenResetPassword,
    onClickSignIn,
    loadingData,
    onSuccess,
    isReset,
    userId,
    error,
}) => {
    if (loadingData) {
        return <LoadingWithLogo $w="100%" $h={['auto', '70vh']} />;
    }

    if (error || !getTokenResetPassword) {
        return (
            <ResetPasswordPrompt
                title="Error"
                iconSrc={errorSend}
                onClickSignIn={onClickSignIn}
                labelButton="Return to Sign In"
                text="This reset password token is no longer available."
            />
        );
    }

    if (isReset) {
        return (
            <ResetPasswordPrompt
                title="Success"
                iconSrc={successSend}
                onClickSignIn={onClickSignIn}
                labelButton="Sign In"
                text="Your password has been reset successfully."
            />
        );
    }

    return <ResetPasswordForm onSuccess={onSuccess} userId={userId} />;
};

export default ResetPasswordContent;
