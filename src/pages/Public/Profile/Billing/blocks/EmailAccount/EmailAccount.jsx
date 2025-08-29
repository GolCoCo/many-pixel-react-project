import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Tooltip } from 'antd';
import IconInfo from '@components/Svg/IconInfo';

// Dig into the history of github on this file if you need to put back the form
const EmailAccount = memo(() => {
    return (
        <Box $mt="32" $mb="32">
            <Box $mb="16">
                <Text $textVariant="H5" $colorScheme="primary">
                    Billing email
                </Text>
            </Box>
            <Box $d="inline-flex" $alignItems="center" $gap="10px" $h="33" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $pl="12" $pr="12" style={{ borderRadius: '10px', backgroundColor: "#F1F0F0" }}>
                <Tooltip color="white" title="Email where you would like to receive your invoices" trigger="hover">
                    <Box $d="flex !important" $alignItems="center">
                        <IconInfo />
                    </Box>
                </Tooltip>
                <Text $textVariant="P4" $colorScheme="secondary">
                    If you would like to receive your invoices to another email, please contact us at <a href="mailto:info@manypixels.co" style={{ textDecoration: 'underline', color: "#6A7180" }}>info@manypixels.co</a>
                </Text>
            </Box>
        </Box>
    );
});

export default EmailAccount;
