import { useEffect, useRef, useCallback } from 'react';

export function useDebounce(func, wait) {
    const timeout = useRef(null);
    const callback = useRef(func);

    useEffect(() => {
        return () => {
            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
        };
    }, []);

    return useCallback(() => {
        if (timeout.current !== null) {
            window.clearTimeout(timeout.current);
        }

        timeout.current = window.setTimeout(callback.current, wait);
    }, [wait]);
}
