import React, { createContext, useContext } from 'react';
import { Box } from '@components/Box';
import Theme from 'quill/core/theme';
import { withResponsive } from '@components/ResponsiveProvider';
import Snippets from './Snippets';

export const ToolbarContext = createContext();

export const useToolbarContext = () => {
    return useContext(ToolbarContext);
};

export const ToolbarProvider = withResponsive(({ quill, windowWidth, handleAddSnippet, left, right, isCustomer, $isFlip }) => {
    const leftLength = Array.isArray(left) ? left.length : left;
    const isMobile = windowWidth < 768;

    const handleFormat = (format, value) => {
        if (!quill) return;

        const range = quill.getSelection();
        if (range) {
            if (value !== undefined) {
                quill.format(format, value);
            } else {
                const currentValue = quill.getFormat(range)[format];
                quill.format(format, !currentValue);
            }
        }
    };

    const recordVideoButton = !isMobile && isCustomer && !!leftLength && (
        <Box $alignSelf="center" onClick={() => window.open('https://loom.com', '_blank')} $mr="4" $flexShrink={0}>
            <Box $d="flex" $alignItems="center" $hasSpace space="24" $fontSize="14" $colorScheme="tertiary" _hover={{ $colorScheme: 'cta' }} $cursor="pointer">
                Record a Video
            </Box>
        </Box>
    );

    return (
        <ToolbarContext.Provider value={{ quill, handleFormat }}>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $w="100%" className={`custom-toolbar ${$isFlip ? 'flipped' : ''}`}>
                <Box $d="flex" $alignItems="center" $flexWrap="nowrap">
                    {handleAddSnippet && (
                        <Box
                            $fontSize="14"
                            $alignItems="center"
                            $d="flex"
                            $colorScheme="tertiary"
                            className="snippets"
                            _hover={{ $colorScheme: 'cta' }}
                            $mr="4"
                            $flexShrink={0}
                        >
                            <Snippets handleAddSnippet={handleAddSnippet} />
                        </Box>
                    )}
                    {left && (
                        <Box $d="flex" $alignItems="center" $flexShrink={0}>
                            {recordVideoButton}
                            {left}
                        </Box>
                    )}
                </Box>
                <Box style={{ color: `${Theme.COLOR_TEXT_TERTIARY}!important` }} $d="flex" $alignItems="center" $flexShrink={0}>
                    {right && (
                        <Box $d="flex" $alignItems="center" $hasSpace space={['12', '24']}>
                            {right}
                        </Box>
                    )}
                </Box>
            </Box>
        </ToolbarContext.Provider>
    );
});
