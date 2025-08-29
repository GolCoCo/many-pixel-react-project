import React, { useRef, useEffect, useCallback, useReducer, useState } from 'react';
import * as d3 from 'd3';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import IconHand from '@components/Svg/IconHand';
import IconMinus from '@components/Svg/IconMinus';
import IconPlus from '@components/Svg/IconPlus';
import { COLOR_CTA, COLOR_OTHERS_PINK, COLOR_TEXT_PRIMARY } from '@components/Theme';
import FeedbackCreateForm from './FeedbackCreateForm.jsx';
import IconFeedback from '@components/Svg/IconFeedback';
import { CanvasTooltipBounds } from './CanvasTooltipBounds.jsx';
import { FeedbackCanvasContainer } from '../../style.js';
import { IconFile } from '@components/IconFile';
import { unreadCheck } from '../../utils/unreadCheck.js';
import { LoadingWithLogo } from '@components/LoadingWithLogo';
import { USER_TYPE_CUSTOMER } from '@constants/account';
import { ORDER_STATUS_COMPLETED, ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION, ORDER_STATUS_ON_HOLD } from '@constants/order';

const generatePin = (drawEl, index, x, y, isUnread = false, isActive = false) => {
    const g = drawEl
        .append('g')
        .attr('class', 'marker')
        .attr('transform', `translate(${x - 24}, ${y - 45})`)
        .attr('data-x', x)
        .attr('data-y', y);

    const pin = g
        .append('svg:path')
        .attr(
            'd',
            'M9.9077 18.8294C9.7848 18.8259 9.66548 18.7881 9.56375 18.7206C9.46201 18.653 9.38208 18.5584 9.33334 18.448L8.0718 15.6376C6.17809 15.1611 4.52709 14.0248 3.42848 12.4419C2.32987 10.859 1.85912 8.93823 2.10454 7.03988C2.34996 5.14152 3.29468 3.396 4.76151 2.13072C6.22833 0.86544 8.11648 0.167328 10.0718 0.167328C12.0271 0.167328 13.9153 0.86544 15.3821 2.13072C16.8489 3.396 17.7936 5.14152 18.0391 7.03988C18.2845 8.93823 17.8137 10.859 16.7151 12.4419C15.6165 14.0248 13.9655 15.1611 12.0718 15.6376L10.5128 18.5182C10.4509 18.6195 10.3617 18.7021 10.2549 18.757C10.1482 18.8119 10.028 18.8369 9.9077 18.8294Z'
        )
        .attr('transform', 'scale(2.35)');

    if (isUnread) {
        pin.attr('fill', COLOR_OTHERS_PINK);
    } else if (isActive) {
        pin.attr('fill', COLOR_CTA);
    } else {
        pin.attr('fill', 'white');
    }

    if (!isUnread && !isActive) {
        pin.attr('stroke', '#C4C4C4');
        pin.attr('strokeWidth', '1');
    }

    g.append('text')
        .attr('fill', isActive || isUnread ? 'white' : COLOR_TEXT_PRIMARY)
        .attr('x', 19)
        .attr('y', 24)
        .html(index);

    return g;
};

const canvasInitialState = {
    canvasSize: { width: 0, height: 0, left: 0, top: 0 },
    imageSize: { width: 0, height: 0, ready: false },
    tooltip: { x: 0, y: 0, show: false, pinX: 0, pinY: 0 },
    isCommentable: false,
    isDraggable: true,
    isShowImage: true,
    isFallbackImage: false,
    zoomDrag: { x: 0, y: 0 },
};

const canvasReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_COMMENTABLE':
            return {
                ...state,
                isDraggable: false,
                isCommentable: !state.isCommentable,
            };
        case 'TURNOFF_COMMENTABLE':
            return {
                ...state,
                isDraggable: false,
                isCommentable: false,
            };
        case 'TOGGLE_DRAGGABLE':
            return {
                ...state,
                isDraggable: !state.isDraggable,
                isCommentable: false,
            };
        case 'PLACE_NEW_COMMENT':
            return {
                ...state,
                tooltip: action.tooltip,
                zoomDrag: {
                    ...state.zoomDrag,
                    x: 0,
                    y: 0,
                    initialX: 0,
                    initialY: 0,
                },
            };
        case 'PLACE_ACTIVE_COMMENT':
            return {
                ...state,
                isCommentable: false,
                tooltip: action.tooltip,
                zoomDrag: {
                    ...state.zoomDrag,
                    x: 0,
                    y: 0,
                    initialX: 0,
                    initialY: 0,
                },
            };
        case 'LOAD_IMAGE':
            return {
                ...state,
                isCommentable: false,
                isShowImage: false,
                imageSize: {
                    ...state.imageSize,
                    ...action.imageSize,
                    ready: true,
                },
                canvasSize: {
                    ...state.canvasSize,
                    width: action.canvasSize.width,
                    height: action.canvasSize.height,
                    top: action.canvasSize.top,
                    left: action.canvasSize.left,
                },
            };
        case 'LOAD_FALLBACK_IMAGE':
            return {
                ...state,
                isShowImage: false,
                isFallbackImage: true,
            };
        case 'ZOOM_DRAG_START': {
            return {
                ...state,
                // zoomDrag: {
                //     ...state.zoomDrag,
                //     x: action.zoomDrag.x,
                //     y: action.zoomDrag.y,
                //     initialX: action.zoomDrag.x,
                //     initialY: action.zoomDrag.y,
                // },
            };
        }
        case 'ZOOM_DRAG_CHANGE': {
            return {
                ...state,
                tooltip: canvasInitialState.tooltip,
                zoomDrag: {
                    ...state.zoomDrag,
                    x: action.zoomDrag.x - state.zoomDrag.initialX,
                    y: action.zoomDrag.y - state.zoomDrag.initialY,
                },
            };
        }
        case 'TOOLTIP_RESET':
            return {
                ...state,
                tooltip: canvasInitialState.tooltip,
            };
        default:
            return state;
    }
};

// Only used in this component
const ButtonInverted = ({ children, onMouseEnter, onMouseLeave, getType, ...props }) => {
    const [isHovered, setHovered] = useState(false);
    const handleMouseEnter = ev => {
        if (onMouseEnter) {
            onMouseEnter(ev);
        }
        setHovered(true);
    };

    const handleMouseLeave = ev => {
        if (onMouseLeave) {
            onMouseLeave(ev);
        }
        setHovered(false);
    };

    return (
        <Button {...props} type={getType(isHovered)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
        </Button>
    );
};

const useRetryFetchImage = src => {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timeout = null;

        const clearExecute = () => {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
        };

        const execute = async () => {
            try {
                const response = await fetch(src, {
                    mode: 'no-cors',
                });
                await response.blob();
                setIsLoading(false);
                setResult(src);
            } catch (error) {
                console.log(error);
                clearExecute();
                timeout = window.setTimeout(() => {
                    execute();
                }, 1000);
            }
        };

        setIsLoading(true);

        execute();
        return () => {
            clearExecute();
        };
    }, [src]);
    return [result, isLoading];
};

