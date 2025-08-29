import React, { useMemo, useState } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import Avatar from '@components/Avatar';
import IconPause from '@components/Svg/IconPause';
import IconMarkComplete from '@components/Svg/IconMarkComplete';
import IconEdit from '@components/Svg/IconEdit';
import IconSubmit from '@components/Svg/IconSubmit';
import IconPlay from '@components/Svg/IconPlay';
import { BRAND } from '@constants/routes';
import { withResponsive } from '@components/ResponsiveProvider';
import { ORDER_STATUS_COMPLETED, ORDER_STATUS_ON_HOLD } from '@constants/order';
import { useDetailContext } from './DetailContext.js';
import { InfoDetail } from './InfoDetail.jsx';
import { useRequestActions } from './useRequestActions.jsx';
import { IconFeedback } from './CardAsideFeedback.jsx';

export const CardAsideDetail = withResponsive(({ hideHeader, windowWidth }) => {
    const { request, isSubscriptionPaused } = useDetailContext();
    const [isPauseResume, setIsPauseResume] = useState(false);
    const [isReopening, setIsReopening] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const brandImg = useMemo(() => {
        if (!request.brand) {
            return undefined;
        }
        return request.brand?.logos && request.brand.logos[0]?.url;
    }, [request.brand]);

    const {
        getPopupComplete,
        getPopupManageOwner,
        getPopupReopen,
        getPopupResume,
        handleClickComplete,
        handleClickManageOwner,
        handleClickPauseOrResume,
        handleClickReopen,
        handleClickSubmit,
        handleResumeSubscription,
        showHandlerComplete,
        showHandlerPauseOrResume,
        showHandlerReopen,
        showHandlerSubmit,
    } = useRequestActions(request);

    const isDraft = request.status === 'DRAFT';
    const isSubmitted = request.status === 'SUBMITTED';

    const onPauseResume = async () => {
        setIsPauseResume(true);
        await handleClickPauseOrResume();
        setIsPauseResume(false);
    };

    const onReopen = async () => {
        setIsReopening(true);
        handleClickReopen();
        setIsReopening(false);
    };

    const onComplete = async () => {
        setIsCompleting(true);
        handleClickComplete();
        setIsCompleting(false);
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        await handleClickSubmit();
        setIsSubmitting(false);
    };

    const isCompleted = request.rate && request.status === ORDER_STATUS_COMPLETED;

    return (
        <Box $mb={['0', '14']}>
            {getPopupComplete()}
            {getPopupResume()}
            {getPopupManageOwner()}
            {getPopupReopen()}
            {!hideHeader && (
                <Box
                    $px="20"
                    $py="14"
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="outline-gray"
                    $borderB="0"
                    $borderBottomStyle="solid"
                    $borderBottomColor="outline-gray"
                    $radii="10px 10px 0 0"
                >
                    <Text $textVariant="H6" $lineH="20">
                        Request details
                    </Text>
                </Box>
            )}
            <Box $px={['24', '20']} $py="14" $borderW={hideHeader ? '0' : '1'} $borderStyle="solid" $borderColor="outline-gray" $radii="0 0 10px 10px">
                <InfoDetail title="Brand">
                    {request.brand && request.brand.id ? (
                        <Box $d="flex" $pt="6" $alignItems="center">
                            <Avatar src={brandImg} size={27} name={request.brand?.name} $textVariant="SmallTitle" $fontSize={12} />
                            <Text
                                as="a"
                                href={BRAND.replace(':brandId', request.brand?.id)}
                                target="_blank"
                                $pl="10"
                                $textVariant="H6"
                                $colorScheme="cta"
                                $isTruncate
                                $maxW="190"
                            >
                                {request.brand?.name}
                            </Text>
                        </Box>
                    ) : (
                        <Text $textVariant="P4" $colorScheme="primary">
                            No brand selected
                        </Text>
                    )}
                </InfoDetail>
                <InfoDetail title="Category & Product">
                    <Text $textVariant="P4" $colorScheme="primary">
                        {request?.category?.title}
                        {request?.service?.name && ` - ${request?.service?.name}`}
                    </Text>
                </InfoDetail>
                <InfoDetail title="Owner(s)" tooltip={windowWidth >= 768 ? 'Owners of requests receive update notifications via email.' : undefined}>
                    <Box $d="flex" $alignItems="center">
                        <Text $isTruncate $textVariant="P4" $colorScheme="primary">
                            {request.owners.map(item => `${item.firstname} ${item.lastname}`).join(', ')}
                        </Text>
                        <Box $alignSelf="center" $h="20" $pl="8">
                            <Tooltip color="white" title="Manage" trigger="hover">
                                <Button
                                    type="link"
                                    $w={['18', '20']}
                                    $h="20"
                                    mobileH="18"
                                    $fontSize={['18', '20']}
                                    $p="0"
                                    $lineH="1"
                                    icon={<IconEdit />}
                                    onClick={handleClickManageOwner}
                                />
                            </Tooltip>
                        </Box>
                    </Box>
                </InfoDetail>
                <InfoDetail title="Designer(s)">
                    <Text $textVariant="P4" $colorScheme="primary">
                        {request.workers.length > 0 ? request.workers.map(item => `${item.firstname} ${item.lastname[0]}`).join(', ') : 'No designer assigned'}
                    </Text>
                </InfoDetail>
                {isSubmitted && (
                    <InfoDetail title="Last updated" $mb="14">
                        <Text $textVariant="P4" $colorScheme="primary">
                            {request?.updatedAt ? moment(request?.updatedAt).format('DD MMM, HH:mm A') : '-'}
                        </Text>
                    </InfoDetail>
                )}
                {!isSubmitted && (
                    <InfoDetail title={isDraft ? 'Created' : 'Last updated'} $mb="14">
                        <Text $textVariant="P4" $colorScheme="primary">
                            {moment(isDraft ? request.createdAt : request.updatedAt || request.submittedAt).format('DD MMM, HH:mm A')}
                        </Text>
                    </InfoDetail>
                )}
                {isCompleted && (
                    <InfoDetail title="Your Feedback" hide="desktop" $mt="14" $mb="0">
                        <Box $d="flex" $alignItems="center" $pt="4">
                            <IconFeedback rate={request.rate} $p="5" $fontSize="20" $lineH="1" $bg="bg-gray" $radii="4px" />
                            <Text $textVariant="P4" $pl="6">
                                {request.rate}
                            </Text>
                        </Box>
                    </InfoDetail>
                )}
                <Box hide="mobile">
                    {isSubscriptionPaused ? (
                        <Button type="primary" $h={['34', '44']} block $fontSize="12" onClick={handleResumeSubscription}>
                            Resume subscription
                        </Button>
                    ) : (
                        <>
                            {showHandlerPauseOrResume && (
                                <Button
                                    loading={isPauseResume}
                                    type="default"
                                    $h={['34', '44']}
                                    block
                                    icon={
                                        !isPauseResume ? (
                                            <Box $fontSize="16" $lineH="1">
                                                {request.status !== ORDER_STATUS_ON_HOLD ? <IconPause /> : <IconPlay />}
                                            </Box>
                                        ) : null
                                    }
                                    $mb="10"
                                    $fontSize="12"
                                    onClick={onPauseResume}
                                >
                                    {request.status !== ORDER_STATUS_ON_HOLD ? 'Pause request' : 'Resume request'}
                                </Button>
                            )}
                            {showHandlerComplete && (
                                <Button
                                    loading={isCompleting}
                                    type="primary"
                                    $h={['34', '44']}
                                    block
                                    $fontSize="12"
                                    icon={
                                        !isCompleting ? (
                                            <Box $fontSize="16" $lineH="1">
                                                <IconMarkComplete />
                                            </Box>
                                        ) : null
                                    }
                                    onClick={onComplete}
                                >
                                    Mark as complete
                                </Button>
                            )}
                            {showHandlerReopen && (
                                <Button loading={isReopening} type="default" $h={['34', '44']} block $fontSize="12" onClick={onReopen}>
                                    Reopen request
                                </Button>
                            )}
                            {showHandlerSubmit && (
                                <Button
                                    loading={isSubmitting}
                                    type="primary"
                                    $h={['34', '44']}
                                    block
                                    icon={
                                        !isSubmitting ? (
                                            <Box $fontSize="16" $lineH="1">
                                                <IconSubmit />
                                            </Box>
                                        ) : null
                                    }
                                    $mb="10"
                                    $fontSize="12"
                                    onClick={onSubmit}
                                >
                                    Submit Request
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
});
