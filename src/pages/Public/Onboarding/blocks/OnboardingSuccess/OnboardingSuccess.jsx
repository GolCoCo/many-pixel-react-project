import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import successRobot from '@public/assets/icons/success-robot.svg';
import { Button } from '@components/Button';

const OnboardingSuccess = ({ onLogin, isLoggingIn }) => {
    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $mb="10">
            <Box $textAlign="center" $mt={['0', '115']} $w={['100%', 'auto']}>
                <img src={successRobot} alt="Success Robot" />
                <Text $textVariant="H3" $colorScheme="headline" $my="10">
                    Welcome aboard
                </Text>
                <Text $textVariant="P3" $colorScheme="primary" $mb="30">
                    We’re excited to have you here.
                </Text>
                    <Button type="primary" $w={['100%', '300']} onClick={onLogin} loading={isLoggingIn}>
                        Go to ManyPixels App
                    </Button>
            </Box>
        </Box>
    );
};

export default OnboardingSuccess;
