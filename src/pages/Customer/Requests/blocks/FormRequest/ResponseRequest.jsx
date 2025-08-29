import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import successRobot from '@public/assets/icons/success-robot.svg';
import { REQUESTS_DRAFT, REQUESTS_QUEUE } from '@constants/routes';

const saveTypes = {
    DRAFT: {
        title: 'Successfully saved as draft',
        content: 'You can see your saved requests on the Draft tab. You can still make modifications to the brief before submitting it.',
        url: REQUESTS_DRAFT,
        button: 'Go to draft requests',
    },
    SUBMITTED: {
        title: 'Your request has been submitted',
        content:
            'We will immediately assign the best designer for the job. You can move the requests up in your Queue. If this is the first request in your Queue, you can expect an update within 1-2 business days.',
        url: REQUESTS_QUEUE,
        button: 'Go to my queue',
    },
};

const ResponseRequest = ({ saveType }) => {
    const type = saveTypes[saveType];
    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center">
            <Box $maxW="500" $w="100%" $textAlign="center">
                <img src={successRobot} alt="Success Robot" width={121} />
                <Text $textVariant="H5" $colorScheme="headline" $mt="21" $mb="10">
                    {type.title}
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                    {type.content}
                </Text>
                <Link to={type.url}>
                    <Button type="primary">{type.button}</Button>
                </Link>
            </Box>
        </Box>
    );
};

export default ResponseRequest;
