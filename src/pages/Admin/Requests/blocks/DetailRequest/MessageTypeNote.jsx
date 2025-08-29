import React from 'react';
import Avatar from '@components/Avatar';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { WysiwygRenderer } from '@components/Wysiwyg';
import moment from 'moment';

const wrapDangerous = text => {
    return { __html: text };
};

export const MessageTypeNote = ({ usersOnline, user, createdAt, text }) => {
    const isOnline = usersOnline?.some(userId => user?.id === userId);

    return (
        <Box $d="flex" $pos="relative" $px={['16', '20']} $py="8" $w="100%" $trans="0.2s all" $alignItems="center" $bg="badge-yellow" $wordBreak="break-word">
            <Box>
                <Avatar
                    src={user?.picture?.url}
                    size={34}
                    $fontSize={12}
                    name={`${user?.firstname}`}
                    isActive={isOnline}
                    showActive={isOnline}
                    $textVariant="SmallTitle"
                />
            </Box>
            <Box $pl="16" $flex={1}>
                <Box $d="flex" $alignItems="flex-start" $flexWrap="wrap">
                    <Text $textVariant="H6" $colorScheme="primary">
                        {user?.firstname}
                    </Text>
                    <Box $maxW="545">
                        <WysiwygRenderer $pl="4" $fontWeight="100" content={text} />
                    </Box>
                    <Text $textVariant="P4" $ml="8" $colorScheme="secondary">
                        {moment(createdAt).format('DD MMM YY, HH:mm')}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};
