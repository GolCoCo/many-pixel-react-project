import React, { memo } from 'react';
import { COMPANY_ROLE_MEMBER } from '@constants/account';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import withLoggedUser from '@components/WithLoggedUser';
import IconOrderPause from '@components/Svg/IconOrderPause';
import { useHistory } from 'react-router-dom';

const SubscriptionPaused = memo(({ viewer, spaceTop = ['47', '110'] }) => {
    const history = useHistory();
    return (
        <Box $pt={spaceTop} $d="flex" $alignItems="center" $justifyContent="center" $maxW="550" $w="100%" $mx="auto" $textAlign="center">
            <Box>
                <IconOrderPause />
                <Text $textVariant="H5" $colorScheme="headline" $mt="30" $mb="15">
                    Your subscription is on pause
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="24">
                    Your subscription is currently on pause. You still have access to all your requests and files under the Delivered tab, but you cannot submit
                    new requests or revisions. You can resume your susbcription at any time.
                </Text>
                {viewer.companyRole !== COMPANY_ROLE_MEMBER && (
                    <Button type="primary" onClick={() => history.push('/edit-plan')}>
                        Resume Subscription
                    </Button>
                )}
            </Box>
        </Box>
    );
});

export default withLoggedUser(SubscriptionPaused);
