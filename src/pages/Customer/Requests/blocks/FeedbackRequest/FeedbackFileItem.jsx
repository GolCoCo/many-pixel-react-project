import React from 'react';
import moment from 'moment';
import { Box } from '@components/Box';
import { IconFile } from '@components/IconFile';
import { humanFileSize } from '@constants/utils';
import IconFeedbackFilled from '@components/Svg/IconFeedbackFilled';
import IconFeedback from '@components/Svg/IconFeedback';
import { Text } from '@components/Text';

export const FeedbackFileItem = ({ fileId, name, size, updatedAt, url, totalComment, isViewed, onViewFile, hasUnread }) => {
    // TODO: figure out split name with ellipsis
    //const names = typeof name === 'string' ? name.split('.') : [];
    //const extension = names.length > 1 ? names[1] : undefined;

    return (
        <Box
            $py="12"
            $px="15"
            $mb="16"
            $borderW="1"
            $radii="10"
            $borderColor={isViewed ? 'cta' : 'transparent'}
            $bg={isViewed ? 'bg-light-blue' : 'white'}
            $borderStyle="solid"
            transition="0.2s all"
            $cursor="pointer"
            _hover={{ $bg: 'bg-light-blue', $borderColor: 'cta' }}
            onClick={() => {
                onViewFile(fileId);
            }}
        >
            <Box $d="flex" alignItem="center" $overflow="hidden">
                <Box $pr="13">
                    <IconFile name={name} showPreviewImage url={url} size="38" />
                </Box>
                <Box>
                    <Box $d="flex" $flexDir="row-reverse" $flexWrap="nowrap" $overflow="hidden">
                        <Text $textVariant="Badges" $colorScheme="primary" $isTruncate $flex="1 1 100%">
                            {name}
                        </Text>
                    </Box>
                    <Box $d="flex" $alignItems="center" $textVariant="P5" $colorScheme="secondary" $mb="2">
                        <Text>{humanFileSize(size)}</Text>
                        <Box $w="1" $h="12" $mx="6" $bg="outline-gray" />
                        <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                    </Box>
                </Box>
                <Box $ml="auto" $alignSelf="center">
                    {totalComment > 0 && (
                        <Box $d="flex" $flexDir="row" $alignItems="center" $textVariant="P5" $colorScheme={hasUnread ? 'primary' : 'secondary'}>
                            {hasUnread ? (
                                <Box $colorScheme="other-pink" $pr="2" $lineH="1" $alignSelf="center">
                                    <IconFeedbackFilled />
                                </Box>
                            ) : (
                                <Box $colorScheme="secondary" $pr="2" $lineH="1" $alignSelf="center">
                                    <IconFeedback />
                                </Box>
                            )}
                            {totalComment}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
