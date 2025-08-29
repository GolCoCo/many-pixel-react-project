import client from '@constants/client';
import { useEffect, useRef } from 'react';

export const useCustomSubscription = ({ query, variables, handleNext, refetch }) => {
    const subscription = useRef(null);

    useEffect(() => {
        const setupSubscription = async () => {
            try {
                subscription.current = client
                    .subscribe({
                        query,
                        variables,
                    })
                    .subscribe({
                        next: ({ data }) => {
                            if (handleNext) {
                                handleNext(data);
                            }
                            if (refetch) {
                                refetch();
                            }
                        },
                        error: err => console.error('Subscription error:', err),
                    });
            } catch (error) {
                console.error('Failed to set up subscription:', error);
            }
        };

        setupSubscription();

        return () => {
            if (subscription.current) {
                subscription.current.unsubscribe();
                subscription.current = null;
            }
        };
    }, [query, variables, handleNext, refetch]);
};
