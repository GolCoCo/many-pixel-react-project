import React from 'react';
import { Link } from 'react-router-dom';
import IconOrderQueueEmpty from '@components/Svg/IconOrderQueueEmpty';
import IconAdd from '@components/Svg/IconAdd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { CREATE_REQUEST } from '@constants/routes';

export const EmptyQueue = ({ spaceTop = ['20', '48'] }) => {
    return (
        <Box $pt={spaceTop} $d="flex" $alignItems="center" $justifyContent="center" $maxW="550" $w="100%" $mx="auto" $textAlign="center">
            <Box>
                <IconOrderQueueEmpty />
                <Text $textVariant="H5" $colorScheme="headline" $mt="30" $mb="15">
                    Your don’t have any requests in your Queue
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="24">
                    You either haven’t created a request yet or all of your requests are currently under the Delivered tab. If you would like your designer to do
                    some revisions on one of your Delivered requests, simply send a message through the Messages section.
                </Text>
                <Link to={CREATE_REQUEST}>
                    <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />}>
                        Create Request
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};
