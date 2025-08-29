import React, { createContext, useContext, useState } from 'react';
import IconLeftArrow from '@components/Svg/IconLeftArrow';
import { Box } from '@components/Box';
import { Button } from '@components/Button';

const FeedbackLayoutContext = createContext();

const useFeedbackLayoutContext = () => {
    return useContext(FeedbackLayoutContext);
};

const RightArrow = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.73 10.74C13.553 10.738 13.3841 10.6661 13.26 10.54L5.80997 2.91C5.74949 2.84963 5.70152 2.77792 5.66879 2.69899C5.63605 2.62006 5.61921 2.53545 5.61921 2.45C5.61921 2.36455 5.63605 2.27994 5.66879 2.201C5.70152 2.12207 5.74949 2.05037 5.80997 1.99C5.93316 1.87027 6.09818 1.80328 6.26997 1.80328C6.44176 1.80328 6.60678 1.87027 6.72997 1.99L14.19 9.64C14.2501 9.69951 14.2979 9.77037 14.3305 9.84847C14.3631 9.92657 14.3799 10.0104 14.3799 10.095C14.3799 10.1796 14.3631 10.2634 14.3305 10.3415C14.2979 10.4196 14.2501 10.4905 14.19 10.55C14.1302 10.6112 14.0586 10.6597 13.9795 10.6923C13.9004 10.725 13.8155 10.7412 13.73 10.74Z"
                fill="currentColor"
            />
            <path
                d="M6.27032 18.19C6.18492 18.1901 6.10034 18.1734 6.02142 18.1408C5.94249 18.1082 5.87076 18.0603 5.81032 18C5.69059 17.8768 5.62361 17.7118 5.62361 17.54C5.62361 17.3682 5.69059 17.2032 5.81032 17.08L13.2703 9.62999C13.3307 9.56958 13.4024 9.52167 13.4814 9.48897C13.5603 9.45628 13.6449 9.43945 13.7303 9.43945C13.8158 9.43945 13.9003 9.45628 13.9793 9.48897C14.0582 9.52167 14.1299 9.56958 14.1903 9.62999C14.2507 9.6904 14.2986 9.76211 14.3313 9.84104C14.364 9.91997 14.3809 10.0046 14.3809 10.09C14.3809 10.1754 14.364 10.26 14.3313 10.3389C14.2986 10.4179 14.2507 10.4896 14.1903 10.55L6.73032 18C6.67093 18.0617 6.59939 18.1105 6.52022 18.1432C6.44105 18.1759 6.35596 18.1918 6.27032 18.19Z"
                fill="currentColor"
            />
        </svg>
    );
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
                        <Button type="ghost" $h="55" onClick={() => setOpen(old => !old)} icon={<RightArrow />} />
                    </Box>
                )}
                {children}
            </Box>
        </>
    );
};
