import { useEffect, useRef } from 'react';

export function useTimeout(initial) {
    const timeout = useRef(initial);

    useEffect(() => {
        return () => {
            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
        };
    }, []);

    return timeout;
}
