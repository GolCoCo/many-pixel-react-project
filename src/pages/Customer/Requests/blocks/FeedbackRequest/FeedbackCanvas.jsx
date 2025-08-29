import React, { useRef, useEffect, useCallback, useReducer, useState } from 'react';
import * as d3 from 'd3';
import mergeImages from 'merge-images';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import IconHand from '@components/Svg/IconHand';
import IconMinus from '@components/Svg/IconMinus';
import IconPlus from '@components/Svg/IconPlus';
import IconFeedback from '@components/Svg/IconFeedback';
import { IconFile } from '@components/IconFile';
import { LoadingWithLogo } from '@components/LoadingWithLogo';
import { COLOR_CTA, COLOR_OTHERS_PINK, COLOR_TEXT_PRIMARY } from '@components/Theme';
import FeedbackCreateForm from './FeedbackCreateForm';
import { CanvasTooltipBounds } from './CanvasTooltipBounds';
import { FeedbackCanvasContainer } from '../../style';
import { unreadCheck } from '../../utils/unreadCheck';
import { getDocument } from 'pdfjs-dist';
const generatePin = (drawEl, index, x, y, isUnread = false, isActive = false, drawScale) => {
    const g = drawEl
        .append('g')
        .attr('class', 'marker')
        .attr('transform', `translate(${x - 24 / drawScale}, ${y - 45 / drawScale})`)
        .attr('data-x', x)
        .attr('data-y', y);

    const pin = g
        .append('svg:path')
        .attr(
            'd',
            'M9.9077 18.8294C9.7848 18.8259 9.66548 18.7881 9.56375 18.7206C9.46201 18.653 9.38208 18.5584 9.33334 18.448L8.0718 15.6376C6.17809 15.1611 4.52709 14.0248 3.42848 12.4419C2.32987 10.859 1.85912 8.93823 2.10454 7.03988C2.34996 5.14152 3.29468 3.396 4.76151 2.13072C6.22833 0.86544 8.11648 0.167328 10.0718 0.167328C12.0271 0.167328 13.9153 0.86544 15.3821 2.13072C16.8489 3.396 17.7936 5.14152 18.0391 7.03988C18.2845 8.93823 17.8137 10.859 16.7151 12.4419C15.6165 14.0248 13.9655 15.1611 12.0718 15.6376L10.5128 18.5182C10.4509 18.6195 10.3617 18.7021 10.2549 18.757C10.1482 18.8119 10.028 18.8369 9.9077 18.8294Z'
        )
        .attr('transform', `scale(${2.35 / drawScale})`);

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
        .attr('x', index > 9 ? (19 / drawScale) * 0.75 : 19 / drawScale)
        .attr('y', 24 / drawScale)
        .attr('style', `font-size: ${16 / drawScale}px`)
        .html(index);

    return g;
};

