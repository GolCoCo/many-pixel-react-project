import React from 'react';
import { IconOrderInactive } from '@components/Svg/IconOrderInactive';
import { COMPANY_ROLE_MEMBER } from '@constants/account';
import withLoggedUser from '@components/WithLoggedUser';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { useHistory } from 'react-router-dom';

const SubscriptionInactive = ({ viewer, spaceTop = ['122', '185'], children }) => {
    const history = useHistory();
    return (
        <Box $pt={spaceTop} $d="flex" $alignItems="center" $justifyContent="center" $maxW="550" $w="100%" $mx="auto" $textAlign="center">
            <Box>
                <IconOrderInactive />
                <Text $textVariant="H5" $colorScheme="headline" $mt="30" $mb="15">
                    You don’t have an active subscription
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="24">
                    {children ?? 'Your account is currently inactive. To submit new requests, you need to subscribe to a plan first.'}
                </Text>
                {viewer.companyRole !== COMPANY_ROLE_MEMBER && (
                    <Button type="primary" onClick={() => history.push('/edit-plan')}>
                        Subscribe
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default withLoggedUser(SubscriptionInactive);
