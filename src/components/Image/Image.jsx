import React, { memo, useEffect, useRef, useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { getInitial } from '@utils/getInitial';

// Cache error images to prevent blinking when rendering alias or image
const errorImages = {};

const getSuccessImage = (src, fallbackSrc = undefined) => {
    return errorImages[src] ? fallbackSrc : src;
};

const addErrorImage = src => {
    errorImages[src] = true;
};

export const Image = memo(
    ({ children, src, name, size, $fontSize, isRounded, fallbackSrc, fallbackProps, isBorderLess, imageProps = {}, textProps = {}, style }) => {
        const [foundSrc, setFoundSrc] = useState(() => getSuccessImage(src, fallbackSrc));
        const [isUsingFallback, setIsUsingFallback] = useState(false);
        const previousSrcRef = useRef(getSuccessImage(src, fallbackSrc));

        useEffect(() => {
            const newSrc = getSuccessImage(src, fallbackSrc);
            if (newSrc && newSrc !== previousSrcRef.current) {
                setFoundSrc(newSrc);
                previousSrcRef.current = newSrc;
            }
        }, [src, fallbackSrc]);

        const onError = () => {
            addErrorImage(src);
            setFoundSrc(fallbackSrc);
            if (fallbackSrc) {
                setIsUsingFallback(true);
            }
        };

        const initialName = getInitial(name);
        const prebuildProps = {
            $w: `${size}`,
            $h: `${size}`,
            $radii: isRounded ? '999' : '10',
            $fontSize: $fontSize ? `${$fontSize}` : undefined,
            ...(!isBorderLess && {
                $borderW: '1',
                $borderStyle: 'solid',
                $borderColor: 'outline-gray',
            }),
        };

        return (
            <>
                {foundSrc ? (
                    <Box
                        {...prebuildProps}
                        as="img"
                        src={foundSrc}
                        alt={initialName}
                        onError={onError}
                        $objectFit="cover"
                        $objectPosition="center center"
                        style={style}
                        {...imageProps}
                        {...(isUsingFallback && (fallbackProps ?? {}))}
                    />
                ) : (
                    <Text
                        {...prebuildProps}
                        $colorScheme="primary"
                        $lineH={`${size}`}
                        $bg="bg-gray"
                        $textAlign="center"
                        fontFamily="Mulish"
                        style={style}
                        {...textProps}
                    >
                        {children ?? initialName}
                    </Text>
                )}
            </>
        );
    }
);
