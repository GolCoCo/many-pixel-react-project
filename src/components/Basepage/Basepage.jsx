import { ArrowLeftOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { useHistory } from 'react-router-dom';
import Nav from './Nav';

export const Basepage = ({ location, children }) => {
    const history = useHistory();
    const hasController = !!localStorage.getItem('controller');
    const handleGoToAdmin = useCallback(() => {
        history.push('/connect/');
    }, [history]);
    return (
        <Box $bg="white" $h="100%">
            <Nav location={location} />
            <Box $pt="60">{children}</Box>
            {hasController && (
                <Box
                    $pos="fixed"
                    $bottom="20"
                    $left="20"
                    $bg="#EF457E"
                    $radii="88"
                    $w="70"
                    $cursor="pointer"
                    $h="70"
                    $d="flex"
                    $flexDir="column"
                    $alignItems="center"
                    $textAlign="center"
                    $pt="8"
                    onClick={handleGoToAdmin}
                >
                    <ArrowLeftOutlined style={{ color: 'white', fontSize: '17px', marginBottom: '2px' }} />
                    <Text $colorScheme="white" fontFamily="Geomanist" $fontWeight="400" $fontSize="12px" fontStyle="normal" $lineHeight="12px">
                        Back to Admin
                    </Text>
                </Box>
            )}
        </Box>
    );
};
