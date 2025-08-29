import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import successRobot from '@public/assets/icons/success-robot.svg';

const PasswordForgetSuccess = ({ onClickSignIn }) => {
    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
            <Box $maxW="480" $w="100%" $textAlign="center">
                <img src={successRobot} alt="Success Robot" />
                <Text $textVariant="H3" $colorScheme="headline" $mt="21" $mb="10">
                    Success
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                    Check your inbox. We’ve sent an email with the password reset instructions.
                </Text>
                <Button $w="100%" type="primary" onClick={onClickSignIn}>
                    Return to sign in
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordForgetSuccess;
