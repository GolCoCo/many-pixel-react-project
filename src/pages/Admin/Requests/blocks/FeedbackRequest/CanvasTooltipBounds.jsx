import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@components/Box';

const emptyRect = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
};

/**
 * Referenced from
 * https://github.com/airbnb/visx/blob/master/packages/visx-tooltip/src/tooltips/TooltipWithBounds.tsx
 */
export const CanvasTooltipBounds = ({ x, y, children, offsetLeft = 0, offsetTop = 0 }) => {
    const ref = useRef();
    const [{ ownBounds, parentBounds }, setBounds] = useState({
        ownBounds: emptyRect,
        parentBounds: emptyRect,
    });

    useEffect(() => {
        const node = ref.current;
        const parentNode = node.parentNode;

        const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : emptyRect;
        const parentRect = parentNode && parentNode.getBoundingClientRect ? parentNode.getBoundingClientRect() : emptyRect;

        setBounds({
            ownBounds: rect,
            parentBounds: parentRect,
        });
    }, []);

    let left = x;
    let top = y;

    if (ownBounds && parentBounds) {
        let placeTooltipLeft = false;
        let placeTooltipUp = false;

        if (parentBounds.width) {
            const rightPlacementClippedPx = left + offsetLeft + ownBounds.width - parentBounds.width;
            const leftPlacementClippedPx = ownBounds.width - left - offsetLeft;
            placeTooltipLeft = rightPlacementClippedPx > 0 && rightPlacementClippedPx > leftPlacementClippedPx;
        } else {
            const rightPlacementClippedPx = left + offsetLeft + ownBounds.width - window.innerWidth;
            const leftPlacementClippedPx = ownBounds.width - left - offsetLeft;
            placeTooltipLeft = rightPlacementClippedPx > 0 && rightPlacementClippedPx > leftPlacementClippedPx;
        }

        if (parentBounds.height) {
            const bottomPlacementClippedPx = top + offsetTop + ownBounds.height - parentBounds.height;
            const topPlacementClippedPx = ownBounds.height - top - offsetTop;
            placeTooltipUp = bottomPlacementClippedPx > 0 && bottomPlacementClippedPx > topPlacementClippedPx;
        } else {
            placeTooltipUp = top + offsetTop + ownBounds.height > window.innerHeight;
        }

        left = placeTooltipLeft ? left - ownBounds.width - offsetLeft : left + offsetLeft;
        top = placeTooltipUp ? top - ownBounds.height - offsetTop : top + offsetTop;
    }

    left = Math.round(left);
    top = Math.round(top);

    return (
        <Box ref={ref} $pos="absolute" style={{ top, left }}>
            {children}
        </Box>
    );
};
