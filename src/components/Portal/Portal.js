import { forwardRef, useState, useLayoutEffect, isValidElement, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { setRef, useForkRef } from '@hooks/useForkRef';

function getContainer(container) {
    return typeof container === 'function' ? container() : container;
}

export const Portal = forwardRef(({ children, container, disablePortal = false }, ref) => {
    const [mountNode, setMountNode] = useState(null);
    const handleRef = useForkRef(isValidElement(children) ? children.ref : null, ref);

    useLayoutEffect(() => {
        if (!disablePortal) {
            setMountNode(getContainer(container) || document.body);
        }
    }, [container, disablePortal]);

    useLayoutEffect(() => {
        if (mountNode && !disablePortal) {
            setRef(ref, mountNode);
            return () => {
                setRef(ref, null);
            };
        }

        return undefined;
    }, [ref, mountNode, disablePortal]);

    if (disablePortal) {
        if (isValidElement(children)) {
            return cloneElement(children, {
                ref: handleRef,
            });
        }
        return children;
    }

    return mountNode ? createPortal(children, mountNode) : mountNode;
});
