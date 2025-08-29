import { useEffect, useState } from 'react';

export function useDebounceValue(value, delay = 200) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            window.clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