const canvasInitialState = {
    canvasSize: { width: 0, height: 0, left: 0, top: 0 },
    imageSize: { width: 0, height: 0, ready: false },
    tooltip: { x: 0, y: 0, show: false, pinX: 0, pinY: 0 },
    isCommentable: true,
    isDraggable: false,
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
                isCommentable: true,
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
    const [isPdf, setIsPdf] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function get_url_extension(url) {
        return url.split(/[#?]/)[0].split('.').pop().trim();
    }

    useEffect(() => {
        let timeout = null;

        const clearExecute = () => {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
        };

        const execute = async () => {
            try {
                if (get_url_extension(src) === 'pdf') {
                    const _PDF_DOC = await getDocument({
                        url: src,
                        cMapUrl: '/cmaps/',
                        iccUrl: '/iccs/',
                        // standardFontDataUrl: '/standard_fonts/',
                        wasmUrl: '/wasm/',
                        disableAutoFetch: false,
                        useSystemFonts: true,
                        useWasm: true,
                        useWorkerFetch: true,
                        enableXfa: true,
                    }).promise;
                    setIsLoading(false);
                    setIsPdf(true);
                    setResult(_PDF_DOC);
                } else {
                    const response = await fetch(src, {
                        mode: 'no-cors',
                    });
                    await response.blob();
                    setIsLoading(false);
                    setResult(src);
                }
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
    return [result, isLoading, isPdf];
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
    isControlDisabled: isControlDisabledProps,
}) => {
    const [state, dispatch] = useReducer(canvasReducer, canvasInitialState);
    const [image, setImage] = React.useState(null);
    const [imageSrc, isLoadingImage, isPdf] = useRetryFetchImage(src);
    const [isLoadingCanvas, setIsLoadingCanvas] = React.useState(null);
    const containerRef = useRef();
    const canvasRef = useRef();
    const imgRef = useRef();
    const drawRef = useRef();
    const zoomRef = useRef(d3.zoom());
    const svgRef = useRef();
    const dragMarkerRef = useRef(null);
    const currentTooltipOpened = useRef(false);
    const [drawScale, setDrawScale] = useState(1);
    const [isProcessingImage, setIsProcessingImage] = useState(false);

    useEffect(() => {
        const generate = async () => {
            setIsProcessingImage(true);
            const imagesList = [];
            const canvas = document.createElement('canvas');
            let previousYPosition = 0;
            let maxCanvasWidth = 0;
            for (let i = 1; i <= imageSrc.numPages; i++) {
                const page = await imageSrc.getPage(i);
                const viewport = page.getViewport({ scale: 1.1 });

                canvas.height = viewport.height;
                canvas.width = viewport.width;
                maxCanvasWidth = Math.max(maxCanvasWidth, viewport.width);

                const render_context = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                await page.render(render_context).promise;
                const img = canvas.toDataURL('image/png');
                imagesList.push({ src: img, x: 0, y: previousYPosition });
                previousYPosition = previousYPosition + viewport.height;
            }

            const merged = await mergeImages(imagesList, { width: maxCanvasWidth, height: previousYPosition });
            setImage(merged);
            setIsProcessingImage(false);
        };
        imageSrc && generate();
    }, [imageSrc]);

    const handleScalePin = useCallback(() => {
        const zoomTransform = d3.zoomTransform(svgRef.current.node());
        const currentScale = zoomTransform.k;
        let index = 0;
        svgRef.current.selectAll('.marker').each(function () {
            index++;
            const g = d3.select(this);
            const x = parseFloat(g.attr('data-x'));
            const y = parseFloat(g.attr('data-y'));
            const pin = g.select('path');
            pin.attr('transform', `scale(${2.35 / currentScale})`);
            g.attr('transform', `translate(${x - 24 / currentScale}, ${y - 45 / currentScale})`);
            const text = g.select('text');
            text.attr('style', `font-size: ${16 / currentScale}px`);
            text.attr('x', index > 9 ? (19 / currentScale) * 0.75 : 19 / currentScale);
            text.attr('y', 24 / currentScale);
        });
        setDrawScale(currentScale);
    }, []);

    const handleEvent = useCallback(
        e => {
            if (e.code === 'Space') {
                if (state.isDraggable) {
                    return dispatch({ type: 'TOGGLE_COMMENTABLE' });
                }
                dispatch({ type: 'TOGGLE_DRAGGABLE' });
            }
        },
        [dispatch, state.isDraggable]
    );

    useEffect(() => {
        window.addEventListener('keypress', handleEvent);

        return () => {
            window.removeEventListener('keypress', handleEvent);
        };
    }, [handleEvent]);

    useEffect(() => {
        if (!state.isDraggable && !state.isCommentable && !activeComment) {
            dispatch({ type: 'TOGGLE_COMMENTABLE' });
        }
    }, [activeComment, state]);

    const zoomHandler = useCallback(
        event => {
            if (drawRef.current) {
                drawRef.current.attr('transform', event.transform);
                handleScalePin();
            }
            dispatch({ type: 'ZOOM_DRAG_CHANGE', zoomDrag: event.transform });
            onActiveCommentChange(null);
        },
        [onActiveCommentChange, handleScalePin]
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
                    x: position.right - state.canvasSize.left,
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
                const g = generatePin(
                    drawRef.current,
                    index + 1,
                    comment.x,
                    comment.y,
                    unreadCommentCount + unreadFeedbackCount > 0,
                    false,
                    drawScale
                );
                g.attr('id', `feedback-${comment.id}`)
                    .attr('data-comment-id', comment.id)
                    .style('cursor', 'pointer')
                    .on('click', handleClickPin);

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
    }, [isMobile, comments, state.canvasSize, state.imageSize.ready, viewer, onActiveCommentChange, drawScale]);
    // Active button commentable
    useEffect(() => {
        const draw = drawRef.current;

        const handlePinComment = ev => {
            if (!activeComment) {
                clearMarker();
            }
            if (currentTooltipOpened.current) {
                currentTooltipOpened.current = false;
            } else {
                const [x, y] = d3.pointer(ev);
                dragMarkerRef.current = generatePin(drawRef.current, comments.length + 1, x, y, false, true, drawScale);
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
    }, [state.isCommentable, state.canvasSize, comments.length, clearMarker, drawScale, activeComment]);

    // Drag or pan
    useEffect(() => {
        if (state.isDraggable) {
            svgRef.current = d3.select(canvasRef.current).call(zoomRef.current);
        } else if (state.isCommentable && svgRef.current) {
            svgRef.current
                .on('mousedown.zoom', null)
                .on('touchstart.zoom', null)
                .on('touchmove.zoom', null)
                .on('touchend.zoom', null)
                .on('dblclick.zoom', null);
        }
    }, [state.isDraggable, state.isCommentable]);

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

    const getSize = (canvasSize, imageSize) => {
        if (imageSize.height > canvasSize.height || imageSize.width > canvasSize.width) {
            return [imageSize, canvasSize, false];
        }
        return [canvasSize, imageSize, true];
    };

    const getCenter = (larger, shorter) => {
        // prettier-ignore
        return [Math.floor((larger.width / 2) - (shorter.width/ 2)), Math.floor((larger.height / 2) - (shorter.height / 2))];
    };

    const getImageCenter = (larger, shorter) => {
        // prettier-ignore
        const largerWidth = larger.width > shorter.width  ? larger.width : shorter.width;
        const largerheight = larger.height > shorter.height ? larger.height : shorter.height;
        return [Math.floor(largerWidth / 2), Math.floor(largerheight / 2)];
    };

    const getScale = (largerSize, shorterSize) => {
        const largerHeight =
            largerSize.height > shorterSize.height
                ? shorterSize.height / largerSize.height
                : largerSize.height / shorterSize.height;
        const largerWidth =
            largerSize.width > shorterSize.width
                ? shorterSize.width / largerSize.width
                : largerSize.width / shorterSize.width;
        return largerHeight > largerWidth ? largerWidth : largerHeight;
    };

    const setupCanvas = (newImageSize, newCanvasSize) => {
        setIsLoadingCanvas(true);
        zoomRef.current.on('zoom', zoomHandler);
        zoomRef.current.on('start', zoomStartHandler);

        svgRef.current = d3.select(canvasRef.current).call(zoomRef.current);
        svgRef.current
            .on('mousedown.zoom', null)
            .on('touchstart.zoom', null)
            .on('touchmove.zoom', null)
            .on('touchend.zoom', null)
            .on('dblclick.zoom', null);
        const [largerSize, shorterSize, isCanvasLarger] = getSize(newCanvasSize, newImageSize);
        const imageInCanvas = isPdf ? image : imageSrc;
        drawRef.current = svgRef.current.append('g');
        drawRef.current
            .append('image')
            .attr('xlink:href', imageInCanvas)
            .attr('width', isCanvasLarger ? shorterSize.width : largerSize.width)
            .attr('height', isCanvasLarger ? shorterSize.height : largerSize.height);

        if (isCanvasLarger) {
            const [centerX, centerY] = getCenter(largerSize, shorterSize);
            zoomRef.current.translateBy(svgRef.current, centerX, centerY);
        } else {
            const [centerX, centerY] = getImageCenter(largerSize, shorterSize);
            zoomRef.current.translateTo(svgRef.current, centerX, centerY);
            const scale = getScale(largerSize, shorterSize);
            zoomRef.current.scaleBy(svgRef.current.transition().duration(166), scale / 1.2);
            setDrawScale(scale / 1.2);
        }
        setIsLoadingCanvas(false);
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

    const isControlDisabled = state.isFallbackImage || isControlDisabledProps;

    return (
        <>
            <Box
                $h="54"
                $px="14"
                $d="flex"
                $flexDir="row"
                $alignItems="center"
                $boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                $zIndex="2"
                hide="mobile"
            >
                <Box $pl="6">
                    <ButtonInverted
                        $radii="8"
                        getType={isHovered =>
                            state.isFallbackImage ? 'default' : state.isDraggable || isHovered ? 'primary' : 'ghost'
                        }
                        $h="54"
                        $w="58"
                        icon={
                            <Box $lineH="1" $fontSize="25">
                                <IconHand />
                            </Box>
                        }
                        $borderW="0"
                        disabled={state.isFallbackImage}
                        onClick={handleToggleDraggable}
                        noColorTransitions
                    />
                    <ButtonInverted
                        getType={isHovered =>
                            isControlDisabled ? 'default' : state.isCommentable || isHovered ? 'primary' : 'ghost'
                        }
                        $h="54"
                        $w="58"
                        $radii="8"
                        icon={
                            <Box $lineH="1" $fontSize="25">
                                <IconFeedback />
                            </Box>
                        }
                        $borderW="0"
                        disabled={isControlDisabled}
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
                                $radii="8"
                                icon={<IconMinus />}
                                disabled={state.isFallbackImage}
                                onClick={handleZoomOut}
                            />
                            <Button
                                type="default"
                                size="small"
                                $w="26"
                                $h="26"
                                $radii="8"
                                icon={<IconPlus />}
                                disabled={state.isFallbackImage}
                                onClick={handleZoomIn}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box $flex={1} $bg="bg-gray" $h="100%" $zIndex="1" $overflow="hidden" $userSelect="none">
                <FeedbackCanvasContainer
                    ref={containerRef}
                    isCommentable={state.isCommentable || !isControlDisabled}
                    isDraggable={state.isDraggable}
                >
                    {state.tooltip.show && (
                        <CanvasTooltipBounds
                            y={state.tooltip.y + state.zoomDrag.y}
                            x={state.tooltip.x + state.zoomDrag.x}
                        >
                            <FeedbackCreateForm
                                activeComment={activeComment}
                                onClose={handlePinCancel}
                                onSubmit={handlePinSubmit}
                                onDelete={handlePinDelete}
                                isTypeMessageHidden={isControlDisabled}
                                handleEvent={handleEvent}
                                clearMarker={clearMarker}
                            />
                        </CanvasTooltipBounds>
                    )}
                    {state.isFallbackImage && !isPdf && (
                        <Box $d="flex" $h="100%" $alignItems="center" $justifyContent="center">
                            <Box $textAlign="center" $px="24">
                                <Box $mb="20">
                                    <IconFile name={name} url={src} size="80" />
                                </Box>
                                <Text $textVariant="H5" $mb="10">
                                    This file type is not supported
                                </Text>
                                <Text $textVariant="P4" $mb="20">
                                    This file can't be previewed right now. Please download and open the file on your
                                    computer.
                                </Text>
                                <Button type="primary" loading={isDownloadingFile} onClick={onClickDownload}>
                                    Download
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {(isLoadingImage || isLoadingCanvas || isProcessingImage) && (
                        <Box $d="flex" $h="100%" $alignItems="center" $justifyContent="center">
                            <LoadingWithLogo />
                        </Box>
                    )}
                    <svg ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                </FeedbackCanvasContainer>
                {isPdf && (
                    <div>
                        <img
                            style={{ display: 'none' }}
                            id="image-generated"
                            ref={imgRef}
                            src={image}
                            alt="pdfImage"
                            onLoad={handleLoadImage}
                        />
                    </div>
                )}
                {state.isShowImage && imageSrc && !isPdf && (
                    <img
                        style={{ display: 'none' }}
                        ref={imgRef}
                        src={imageSrc}
                        alt={name}
                        onLoad={handleLoadImage}
                        onError={handleErrorImage}
                    />
                )}
            </Box>
        </>
    );
};
