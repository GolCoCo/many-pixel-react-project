import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import message from '@components/Message';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';
import { API_LINK, SUBSCRIPTIONS_LINK } from './general';

const isProd = process.env.VITE_ENV === 'production';

// Create the HTTP link using createUploadLink
const httpLink = createUploadLink({ uri: API_LINK, headers: { 'Apollo-Require-Preflight': 'false' } });
const wsLink = new GraphQLWsLink(
    createWsClient({
        url: SUBSCRIPTIONS_LINK,
        connectionParams: () => ({ accessToken: localStorage.getItem('token') }),
    })
);

// split based on operation type
const splitFn =
    (hasWs = false) =>
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
    };

// Use split link (if needed for subscriptions, otherwise just use httpLink)
const link = split(splitFn(), wsLink, httpLink);

// Authorization Link
const setAuthorizationLink = setContext(() => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            authorization: token ? `Bearer ${token}` : '',
            'Apollo-Require-Preflight': true,
        },
    };
});

// Error Handling Link
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
    if (graphQLErrors) {
        graphQLErrors.forEach(({ extensions, message: errMessage, locations, path }) => {
            if (!isProd) {
                message.destroy();
                message.error('Something went wrong. Please check console log.');
                console.log(`[GraphQL error]: Message: ${errMessage}, Code: ${extensions?.code || ''}, Location: ${locations}, Path: ${path}`);
            }
        });
    }
});

// Apollo Cache
const cache = new InMemoryCache({
    addTypename: true,
    resultCaching: true,
});

// Apollo Client Setup
const client = new ApolloClient({
    link: setAuthorizationLink.concat(ApolloLink.from([onErrorLink, link])),
    cache,
    name: 'web-admin',
    version: '2.0',
    connectToDevTools: !isProd,
});

export default client;

export function openProtectedDownloadLink(pathname) {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token');
    }

    if (!API_LINK) {
        throw new Error('No API base URL');
    }

    window.open(`${import.meta.env.VITE_APP_SERV_API}${pathname}?token=${token}`, '_blank');
}
