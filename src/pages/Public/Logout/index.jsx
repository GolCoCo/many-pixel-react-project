import React, { useEffect, memo } from 'react';
import { Redirect } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { SIGN_IN } from '@constants/routes';
import { logout } from '@constants/auth';
import withLoggedUser from '@components/WithLoggedUser';

const Logout = memo(({ viewer }) => {
    const client = useApolloClient();

    useEffect(() => {
        if (viewer && window && window.analytics) {
            window.analytics.track('Log out');
            window.analytics.reset();
        }
        logout(client);
    }, [client, viewer]);

    return <Redirect to={SIGN_IN} />;
});

export default withLoggedUser(Logout);