export const FeedbackCanvas = ({
    name,
    src,
    comments,
    onCreateFeedback,
    onCreateComment,
    onDeleteFeedback,
    onDeleteComment,
    onEditFeedback,
    onEditComment,
    activeComment,
    onActiveCommentChange,
    onClickDownload,
    isDownloadingFile,
    viewer,
    isMobile,
    request,
}) => {
    const [state, dispatch] = useReducer(canvasReducer, canvasInitialState);
    const [imageSrc, isLoadingImage] = useRetryFetchImage(src);

    const containerRef = useRef();
    const canvasRef = useRef();
    const imgRef = useRef();
    const drawRef = useRef();
    const zoomRef = useRef(d3.zoom());
    const svgRef = useRef();
    const dragMarkerRef = useRef(null);
    const currentTooltipOpened = useRef(false);

    const zoomHandler = useCallback(
        event => {
            drawRef.current.attr('transform', event.transform);
            dispatch({ type: 'ZOOM_DRAG_CHANGE', zoomDrag: event.transform });

            onActiveCommentChange(null);
        },
        [onActiveCommentChange]
    );

    const zoomStartHandler = useCallback(event => {
        if (currentTooltipOpened.current) {
            dispatch({ type: 'ZOOM_DRAG_START', zoomDrag: event.transform });
        }
    }, []);

    const clearMarker = useCallback(() => {
        if (dragMarkerRef.current !== null) {
            dragMarkerRef.current.remove();
            dragMarkerRef.current = null;
        }

        dispatch({ type: 'TOOLTIP_RESET' });
    }, []);

    // Reset styles for pin marker
    useEffect(() => {
        d3.selectAll('.marker > path').attr('fill', 'white').attr('stroke', '#C4C4C4');
        d3.selectAll('.marker > text').attr('fill', COLOR_TEXT_PRIMARY);

        if (activeComment && activeComment.id) {
            // Update color pin
            const selectedMarker = `#feedback-${activeComment.id}`;
            d3.select(selectedMarker).select('g > path').attr('fill', COLOR_CTA).attr('stroke', 'white');
            d3.select(selectedMarker).select('g > text').attr('fill', 'white');
        }
    }, [activeComment]);

    // Changed active comment
    useEffect(() => {
        if (activeComment !== null && state.imageSize.ready && drawRef.current) {
            if (state.isCommentable) {
                dispatch({ type: 'TURNOFF_COMMENTABLE' });
            } else {
                const g = d3.select(`#feedback-${activeComment.id}`);
                g.dispatch('click');
            }
        } else {
            clearMarker();
        }
    }, [activeComment, state.isCommentable, state.imageSize.ready, clearMarker]);

    // Draw and handle loaded comments
    useEffect(() => {
        const handleClickPin = ev => {
            // Get position
            const [x, y] = d3.pointer(ev);
            const commentId = ev.currentTarget.dataset.commentId;
            const position = ev.currentTarget.getBoundingClientRect();

            dispatch({
                type: 'PLACE_ACTIVE_COMMENT',
                tooltip: {
                    show: true,
                    x: position.right - state.canvasSize.left - 20,
                    y: position.bottom - state.canvasSize.top,
                    pinX: x,
                    pinY: y,
                },
            });
            onActiveCommentChange(comments.find(item => item.id === commentId));
        };

        if (state.imageSize.ready && !isMobile && drawRef.current && comments.length > 0) {
            const commentMarkerUnsubsribers = comments.map((comment, index) => {
                const unreadDetailsComments = comment.comments?.filter(com => unreadCheck(com, viewer));
                const unreadCommentCount = unreadDetailsComments?.length ?? 0;
                const unreadFeedbackCount = unreadCheck(comment, viewer) ? 1 : 0;
                const g = generatePin(drawRef.current, index + 1, comment.x, comment.y, unreadCommentCount + unreadFeedbackCount > 0);
                g.attr('id', `feedback-${comment.id}`).attr('data-comment-id', comment.id).style('cursor', 'pointer').on('click', handleClickPin);

                return () => {
                    g.on('click', null);
                    g.remove();
                };
            });
            return () => {
                commentMarkerUnsubsribers.forEach(unsubscribe => {
                    unsubscribe();
                });
            };
        }
    }, [isMobile, comments, state.canvasSize, state.imageSize.ready, viewer, onActiveCommentChange]);

    // Active button commentable
    useEffect(() => {
        const draw = drawRef.current;

        const handlePinComment = ev => {
            clearMarker();
            if (currentTooltipOpened.current) {
                currentTooltipOpened.current = false;
            } else {
                const [x, y] = d3.pointer(ev);

                dragMarkerRef.current = generatePin(drawRef.current, comments.length + 1, x, y, false, true);
                currentTooltipOpened.current = true;

                dispatch({
                    type: 'PLACE_NEW_COMMENT',
                    tooltip: {
                        show: true,
                        x: ev.clientX - state.canvasSize.left,
                        y: ev.clientY - state.canvasSize.top,
                        pinX: x,
                        pinY: y,
                    },
                });
            }
        };

        const setup = () => {
            if (draw) {
                draw.on('click', handlePinComment);
            }
        };

        const cleanUp = () => {
            if (draw) {
                draw.on('click', null);
            }
            clearMarker();
        };

        if (state.isCommentable) {
            setup();
        }
        return () => {
            cleanUp();
        };
    }, [state.isCommentable, state.canvasSize, comments.length, clearMarker]);

    // Drag or pan
    useEffect(() => {
        if (state.isDraggable) {
            svgRef.current = d3.select(canvasRef.current).call(zoomRef.current);
        } else {
            svgRef.current.on('mousedown.zoom', null).on('touchstart.zoom', null).on('touchmove.zoom', null).on('touchend.zoom', null).on('dblclick.zoom', null);
        }
    }, [state.isDraggable]);

    const handlePinCancel = () => {
        currentTooltipOpened.current = false;
        onActiveCommentChange(null);
        clearMarker();
    };
    const dispatchClick = () => {
        if (activeComment && activeComment.id) {
            const g = d3.select(`#feedback-${activeComment.id}`);
            g.dispatch('click');
        }
    };

    const handlePinSubmit = async (values, type = null) => {
        if (type === 'feedback') {
            await onEditFeedback({
                id: values.id,
                content: values.content,
            });
            dispatchClick();
        } else if (type === 'comment') {
            await onEditComment({
                id: values.id,
                content: values.content,
            });
            dispatchClick();
        } else if (!activeComment) {
            await onCreateFeedback({
                content: values.content,
                x: parseFloat(state.tooltip.pinX),
                y: parseFloat(state.tooltip.pinY),
            });
            currentTooltipOpened.current = false;
            clearMarker();
        } else {
            await onCreateComment({
                ...values,
                fileFeedbackId: activeComment.id,
            });
            dispatchClick();
        }
    };

    const handlePinDelete = async values => {
        try {
            if (values.type === 'feedback') {
                await onDeleteFeedback(values.id);
                clearMarker();
            } else if (values.type === 'comment') {
                await onDeleteComment(values.id);
                dispatchClick();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const setupCanvas = (newImageSize, newCanvasSize) => {
        zoomRef.current.on('zoom', zoomHandler);
        zoomRef.current.on('start', zoomStartHandler);

        svgRef.current = d3.select(canvasRef.current).call(zoomRef.current);

        const [largerSize, shorterSize] = newCanvasSize.height > newImageSize.height ? [newCanvasSize, newImageSize] : [newImageSize, newCanvasSize];

        const initialPositionG = svgRef.current.append('g');
        // prettier-ignore
        const centerX = Math.floor((largerSize.width / 2) - (shorterSize.width / 2));
        // prettier-ignore
        const centerY = Math.floor((largerSize.height / 2) - (shorterSize.height / 2));
        initialPositionG.attr('transform', `translate(${centerX},${centerY}) scale(1)`);

        drawRef.current = initialPositionG.append('g');
        drawRef.current.append('image').attr('xlink:href', imageSrc).attr('width', shorterSize.width).attr('height', shorterSize.height);
    };

    const handleZoomIn = () => {
        zoomRef.current.scaleBy(svgRef.current.transition().duration(166), 1.2);
    };

    const handleZoomOut = () => {
        zoomRef.current.scaleBy(svgRef.current.transition().duration(166), 0.8);
    };

    const handleLoadImage = () => {
        const newImgWidth = imgRef.current.naturalWidth;
        const newImgHeight = imgRef.current.naturalHeight;

        const currentCanvasSize = canvasRef.current.getBoundingClientRect();
        const newImageSize = { width: newImgWidth, height: newImgHeight };

        setupCanvas(newImageSize, currentCanvasSize);
        dispatch({
            type: 'LOAD_IMAGE',
            canvasSize: currentCanvasSize,
            imageSize: newImageSize,
        });
    };

    const handleErrorImage = () => {
        dispatch({
            type: 'LOAD_FALLBACK_IMAGE',
        });
    };

    const handleToggleCommentable = () => {
        if (activeComment !== null) {
            onActiveCommentChange(null);
        }

        dispatch({
            type: 'TOGGLE_COMMENTABLE',
        });
    };
    const handleToggleDraggable = () => {
        dispatch({
            type: 'TOGGLE_DRAGGABLE',
        });
    };

    const isCustomer = viewer?.role === USER_TYPE_CUSTOMER;
    const isRequestPaused = request?.status === ORDER_STATUS_ON_HOLD;
    const isRequestDelivered = [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION].indexOf(request?.status) > -1;
    const isRequestCompleted = request?.status === ORDER_STATUS_COMPLETED;

    const isControlDisabled = state.isFallbackImage || (!isCustomer && (isRequestCompleted || isRequestPaused));

    return (
        <>
            <Box $h="54" $px="14" $d="flex" $flexDir="row" $alignItems="center" $boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)" $zIndex="2" hide="mobile">
                <Box $pl="6">
                    <ButtonInverted
                        getType={isHovered => (isControlDisabled ? 'default' : state.isDraggable || isHovered ? 'primary' : 'ghost')}
                        $h="54"
                        $w="58"
                        icon={
                            <Box $lineH="1" $fontSize="25">
                                <IconHand />
                            </Box>
                        }
                        $borderW="0"
                        disabled={isControlDisabled || (!isCustomer && (isRequestCompleted || isRequestPaused))}
                        onClick={handleToggleDraggable}
                        noColorTransitions
                    />
                    <ButtonInverted
                        getType={isHovered => (isControlDisabled ? 'default' : state.isCommentable || isHovered ? 'primary' : 'ghost')}
                        $h="54"
                        $w="58"
                        icon={
                            <Box $lineH="1" $fontSize="25">
                                <IconFeedback />
                            </Box>
                        }
                        $borderW="0"
                        disabled={isControlDisabled || (!isCustomer && (isRequestCompleted || isRequestPaused))}
                        onClick={handleToggleCommentable}
                        noColorTransitions
                    />
                </Box>
                <Box $ml="auto">
                    <Box $d="flex" $flexDir="row" $alignItems="center">
                        <Text $textVariant="P4" $pr="10">
                            Zoom :
                        </Text>
                        <Box>
                            <Button
                                type="default"
                                size="small"
                                $w="26"
                                $h="26"
                                $mr="6"
                                icon={<IconMinus />}
                                disabled={isControlDisabled}
                                onClick={handleZoomOut}
                            />
                            <Button type="default" size="small" $w="26" $h="26" icon={<IconPlus />} disabled={isControlDisabled} onClick={handleZoomIn} />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box $flex={1} $bg="bg-gray" $h="100%" $zIndex="1" $overflow="hidden" $userSelect="none">
                <FeedbackCanvasContainer ref={containerRef} isCommentable={state.isCommentable} isDraggable={state.isDraggable}>
                    {state.tooltip.show && (
                        <CanvasTooltipBounds y={state.tooltip.y + state.zoomDrag.y} x={state.tooltip.x + state.zoomDrag.x}>
                            <FeedbackCreateForm activeComment={activeComment} onClose={handlePinCancel} onSubmit={handlePinSubmit} onDelete={handlePinDelete} />
                        </CanvasTooltipBounds>
                    )}
                    {state.isFallbackImage && (
                        <Box $d="flex" $h="100%" $alignItems="center" $justifyContent="center">
                            <Box $textAlign="center" $px="24">
                                <Box $mb="20">
                                    <IconFile name={name} url={src} size="80" />
                                </Box>
                                <Text $textVariant="H5" $mb="10">
                                    This file type is not supported
                                </Text>
                                <Text $textVariant="P4" $mb="20">
                                    This file can't be previewed right now. Please download and open the file on your computer.
                                </Text>
                                <Button type="primary" loading={isDownloadingFile} onClick={onClickDownload}>
                                    Download
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {isLoadingImage && (
                        <Box $d="flex" $h="100%" $alignItems="center" $justifyContent="center">
                            <LoadingWithLogo />
                        </Box>
                    )}
                    <svg ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                </FeedbackCanvasContainer>
                {state.isShowImage && imageSrc && (
                    <img style={{ display: 'none' }} ref={imgRef} src={imageSrc} alt={name} onLoad={handleLoadImage} onError={handleErrorImage} />
                )}
            </Box>
        </>
    );
};
