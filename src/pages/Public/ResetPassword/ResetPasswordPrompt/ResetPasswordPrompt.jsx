import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';

const ResetPasswordPrompt = ({ onClickSignIn, labelButton, title, iconSrc, text }) => {
    return (
        <Box $d="flex" $justifyContent="center" $alignItems="center" $h={['auto', '70vh']}>
            <Box $maxW="480" $w="100%" $textAlign="center">
                <img src={iconSrc} alt="Success Robot" />
                <Text $textVariant="H3" $colorScheme="headline" $mt="21" $mb="10">
                    {title}
                </Text>
                <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                    {text}
                </Text>
                <Button $w="100%" type="primary" onClick={onClickSignIn}>
                    {labelButton}
                </Button>
            </Box>
        </Box>
    );
};

export default ResetPasswordPrompt;
