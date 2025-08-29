import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import AccountsTab from '@pages/Admin/Requests/AccountsTab';

const Accounts = ({ member, viewer }) => {
    return (
        <Box $my={['20', '30']}>
            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                Accounts
            </Text>
            <AccountsTab designerId={member?.id} viewer={viewer} />
        </Box>
    );
};

export default Accounts;
