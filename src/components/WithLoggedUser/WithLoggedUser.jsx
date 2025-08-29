import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { ME } from '@graphql/queries/userConnected';
import { LoadingWithLogo } from '@components/LoadingWithLogo';

const withLoggedUser = WrappedComponent => props => {
    const { loading, error, data = {}, refetch } = useQuery(ME, { nextFetchPolicy: 'cache-only' });
    const { pathname } = window.location;

    const context = useMemo(() => {
        return {
            ...data.user,
            connected: !!data.user,
        };
    }, [data]);
    if (pathname === '/onboard' && loading) {
        return <LoadingWithLogo $w="100%" $h="100vh" />;
    }

    if (loading) {
        return <Icon component={LoadingOutlined} style={{ fontSize: 20 }} spin />;
    }
    if (error) {
        return <WrappedComponent {...props} viewer={{ connected: false }} />;
    }

    return <WrappedComponent {...props} viewer={context} refetchViewer={refetch} />;
};

export default withLoggedUser;
