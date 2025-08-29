import React from 'react';
import { Box } from '@components/Box';
import ArrowRightIcon from '@components/Svg/ArrowRight';
import { CardAttachment } from './CardAttachment.jsx';
import { useDetailContext } from './DetailContext.js';
import { useHistory } from 'react-router';
import { FEEDBACK_REQUEST } from '@constants/routes';
import IconFeedback from '@components/Svg/IconFeedback';
import { Text } from '@components/Text';
import WithLoggedUser from '@components/WithLoggedUser';
import { unreadCheck } from '../../utils/unreadCheck.js';

export const PresetMessageFileFeedback = WithLoggedUser(({ file, viewer }) => {
    const { request } = useDetailContext();
    const history = useHistory();

    const handleClickFile = file => {
        history.push(`${FEEDBACK_REQUEST.replace(':id', request.id)}?file=${file?.id}`, { from: 'files' });
    };

    const unreadComments = (file?.feedback || [])
        ?.map(feed => {
            const unreadDetailsComments = feed.comments?.filter(comment => unreadCheck(comment, viewer));
            const unreadCommentCount = unreadDetailsComments?.length ?? 0;
            const unreadFeedbackCount = unreadCheck(feed, viewer) ? 1 : 0;
            return unreadCommentCount + unreadFeedbackCount;
        })
        .reduce((prev, item) => prev + item, 0);

    return (
        <Box $maxW={['100%', '33%']} $w="100%" $pt="10">
            <CardAttachment
                {...file}
                downloadIcon={<ArrowRightIcon />}
                onClick={() => handleClickFile(file)}
                pl="14"
                pr="14"
                py="14"
                h="60"
                bg="bg-gray"
                _hover={{
                    $bg: 'white',
                }}
                requestId={request.id}
            >
                {Array.isArray(file.feedback) && file.feedback?.length > 0 && (
                    <Box $d="flex" $bg="badge-gray" $borderT="1" $borderTopStyle="solid" $borderTopColor="badge-gray" $py="4" $px="14" $radii="0 0 10px 10px">
                        <Box $d="inline-flex" $alignItems="center" $colorScheme="secondary">
                            <Box $d="inline-flex" $alignItems="center" $lineH="1" $fontSize="14" as="span">
                                <IconFeedback />
                            </Box>
                            <Text $textVariant="P5" $pl="5">
                                {file.feedback?.length}
                            </Text>
                        </Box>
                        {unreadComments > 0 && (
                            <Box $ml="auto">
                                <Box $d="inline-flex" $alignItems="center" $colorScheme="other-pink">
                                    <Box $radii="9999" $w="6" $h="6" $bg="other-pink" />
                                    <Text $textVariant="P5" $pl="6">
                                        {unreadComments} new comments
                                    </Text>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </CardAttachment>
        </Box>
    );
});
