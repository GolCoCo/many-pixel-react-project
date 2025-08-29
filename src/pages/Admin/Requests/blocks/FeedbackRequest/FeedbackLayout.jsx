import React, { createContext, useContext, useState } from 'react';
import CloseIcon from '@components/Svg/Close';
import IconLeftArrow from '@components/Svg/IconLeftArrow';
import { Box } from '@components/Box';
import { Button } from '@components/Button';

const FeedbackLayoutContext = createContext();

const useFeedbackLayoutContext = () => {
    return useContext(FeedbackLayoutContext);
};

export const FeedbackLayout = ({ children }) => {
    const [isOpen, setOpen] = useState(true);

    return <FeedbackLayoutContext.Provider value={{ isOpen, setOpen }}>{children}</FeedbackLayoutContext.Provider>;
};

export const FeedbackWorkspace = ({ children, isMobile }) => {
    const { isOpen } = useFeedbackLayoutContext();
    return (
        <Box
            $w={isMobile ? '100%' : `calc(100% - ${isOpen ? '420px' : '80px'})`}
            $h="100vh"
            $borderW="1"
            $borderStyle="solid"
            $borderColor="outline-gray"
            $trans="0.15s all"
        >
            <Box $d="flex" $flexDir="column" $h="100%">
                {children}
            </Box>
        </Box>
    );
};

export const FeedbackAside = ({ children, minimized: Minimized, isLoading }) => {
    const { isOpen, setOpen } = useFeedbackLayoutContext();

    return (
        <>
            <Box $pos="fixed" $w="80" $h="100vh" $top="0" $right={isOpen ? '80px' : '0px'} $trans="0.15s all">
                <Box $d="flex" $flexDir="column" $alignItems="center" $mt="24">
                    <Button type="ghost" icon={<IconLeftArrow />} $mb="28" onClick={() => setOpen(old => !old)} />
                    {Minimized && <Minimized $isOpen={isOpen} setOpen={setOpen} />}
                </Box>
            </Box>
            <Box $pos="fixed" $w="420" $h="100vh" $top="0" $right={isOpen ? '0px' : '-420px'} $zIndex="2" $bg="white" $overflow="hidden" $trans="0.15s all">
                {!isLoading && (
                    <Box $pos="absolute" $top="0" $right="12" $zIndex="10">
                        <Button type="ghost" $h="55" onClick={() => setOpen(old => !old)} icon={<CloseIcon />} />
                    </Box>
                )}
                {children}
            </Box>
        </>
    );
};
