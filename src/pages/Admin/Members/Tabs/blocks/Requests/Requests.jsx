import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import RequestsTab from '@pages/Admin/Requests/RequestsTab';

const Requests = ({ member, viewer }) => {
    return (
        <Box $my={['20', '30']}>
            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                Requests
            </Text>
            <RequestsTab viewer={viewer} designerId={member?.id} />
        </Box>
    );
};

export default Requests;
