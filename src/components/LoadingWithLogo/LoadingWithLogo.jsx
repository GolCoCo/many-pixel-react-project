import React from 'react';
import { Box } from '@components/Box';
import { ASSET_LOGO_MP_BLUE, ASSET_LOGO_MP_BLUE_ALT } from '@constants/assets';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingWithLogo = ({ $w = '100%', $h }) => (
    <Box $d="flex" $justifyContent="center" $alignItems="center" $w={$w} $h={$h}>
        <Box $d="flex" $alignItems="center">
            <LoadingOutlined style={{ fontSize: 20, marginRight: 8 }} spin />
            <Box $w="120">
                <img src={ASSET_LOGO_MP_BLUE} alt={ASSET_LOGO_MP_BLUE_ALT} />
            </Box>
        </Box>
    </Box>
);
