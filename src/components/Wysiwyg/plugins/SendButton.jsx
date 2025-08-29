import React, { memo } from 'react';
import { Box } from '@components/Box';
import IconSend from '@components/Svg/IconSend';
import { Spin } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { COLOR_TEXT_TERTIARY } from '@components/Theme';
import { primaryColor } from '@constants/colors';

const SendButtonPlugin = memo(({ isDisabled, isLoading }) => {
    return (
        <Box
            as="button"
            type="submit"
            disabled={isDisabled || isLoading}
            $d="inline-flex"
            $alignItems="center"
            $cursor="pointer"
            $appearance="none"
            $outline="none"
            $borderW="0"
            $bg="transparent"
            $px="0"
            style={{ color: isDisabled || isLoading ? COLOR_TEXT_TERTIARY : primaryColor }}
            _disabled={{
                cursor: 'not-allowed',
                color: 'inherit',
            }}
            _hover={isDisabled || isLoading ? {} : { $colorScheme: 'cta' }}
        >
            {isLoading ? <Spin indicator={<Icon component={LoadingOutlined} spin />} /> : <IconSend />}
        </Box>
    );
});

SendButtonPlugin.displayName = 'SendButtonPlugin';

export default SendButtonPlugin;
