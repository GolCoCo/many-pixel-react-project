import React from 'react';
import styled from 'styled-components';
import Avatar from '@components/Avatar';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import * as theme from '@components/Theme';
import moment from 'moment';
import { mediaQueryVariantCss } from '@components/Utils';
import { formatAction } from '@utils/formatAction';
import logo from '@public/assets/icons/logo_bot_small.png';
import { PresetMessageBrief } from './PresetMessageBrief';
import { PresetMessageMp } from './PresetMessageMp';
import { PresetMessageFileFeedback } from './PresetMessageFileFeedback';

const wrapDangerous = text => {
    return { __html: text };
};

const ActionRenderer = styled(Box)`
    ${theme.TYPO_P4};
    line-height: 21px;
    color: ${theme.COLOR_TEXT_SECONDARY};
    padding-left: 4px;
    display: flex;
    align-items: flex-end;

    ${mediaQueryVariantCss('mobile')`
        padding-left: 0px;
    `}

    p {
        margin-bottom: 0;
    }

    .completed {
        color: ${theme.COLOR_OTHERS_GREEN};
    }

    .deleted {
        color: ${theme.COLOR_OTHERS_RED};
    }

    .bold {
        ${theme.TYPO_BADGE};
        color: ${theme.COLOR_TEXT_PRIMARY};
    }

    .mr-4 {
        margin-right: 4px;
    }
    .ml-4 {
        margin-left: 4px;
    }
`;

export const MessageTypeAction = ({ usersOnline, user, createdAt, text, actionType, actionMeta, actionFile, id }) => {
    const imgSrc = actionType === 'SUBMITTED_BOT' ? logo : user?.picture?.url;
    const userName = user ? `${user?.firstname ?? ''}` : 'ManyPixels Bot';
    const isOnline = usersOnline?.some(userId => user?.id === userId);
    const handleImageUrl = () => {
        if (user?.picture?.url?.includes('https://assets.manypixels.co') || user?.picture?.url?.includes('https://assets-staging.manypixels.co')) {
            return user?.picture?.url;
        }
        try {
            const filename = new URL(user?.picture?.url).pathname.split('/').pop();
            return `https://assets.manypixels.co/${filename}`;
        } catch {
            return imgSrc;
        }
    };
    return (
        <Box $d="flex" $pos="relative" $px={['16', '20']} $py="8" $w="100%" $trans="0.2s all" $bg="white" $wordBreak="break-word">
            <Box>
                <Avatar src={handleImageUrl()} size={34} $fontSize={12} name={userName} isActive={isOnline} showActive={isOnline} $textVariant="SmallTitle" />
            </Box>
            <Box $pl="16" $flex={1} $alignSelf="center">
                <Box $d="flex" $alignItems="center" $flexWrap="wrap">
                    <Box $d="flex" $flexDir={['column', 'row']} $alignItems={['flex-start', 'center']}>
                        <Text $textVariant="H6" $colorScheme="primary">
                            {userName}
                        </Text>
                        {actionType !== 'SUBMITTED_BOT' && text && (
                            <Box hide="mobile">
                                <ActionRenderer dangerouslySetInnerHTML={wrapDangerous(formatAction(text))} />
                            </Box>
                        )}
                    </Box>
                    <Text $textVariant="P4" $ml="8" $colorScheme="secondary" $alignSelf={['flex-start', 'center']} $pt={['2', '0']}>
                        {moment(createdAt).format('DD MMM YY, HH:mm')}
                    </Text>
                </Box>
                {actionType !== 'SUBMITTED_BOT' && text && (
                    <Box hide="desktop" $pt="6">
                        <ActionRenderer dangerouslySetInnerHTML={wrapDangerous(formatAction(text))} />
                    </Box>
                )}
                {actionType === 'BRIEF' && <PresetMessageBrief renderer={actionMeta} />}
                {actionType === 'SUBMITTED_BOT' && <PresetMessageMp renderer={actionMeta} />}
                {actionType === 'FILE_FEEDBACK' && actionFile && <PresetMessageFileFeedback renderer={actionMeta} file={actionFile} messageId={id} />}
            </Box>
        </Box>
    );
};
