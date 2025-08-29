import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { login, logout } from '@constants/auth';
import { useApolloClient } from '@apollo/client';
import { REQUESTS } from '@constants/routes';
import { LoadingWithLogo } from '@components/LoadingWithLogo';

const ConnectAs = () => {
    const client = useApolloClient();
    const history = useHistory();
    const { token } = useParams();
    useEffect(() => {
        async function setupToken() {
            const controller = localStorage.getItem('controller');
            if (token && !controller) {
                const controllerToken = localStorage.getItem('token');
                await logout(client);
                await login(token, undefined, client);
                localStorage.setItem('controller', controllerToken);
            } else if (!token && controller) {
                const controllerToken = localStorage.getItem('controller');
                await logout(client);
                await login(controllerToken, undefined, client);
                localStorage.removeItem('controller');
            }
            history.push(REQUESTS);
        }
        setupToken();
    }, [history, token, client]);
    return <LoadingWithLogo $w="100%" $h="100vh" />;
};

export default ConnectAs;
