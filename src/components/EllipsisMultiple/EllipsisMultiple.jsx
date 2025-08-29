/**
 * Referenced from
 *
 * https://github.com/ShinyChang/React-Text-Truncate/blob/master/src/TextTruncate.js
 */

import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@components/Text';
import { withResponsive } from '@components/ResponsiveProvider/ResponsiveProvider';

const truncateText = '...';
const maxCalculateTimes = 10;

export const EllipsisMultipleBase = ({
    children,
    line,
    windowWidth,
    handleSetActiveFilters,
    hasActiveFilters,
    handleSetFilter,
    showFilter,
    windowHeight,
    setHeight,
    ...textProps
}) => {
    const [, forceUpdate] = useState(1);
    const textRef = useRef(null);
    const canvasEllipsis = useRef(null);
    const rafId = useRef(null);
    const isMobile = windowWidth < 768;

    useLayoutEffect(() => {
        const setup = () => {
            const canvas = document.createElement('canvas');
            const docFragment = document.createDocumentFragment();
            const style = window.getComputedStyle(textRef.current);
            const font = [style['font-style'], style['font-weight'], style['font-size'], style['font-family']].join(
                ' '
            );
            docFragment.appendChild(canvas);

            canvasEllipsis.current = canvas.getContext('2d');
            canvasEllipsis.current.font = font;

            forceUpdate(old => old + 1);
        };

        const handleUpdate = () => {
            const style = window.getComputedStyle(textRef.current);
            const font = [style['font-style'], style['font-weight'], style['font-size'], style['font-family']].join(
                ' '
            );
            canvasEllipsis.current.font = font;
            forceUpdate(old => old + 1);
        };

        const handleWindowResize = () => {
            if (rafId.current !== null) {
                window.cancelAnimationFrame(rafId.current);
            }

            rafId.current = window.requestAnimationFrame(handleUpdate);
        };

        // TODO: find a way to make sure font is loaded to canvas
        // currently only setting up timeout
        setup();
        const timeout = window.setTimeout(() => {
            setup();
        }, 250);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.clearTimeout(timeout);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const calculateWidth = useCallback(text => {
        if (!canvasEllipsis.current) {
            return 0;
        }

        return Math.ceil(canvasEllipsis.current.measureText(text).width);
    }, []);

    useLayoutEffect(() => {
        const scopeWidth = textRef.current.getBoundingClientRect().width;
        if (scopeWidth >= calculateWidth(children)) {
            if (setHeight) {
                setHeight(65);
            }
        }
    }, [setHeight, calculateWidth, children]);

    const getText = useCallback(() => {
        if (textRef.current === null) {
            return null;
        }

        const scopeWidth = textRef.current.getBoundingClientRect().width;
        if (scopeWidth === 0) {
            return null;
        }

        if (typeof children !== 'string') return null;

        const childText = '';
        let currentPos = 1;
        const maxTextLength = children.length;
        let truncatedText = '';
        let splitPos = 0;
        let startPos = 0;
        let displayLine = line;
        let width = 0;
        let lastIsEng = false;
        let isPrevLineWithoutSpace = false;
        let lastPos = 0;
        let lastSpaceIndex = -1;
        let ext = '';
        let loopCnt = 0;

        while (displayLine > 0) {
            displayLine -= 1;
            ext = displayLine ? '' : truncateText + (childText ? ` ${childText}` : '');
            while (currentPos <= maxTextLength) {
                truncatedText = children.substr(startPos, currentPos);
                width = calculateWidth(truncatedText + ext);
                if (width < scopeWidth) {
                    splitPos = children.indexOf(' ', currentPos + 1);
                    if (splitPos === -1) {
                        currentPos += 1;
                        lastIsEng = false;
                    } else {
                        lastIsEng = true;
                        currentPos = splitPos;
                    }
                } else {
                    do {
                        loopCnt += 1;
                        if (loopCnt >= maxCalculateTimes) {
                            break;
                        }
                        truncatedText = children.substr(startPos, currentPos);
                        if (!displayLine) {
                            currentPos -= 1;
                        }
                        if (truncatedText[truncatedText.length - 1] === ' ') {
                            truncatedText = children.substr(startPos, currentPos - 1);
                        }
                        if (lastIsEng) {
                            lastSpaceIndex = truncatedText.lastIndexOf(' ');
                            if (lastSpaceIndex > -1) {
                                currentPos = lastSpaceIndex;
                                if (displayLine) {
                                    currentPos += 1;
                                }
                                truncatedText = children.substr(startPos, currentPos);
                            } else {
                                currentPos -= 1;
                                truncatedText = children.substr(startPos, currentPos);
                            }
                        } else {
                            currentPos -= 1;
                            truncatedText = children.substr(startPos, currentPos);
                        }
                        width = calculateWidth(truncatedText + ext);
                    } while (width >= scopeWidth && truncatedText.length > 0);
                    startPos += currentPos;
                    break;
                }
            }

            if (currentPos >= maxTextLength) {
                startPos = maxTextLength;
                break;
            }

            if (lastIsEng && !isPrevLineWithoutSpace && children.substr(lastPos, currentPos).indexOf(' ') === -1) {
                isPrevLineWithoutSpace = children.substr(lastPos, currentPos).indexOf(' ') === -1;
                displayLine -= 1;
            }
            lastPos = currentPos + 1;
        }

        if (startPos === maxTextLength) {
            return children;
        }
        return `${children.substr(0, startPos)}${truncateText}`;
    }, [children, calculateWidth, line]);

    return (
        <Text
            {...textProps}
            ref={textRef}
            $overflow="hidden"
            $whiteSpace={isMobile ? 'normal' : 'pre-wrap'}
            $wordBreak="break-word"
            style={{
                display: '-webkit-box',
                WebkitLineClamp: line,
                WebkitBoxOrient: 'vertical',
                maxHeight: `${line * (isMobile ? 1.3 : 1.5)}em`, // Smaller line height on mobile
            }}
        >
            {getText()}
        </Text>
    );
};

EllipsisMultipleBase.propTypes = {
    children: PropTypes.node.isRequired,
    line: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
    textProps: PropTypes.shape({}),
};

export const EllipsisMultiple = withResponsive(EllipsisMultipleBase);
