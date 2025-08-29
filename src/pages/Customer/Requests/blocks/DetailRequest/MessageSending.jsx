import React from 'react';

import Avatar from '@components/Avatar';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { WysiwygRenderer } from '@components/Wysiwyg';

export const MessageSending = React.memo(({ text, user }) => {
    return (
        <>
            <Box
                $d="flex"
                $pos="relative"
                $px={['16', '20']}
                $py="8"
                $w="100%"
                $trans="0.2s all"
                $bg="white"
                _hover={{
                    $bg: 'bg-gray',
                }}
                _active={{
                    $bg: 'bg-light-blue',
                }}
                $wordBreak="break-word"
            >
                <Box>
                    <Avatar
                        relativeW="34"
                        src={user?.picture?.url}
                        size={34}
                        $fontSize={12}
                        name={user?.firstname}
                        isActive={true}
                        showActive={true}
                        $textVariant="SmallTitle"
                    />
                </Box>
                <Box $pl="16" $flex={1}>
                    <Box $d="flex" $alignItems="center" $flexWrap="wrap">
                        <Text $textVariant="H6" $colorScheme="primary">
                            {user?.firstname}
                        </Text>
                    </Box>
                    <Box $mt="6">
                        <WysiwygRenderer content={text} />
                    </Box>
                </Box>
            </Box>
        </>
    );
});
