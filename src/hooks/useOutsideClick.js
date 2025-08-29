import { useRef, useEffect } from 'react';

export function useOutsideClick(callback) {
    const ref = useRef(null);
    const refCallback = useRef(callback);

    useEffect(() => {
        const onClickOutside = ev => {
            if (ref.current && !ref.current.contains(ev.target)) {
                refCallback.current(ev);
            }
        };

        // document.addEventListener('mousedown', onClickOutside, true);
        document.addEventListener('click', onClickOutside, true);
        document.addEventListener('ontouchstart', onClickOutside, true);
        return () => {
            // document.removeEventListener('mousedown', onClickOutside, true);
            document.removeEventListener('click', onClickOutside, true);
            document.removeEventListener('ontouchstart', onClickOutside, true);
        };
    }, []);

    return ref;
}
