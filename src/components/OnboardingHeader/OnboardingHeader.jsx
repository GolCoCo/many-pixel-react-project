import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { ASSET_LOGO_MP_BLUE, ASSET_LOGO_MP_BLUE_ALT } from '@constants/assets';
import { SIGN_IN, LOG_OUT } from '@constants/routes';
import withLoggedUser from '@components/WithLoggedUser';

const OnboardingHeader = ({ viewer }) => {
    return (
        <Box
            $borderW="0"
            $borderStyle="solid"
            $borderColor="outline-gray"
            $borderB={['0', '1']}
            $px={['16', '40']}
            $py={['16', '9.5']}
            $d="flex"
            $justifyContent="space-between"
            $alignItems="center"
            $pos="fixed"
            $w="100%"
            $top="0"
            $left="0"
            $zIndex="999"
            $bg="white"
        >
            <Box $w="120">
                <img src={ASSET_LOGO_MP_BLUE} alt={ASSET_LOGO_MP_BLUE_ALT} />
            </Box>
            <Box>
                {!viewer?.connected && (
                    <>
                        <Text $textVariant="P4" $colorScheme="primary" $d="inline-block" $mr="24" hide="mobile">
                            Already a member?
                        </Text>
                        <Box $d="inline-block">
                            <Link to={SIGN_IN}>
                                <Button type="default">Sign In</Button>
                            </Link>
                        </Box>
                    </>
                )}
                {viewer?.connected && (
                    <Box $d="inline-block">
                        <Link to={LOG_OUT}>
                            <Button type="default">LOGOUT</Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default withLoggedUser(OnboardingHeader);
