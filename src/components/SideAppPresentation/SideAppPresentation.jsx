import React from 'react';
import { ASSET_LOGO_LOGIN, ASSET_LOGO_LOGIN_ALT, ASSET_LOGO_MP_BLUE, ASSET_LOGO_MP_BLUE_ALT } from '@constants/assets';
import { TEXT_LOGIN_1, TEXT_LOGIN_2 } from '@constants/texts';
import { Box } from '@components/Box';
import { Text } from '@components/Text';

const SideAppPresentation = () => (
    <Box $w={{ xs: '380', sm: '380', md: '380', lg: '480', xl: '480', xxl: '480' }} $bg="bg-gray" $px="30" $py="25">
        <Box $d="inline-block" $mb="154">
            <Box as="img" $w="144" src={ASSET_LOGO_MP_BLUE} alt={ASSET_LOGO_MP_BLUE_ALT} />
        </Box>
        <Box $mb="48" $textAlign="center" $pos="relative">
            <Box>
                <Box $pos="absolute" $bottom="0" $left="31px" $w="80" $h="64" $bg="other-pink" />
                <Box $pos="absolute" $top="-54px" $right="1px" $w="114" $h="94" $bg="other-yellow" />
            </Box>
            <Box as="img" src={ASSET_LOGO_LOGIN} alt={ASSET_LOGO_LOGIN_ALT} $bg="transparent" $transform="translateZ(1px)" />
        </Box>
        <Text $textVariant="H3" $colorScheme="primary" $mb="30" $textAlign="center" $maxW="310" $mx="auto">
            {TEXT_LOGIN_1}
        </Text>
        <Text $textVariant="P1" $colorScheme="primary" $textAlign="center">
            {TEXT_LOGIN_2}
        </Text>
    </Box>
);

export default SideAppPresentation;
