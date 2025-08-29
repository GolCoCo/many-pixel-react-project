import { Box } from '@components/Box';
import { Text } from '@components/Text';
import React from 'react';
import { IconFeedbackBackground } from './IconFeedbackBackground.jsx';
import { timeSince } from '@constants/time';
import { unreadCheck } from '../../utils/unreadCheck.js';
import { hasLink, parseLinks } from '@components/Wysiwyg';

const displayComment = comment => {
    if (hasLink(comment)) {
        return (
            <Box
                dangerouslySetInnerHTML={{
                    __html: parseLinks(comment),
                }}
            />
        );
    }

    return comment;
};

export const FeedbackTabFeedback = ({ activeComment, comments, onChangeActive, viewer }) => {
    return (
        <Box $py="16" $px="20" $h="calc(100vh - 55px)" $overflow="auto">
            {comments?.length > 0 ? (
                <>
                    {comments.map((feed, index) => {
                        const lastComment = Array.isArray(feed.comments) && feed.comments.length > 0 ? feed.comments[feed.comments.length - 1] : null;

                        const unreadDetailsComments = feed.comments?.filter(comment => unreadCheck(comment, viewer));
                        const unreadCommentCount = unreadDetailsComments?.length ?? 0;
                        const unreadFeedbackCount = unreadCheck(feed, viewer) ? 1 : 0;
                        const isUnread = unreadCommentCount + unreadFeedbackCount > 0;
                        return (
                            <Box
                                key={feed.id}
                                className="feedback-box"
                                data-active={feed.id === activeComment?.id ? 'true' : undefined}
                                $pt="16"
                                $pb="14"
                                $px="14"
                                $bg="bg-gray"
                                $mb="14"
                                $radii="10"
                                $cursor="pointer"
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor="transparent"
                                $userSelect="none"
                                $trans="0.15s all"
                                _hover={{
                                    $bg: 'bg-light-blue',
                                    $borderColor: 'cta',
                                }}
                                _active={{
                                    $bg: 'bg-light-blue',
                                    $borderColor: 'cta',
                                }}
                                onClick={() => onChangeActive(feed)}
                            >
                                <Box $d="flex" $flexDir="row" $mb="18" $alignItems="center">
                                    <Box $pr="10">
                                        <IconFeedbackBackground isUnread={isUnread} $isActive={feed.id === activeComment?.id}>
                                            <Text $textVariant="SmallTitle">{index + 1}</Text>
                                        </IconFeedbackBackground>
                                    </Box>
                                    <Text $textVariant="H6">{feed.user?.firstname}</Text>
                                    <Box $ml="auto">
                                        <Text $textVariant="P4" $colorScheme="secondary">
                                            {timeSince(lastComment !== null ? lastComment.createdAt : feed.createdAt)}
                                        </Text>
                                    </Box>
                                </Box>
                                <Text $textVariant="P4" $wordBreak="break-all">
                                    {displayComment(lastComment !== null ? lastComment.content : feed.content)}
                                </Text>
                                {Array.isArray(feed?.comments) && feed?.comments?.length > 0 && (
                                    <Text $textVariant="P4" $colorScheme="secondary" $mt="10">
                                        {feed?.comments?.length} repl{feed?.comments?.length > 1 ? 'ies' : 'y'}
                                    </Text>
                                )}
                            </Box>
                        );
                    })}
                </>
            ) : (
                <Text $textVariant="P4" $colorScheme="secondary">
                    Give feedback, ask a question, or just leave notes of appreciation. Click anywhere on the design to leave a comment.
                </Text>
            )}
        </Box>
    );
};
