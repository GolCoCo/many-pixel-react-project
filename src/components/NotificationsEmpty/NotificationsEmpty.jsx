import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import noData from '@public/assets/icons/no-data.svg';

const NotificationsEmpty = () => {
    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $w="100%" $h="77vh">
            <Box $textAlign="center">
                <img src={noData} alt="No data" />
                <Text $textVariant="H5" $colorScheme="black" $mt="30" $mb="15">
                    You have no notification
                </Text>
                <Text $textVariant="Badge" $colorScheme="secondary" $mb="15">
                    You have no any notifications right now. All of your notifications will be shown here.
                </Text>
            </Box>
        </Box>
    );
};

export default NotificationsEmpty;
