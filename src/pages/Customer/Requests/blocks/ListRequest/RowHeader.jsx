import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { RowItemContainer } from '../../style.js';
import { withResponsive } from '@components/ResponsiveProvider';
import { COLOR_BACKGROUND_GRAY } from '@components/Theme/color.js';
import { Skeleton } from '@components/Skeleton/index.js';
export const RowHeader = withResponsive(({ isAdmin = false, isMobile, isLoading = false }) => {
    return (
        <Box
            $d="flex"
            $flexDir="row"
            $alignItems="center"
            $flexWrap="nowrap"
            $pos="relative"
            $radii="10px 10px 0 0"
            $borderBottom="1px solid #D5D6DD"
            $bg={COLOR_BACKGROUND_GRAY}
            $cursor="default"
        >
            <RowItemContainer $py="14" style={{ cursor: 'default' }} $isOpen={false} $p="0">
                <Box $d="flex" $alignItems="center" $overflow="hidden" $cursor="default">
                    <Box $w="100%" $minW="0" $maxW="300">
                        <Box $d="flex" $flexDir="row" $alignItems="center">
                            <div style={{ display: 'none' }} />
                            {isLoading ? (
                                <Skeleton $w="80" $h="20" $ml="82" />
                            ) : (
                                <Text $fontSize={['12', '14']} $textVariant="H6" $ml={isAdmin ? '52' : '76'}>
                                    Name
                                </Text>
                            )}
                        </Box>
                    </Box>
                    {!isMobile && (
                        <>
                            <Box $w="100%" $maxW="140" hide="mobile" $px="16">
                                {isLoading ? (
                                    <Skeleton $w="80" $h="20" />
                                ) : (
                                    <Text $fontSize={['12', '14']} $textVariant="H6">
                                        Status
                                    </Text>
                                )}
                            </Box>
                            <Box $w="100%" $maxW="140" $px="16">
                                {isLoading ? (
                                    <Skeleton $w="80" $h="20" />
                                ) : (
                                    <Text $fontSize={['12', '14']} $textVariant="H6">
                                        Brand
                                    </Text>
                                )}
                            </Box>
                            <Box $px="16" $w="100%" $maxW={isAdmin ? '218' : '140'} hide="mobile">
                                {isLoading ? (
                                    <Skeleton $w="80" $h="20" />
                                ) : (
                                    <Text $fontSize={['12', '14']} $textVariant="H6">
                                        Designer(s)
                                    </Text>
                                )}
                            </Box>
                            <Box $d="flex" $flexDir="row" $w="100%" $flex="1 0 0" $alignItems="center">
                                <Box $maxW="120" $px={isAdmin ? '0' : '16'} $minW="108">
                                    {isLoading ? (
                                        <Skeleton $w="80" $h="20" />
                                    ) : (
                                        <Text $fontSize={['12', '14']} $textVariant="H6">
                                            Design
                                        </Text>
                                    )}
                                </Box>

                                {!isMobile && (
                                    <Box $maxW="140" $px="16" $minW="140">
                                        {isLoading ? (
                                            <Skeleton $w="80" $h="20" />
                                        ) : (
                                            <Text $fontSize={['12', '14']} $textVariant="H6" $px={isAdmin ? '8' : '16'}>
                                                Owner
                                            </Text>
                                        )}
                                    </Box>
                                )}
                                <Box $w="100%" $maxW="142" hide="mobile" $textAlign="center" $px="16">
                                    {isLoading ? (
                                        <Skeleton $w="80" $h="20" />
                                    ) : (
                                        <Text $fontSize={['12', '14']} $textVariant="H6">
                                            Last Updated
                                        </Text>
                                    )}
                                </Box>
                                <Box $px="16" $py="12" $w="78" />
                            </Box>
                        </>
                    )}
                </Box>
            </RowItemContainer>
        </Box>
    );
});
