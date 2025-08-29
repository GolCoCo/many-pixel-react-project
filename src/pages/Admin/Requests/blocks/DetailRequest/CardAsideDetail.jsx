import React, { useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Tooltip } from 'antd';
import moment from 'moment';
import slice from 'lodash/slice';
import includes from 'lodash/includes';
import { Box } from '@components/Box';
import { Link } from '@components/Link';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import Avatar from '@components/Avatar';
import { Popup } from '@components/Popup';
import message from '@components/Message';
import IconRateBad from '@components/Svg/IconRateBad';
import IconRateNeutral from '@components/Svg/IconRateNeutral';
import IconRateGreat from '@components/Svg/IconRateGreat';
import IconWarning from '@components/Svg/IconWarning';
import { PRIORITIZE_ORDER, UNPRIORITIZE_ORDER } from '@graphql/mutations/order';
import { BRAND, ACCOUNT_INFO } from '@constants/routes';
import { useDetailContext } from './DetailContext.js';
import { InfoDetail } from './InfoDetail.jsx';
import { useRequestActions } from './useRequestActions.jsx';
import capitalize from 'lodash/capitalize';

export const CardAsideDetail = ({ isWorker }) => {
    const { request, refetchRequests } = useDetailContext();
    const [activeTab, setActiveTab] = useState('DETAILS');
    const [isSettingPriority, setIsSettingPriority] = useState(false);
    const [isShowPriorityConfirm, setIsShowPriorityConfirm] = useState(false);
    const [prioritizeOrder] = useMutation(PRIORITIZE_ORDER);
    const [unprioritizeOrder] = useMutation(UNPRIORITIZE_ORDER);

    const brandImg = useMemo(() => {
        if (!request.brand) {
            return undefined;
        }
        return request.brand?.logos && request.brand.logos[0]?.url;
    }, [request.brand]);

    const { getPopupComplete, getPopupManageOwner, getPopupReopen, getPopupResume } = useRequestActions(request);

    const isDraft = request.status === 'DRAFT';
    const isSubmitted = request.status === 'SUBMITTED';

    const handleChangeTab = val => {
        if (val !== activeTab) {
            setActiveTab(val);
        }
    };

    const handleShowPriorityConfirm = () => {
        setIsShowPriorityConfirm(true);
    };

    const handleClose = () => {
        setIsShowPriorityConfirm(false);
    };

    const dateNow = moment().startOf('day');
    const lastPrioritized = request?.prioritizedAt ? moment(request?.prioritizedAt).startOf('day') : null;
    const dateDiff = request?.prioritizedAt ? dateNow.diff(lastPrioritized, 'days') : null;

    const handleUpdatePriority = async () => {
        setIsShowPriorityConfirm(false);
        setIsSettingPriority(true);

        const mutateFunc = dateDiff !== null && dateDiff < 1 ? unprioritizeOrder : prioritizeOrder;
        await mutateFunc({ variables: { id: request.id } })
            .then(async () => {
                setIsSettingPriority(false);
                message.destroy();
                message.success(
                    dateDiff !== null && dateDiff < 1
                        ? 'Removed from priority task'
                        : 'This task has been changed to priority'
                );
                await refetchRequests();
            })
            .catch(e => {
                console.log(e);
                setIsSettingPriority(false);
                message.destroy();
                message.error('Error on updating the priority');
            });
    };

    const rates = {
        Bad: { icon: IconRateBad, color: 'other-red' },
        Neutral: { icon: IconRateNeutral, color: 'other-yellow' },
        Great: { icon: IconRateGreat, color: 'other-green' },
    };

    const IconFeedback = ({ rate, ...boxProps }) => {
        const { icon: RateIcon, color } = rates[rate];
        return (
            <Box
                {...boxProps}
                $bg="bg-gray"
                $w="30"
                $h="30"
                $d="flex"
                $alignItems="center"
                $justifyContent="center"
                $colorScheme={color}
                $radii="4"
            >
                <RateIcon />
            </Box>
        );
    };

    return (
        <Box>
            {getPopupComplete()}
            {getPopupResume()}
            {getPopupManageOwner()}
            {getPopupReopen()}
            {isWorker ? (
                <Box
                    $px="20"
                    $py="14"
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="outline-gray"
                    $borderB="0"
                    $borderBottomStyle="solid"
                    $borderBottomColor="outline-gray"
                    style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                >
                    <Text $textVariant="H6" $lineH="20">
                        Request details
                    </Text>
                </Box>
            ) : (
                <Box
                    $px="20"
                    $pt="16"
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="outline-gray"
                    $borderB="0"
                    $borderBottomStyle="solid"
                    $borderBottomColor="outline-gray"
                    $mb="-1"
                    $d="flex"
                    $alignItems="flex-start"
                    style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                >
                    <Text
                        $cursor="pointer"
                        $textVariant="H6"
                        $pb="13"
                        $pos="relative"
                        $overflow="hidden"
                        $mr="27"
                        $colorScheme={activeTab === 'DETAILS' ? 'cta' : 'tertiary'}
                        onClick={() => handleChangeTab('DETAILS')}
                    >
                        Details
                        <Box
                            $h="3"
                            $w="48.531"
                            $bg="cta"
                            $pos="absolute"
                            $bottom="0"
                            $trans="left 250ms ease-in-out"
                            $left={activeTab === 'DETAILS' ? '0' : '-48.531'}
                        />
                    </Text>
                    <Text
                        $cursor="pointer"
                        $textVariant="H6"
                        $pb="13"
                        $pos="relative"
                        $overflow="hidden"
                        $colorScheme={activeTab === 'FEEDBACK' ? 'cta' : 'tertiary'}
                        onClick={() => handleChangeTab('FEEDBACK')}
                    >
                        Feedback
                        <Box
                            $h="3"
                            $w="66.141"
                            $bg="cta"
                            $pos="absolute"
                            $bottom="0"
                            $trans="left 250ms ease-in-out"
                            $left={activeTab === 'FEEDBACK' ? '0' : '-66.141'}
                        />
                    </Text>
                </Box>
            )}
            <Box
                $px="20"
                $py="14"
                $borderW="1"
                $borderStyle="solid"
                $borderColor="outline-gray"
                style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
            >
                {activeTab === 'DETAILS' ? (
                    <Box>
                        <InfoDetail title="Brand">
                            {request?.brand && request?.brand?.id ? (
                                <Box $d="flex" $pt="6" $alignItems="center">
                                    <Avatar
                                        src={brandImg}
                                        size={27}
                                        name={request.brand?.name}
                                        $textVariant="SmallTitle"
                                        $fontSize={12}
                                    />
                                    <Text
                                        as={Link}
                                        to={BRAND.replace(':brandId', request.brand?.id)}
                                        $pl="10"
                                        $textVariant="H6"
                                        $colorScheme="cta"
                                        $isTruncate
                                        $maxW="190"
                                    >
                                        {request?.brand?.name}
                                    </Text>
                                </Box>
                            ) : (
                                <Text $textVariant="P4" $colorScheme="primary">
                                    No brand selected
                                </Text>
                            )}
                        </InfoDetail>
                        <InfoDetail title="Account">
                            <Text $textVariant="P4" $colorScheme="primary" $d="flex" $alignItems="center">
                                <Text
                                    as={Link}
                                    to={{
                                        pathname: `${ACCOUNT_INFO.replace(':id?', request?.company?.id)}`,
                                        state: { previousPage: `/requests/${request.id}` },
                                    }}
                                    $textVariant="H6"
                                    $colorScheme="cta"
                                    $isTruncate
                                    $maxW="171"
                                >
                                    {request?.company?.name}
                                </Text>
                                {!isWorker &&
                                    !request?.company?.isNotesCleared &&
                                    request?.company?.notes?.length > 0 && (
                                        <Tooltip
                                            color="white"
                                            title={request?.company?.notes[request?.company?.notes?.length - 1]?.text}
                                            trigger="hover"
                                        >
                                            <Box $ml="6" $h="19.52">
                                                <IconWarning />
                                            </Box>
                                        </Tooltip>
                                    )}
                            </Text>
                        </InfoDetail>
                        <InfoDetail title="Category & Product">
                            <Text $textVariant="P4" $colorScheme="primary">
                                {request?.category?.title}
                                {request?.service?.name && ` - ${request?.service?.name}`}
                            </Text>
                        </InfoDetail>
                        <InfoDetail title="Owner(s)">
                            <Box $d="flex" $alignItems="center">
                                <Text $isTruncate $textVariant="P4" $colorScheme="primary">
                                    {request?.owners?.map(item => `${item.firstname} ${item.lastname}`).join(', ')}
                                </Text>
                            </Box>
                        </InfoDetail>
                        <InfoDetail title="Designer(s)">
                            <Text $textVariant="P4" $colorScheme="primary">
                                {request?.workers?.length > 0 && request?.workers?.length > 2 && (
                                    <Box>
                                        {slice(request?.workers, 0, 2).map((item, index) => (
                                            <Box key={item.id} $d="inline-block">
                                                {item.firstname} {item.lastname[0]}
                                                {index + 1 !== request?.workers?.length ? <>,&nbsp;</> : ''}
                                            </Box>
                                        ))}
                                        <Box $d="inline-block">
                                            <Tooltip
                                                color="white"
                                                title={
                                                    <Box $px="22">
                                                        <ul style={{ margin: 0, padding: 0 }}>
                                                            {slice(request?.workers, 2).map(item => (
                                                                <li key={item.id}>
                                                                    {item.firstname} {item.lastname[0]}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Box>
                                                }
                                                trigger="hover"
                                            >
                                                <Text $textVariant="Badge" $colorScheme="cta" $cursor="default">
                                                    +{request?.workers?.length - 2} more
                                                </Text>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                )}
                                {request?.workers?.length > 0 &&
                                    request?.workers?.length < 3 &&
                                    request?.workers?.map((item, index) => (
                                        <Box key={item.id} $d="inline-block">
                                            {item.firstname} {item.lastname[0]}
                                            {index + 1 !== request?.workers?.length ? <>,&nbsp;</> : ''}
                                        </Box>
                                    ))}
                                {request?.workers?.length === 0 && 'No designer assigned'}
                            </Text>
                        </InfoDetail>
                        <InfoDetail title="Plan">
                            {request?.company?.subscription?.plan?.name && (
                                <>
                                    <Text $textVariant="P4" $colorScheme="primary">
                                        {request?.company?.subscription?.plan?.name} -{' '}
                                        {capitalize(request?.company?.subscription?.plan?.interval)}
                                    </Text>
                                    <Text $textVariant="P5" $colorScheme="secondary">
                                        First Subscription on{' '}
                                        {moment(request?.company?.subscription?.createdAt).format('MMM DD, YYYY')}
                                    </Text>
                                </>
                            )}
                        </InfoDetail>
                        {isDraft && (
                            <InfoDetail title="Last updated" $mb="14">
                                <Text $textVariant="P4" $colorScheme="primary">
                                    {moment(request.updatedAt).format('DD MMM, HH:mm A')}
                                </Text>
                            </InfoDetail>
                        )}
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
                                    {moment(
                                        isDraft ? request.createdAt : request.updatedAt || request.submittedAt
                                    ).format('DD MMM, HH:mm A')}
                                </Text>
                            </InfoDetail>
                        )}
                        {!includes(['ON_HOLD', 'DELIVERED_PROJECT', 'COMPLETED', 'DRAFT'], request?.status) &&
                            !isWorker && (
                                <Box>
                                    <Button
                                        loading={isSettingPriority}
                                        type="default"
                                        $h="34"
                                        block
                                        $mb="8"
                                        $fontSize="12"
                                        onClick={
                                            dateDiff !== null && dateDiff < 1
                                                ? handleUpdatePriority
                                                : handleShowPriorityConfirm
                                        }
                                    >
                                        {dateDiff !== null && dateDiff < 1
                                            ? 'Unprioritize Request'
                                            : 'Prioritize Request'}
                                    </Button>
                                    <Text $textVariant="P5" $colorScheme="secondary" $whiteSpace="pre">
                                        Priority request only applicable for one day.
                                    </Text>
                                </Box>
                            )}
                    </Box>
                ) : (
                    <Box>
                        {request?.rate && request?.status === 'COMPLETED' ? (
                            <Box>
                                <Box $d="flex" $alignItems="center" $mb="12">
                                    <Box $mr="10">
                                        <IconFeedback rate={request?.rate} $fontSize="20" $lineH="1" />
                                    </Box>
                                    <Text $textVariant="H5" $colorScheme="primary">
                                        {request?.rate}
                                    </Text>
                                </Box>
                                <Text $textVariant="P4" $colorScheme="primary">
                                    {request?.feedback?.comment}
                                </Text>
                            </Box>
                        ) : (
                            <Text $textVariant="P4" $colorScheme="primary">
                                No feedback yet.
                            </Text>
                        )}
                    </Box>
                )}
            </Box>
            <Popup
                width={436}
                open={isShowPriorityConfirm}
                title="Prioritize request"
                $variant="delete"
                centered
                footer={null}
                onCancel={handleClose}
                title$colorScheme="primary"
                closable={false}
            >
                <Text $textVariant="P4" $mb="30">
                    This request will be moved to the top of the queue.
                    <br />
                    This will affect the Customer's side.
                </Text>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button $h="34" type="default" $mr="14" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button $h="34" type="primary" onClick={handleUpdatePriority}>
                        Update
                    </Button>
                </Box>
            </Popup>
        </Box>
    );
};
