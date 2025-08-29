import React from 'react';
import { STRIPE_PK } from '@constants/general';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(STRIPE_PK);

const StripeLoader = ({ children }) => {
    const options = {
        // passing the client secret obtained from the server
        // clientSecret: `pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH`, //@todo should update
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    );
};

export default StripeLoader;
