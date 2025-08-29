import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import moment from 'moment';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import client from '@constants/client';
import StripeLoader from '../StripeLoader';
import { ResponsiveProvider } from '../ResponsiveProvider';
import Routes from '../Routes';
import Segment from '../Segment';
import Autopilot from '../Autopilot';
import HubspotChat from '../HubspotChat';
import { GlobalStyle } from '../GlobalStyle';
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '1s',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1 day',
        dd: '%dd',
        M: 'a mth',
        MM: '%dmths',
        y: 'y',
        yy: '%dy',
    },
});

export default () => (
    <ApolloProvider client={client}>
        <BrowserRouter>
            <StripeLoader>
                <ResponsiveProvider>
                    <GlobalStyle />
                    <Routes />
                    <Segment />
                    <Autopilot />
                    <HubspotChat />
                </ResponsiveProvider>
            </StripeLoader>
        </BrowserRouter>
    </ApolloProvider>
);
