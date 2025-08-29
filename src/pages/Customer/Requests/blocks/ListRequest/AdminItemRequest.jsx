import React, { useCallback, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import { Link } from '@components/Link';
import IconRateNeutral from '@components/Svg/IconRateNeutral';
import IconRateBad from '@components/Svg/IconRateBad';
import IconRateGreat from '@components/Svg/IconRateGreat';
import { Tooltip } from 'antd';
import moment from 'moment';
import { EllipsisMultiple } from '@components/EllipsisMultiple';
import { BRAND, DETAIL_REQUEST } from '@constants/routes';
import {
    ORDER_STATUS_LABELS as BADGE_STATUS,
    ORDER_STATUS_DELIVERED_PROJECT,
    ORDER_STATUS_DRAFT,
    ORDER_STATUS_ON_HOLD,
    ORDER_STATUS_ONGOING_PROJECT,
    ORDER_STATUS_COMPLETED,
    ORDER_STATUS_SUBMITTED,
} from '@constants/order';
import { ASSET_UNREAD_MESSAGE, ASSET_UNREAD_MESSAGE_ALT } from '@constants/assets';
import message from '@components/Message';
import { MARK_AS_COMPLETE, PAUSE_ORDER, CHANGE_ORDER_STATUS, RESUME_ORDER } from '@graphql/mutations/order';
import { useMutation } from '@apollo/client';
import { useNavSearchContext } from '@components/Basepage/NavSearch/index';
import RowDesignerField from '@pages/Admin/Requests/AccountsTab/blocks/RowDesignerField/index';
import { withResponsive } from '@components/ResponsiveProvider';
import IconWaitFeedback from '@components/Svg/IconWaitFeedback';
import IconWaitFeedbackHover from '@components/Svg/IconWaitFeedBack_hover';
import { Popup } from '@components/Popup';
import FormResumeRequest from '../DetailRequest/FormResumeRequest';
import FormRequestComplete from '../DetailRequest/FormRequestComplete';
import { RowItemContainer, PrioritySticker } from '../../style';

const RATE = {
    GREAT: 'Great',
    BAD: 'Bad',
    NEUTRAL: 'Neutral',
};

const RATE_MESSAGE = {
    [RATE.GREAT]: 'It was awesome',
    [RATE.BAD]: "It wasn't good",
    [RATE.NEUTRAL]: 'It was OK',
};

export const AdminRowItemRequest = withResponsive(
    ({
        id,
        index,
        name,
        category,
        status,
        rate,
        date,
        priority,
        enableDrag,
        optionComponent: OptionComponent,
        optionProps,
        unreadMessages,
        $isNotCustomer = false,
        brand,
        owners,
        windowWidth,
        workers,
        isLastRequest,
        company,
        feedback,
        refetchOrders,
    }) => {
        const isMobile = windowWidth <= 768;
        const { search } = useNavSearchContext();
        const [height, setHeight] = useState(86);
        /**
         * Function to check if filter has been selected or not
         * The content of the function is a bit repetitive but it's easy to debug this way
         */
        const hasFilter = useMemo(() => {
            // Check the filter through the URL
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const params = {};
                urlParams.forEach((value, key) => {
                    params[key] = value;
                });

                if (params?.tab && params?.tab?.toLowerCase() !== 'queue') {
                    return true;
                }

                // Check the status of the request
                const statusValue = params?.status;
                if (statusValue?.length && statusValue !== 'All') {
                    return true;
                }

                // Check if a brand has been selected
                if (params?.brand) {
                    return true;
                }

                // Check if a design has been selected
                if (params?.design?.length) {
                    return true;
                }

                // Check if a owner has been selected
                if (params?.owner) {
                    return true;
                }

                // Check if a designer has been selected
                if (params?.designer) {
                    return true;
                }

                // Check that no search has been performed
                if (search) {
                    return true;
                }

                // If everything is untouched, then no filter has been selected
                return false;
            } catch (err) {
                // If an error occured with the URL or window, we dont show the sticker
                return true;
            }
        }, [window?.location?.search]);

        if (hasFilter) enableDrag = false;

        const filteredWorkers = workers && workers?.length > 0 ? workers?.filter(worker => !worker.archived) : undefined;
        const designerIds = filteredWorkers ? filteredWorkers?.map(worker => worker.id) : undefined;
        const companyTeamId = company?.teams ? company?.teams[0]?.id : undefined;

        const [isOpen, setOpen] = useState(false);
        const [isShowResume, setIsShowResume] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const [isShowComplete, setIsShowComplete] = useState(false);
        const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
        const [pauseOrder] = useMutation(PAUSE_ORDER);
        const [resumeOrder] = useMutation(RESUME_ORDER);
        const [changeOrder] = useMutation(CHANGE_ORDER_STATUS);

        const colorRate = useMemo(() => {
            switch (rate) {
                case RATE.NEUTRAL:
                    return 'other-yellow';
                case RATE.GREAT:
                    return 'other-green';
                case RATE.BAD:
                    return 'other-red';
                default:
                    return undefined;
            }
        }, [rate]);

        const handleVisibleChange = newOpen => {
            setOpen(newOpen);
        };

        const dateNode = useMemo(() => {
            const dateMoment = moment(date);

            if (!dateMoment.isValid()) return '-';

            const fullDisplayedDate = dateMoment.format('DD MMM YYYY, HH:mm A');
            const diplayedDate = dateMoment.format('DD MMM, HH:mm A');

            const titleNode = <>{fullDisplayedDate}</>;

            return (
                <Tooltip color="white" title={titleNode}>
                    <span> {diplayedDate} </span>
                </Tooltip>
            );
        }, [date]);

        const handleChangeStatus = useCallback(
            async (status, values) => {
                let variables = {
                    id,
                    status,
                };
                if (status === ORDER_STATUS_COMPLETED) {
                    variables = {
                        ...variables,
                        ...values,
                    };
                    await markAsComplete({ variables });
                } else if (status === ORDER_STATUS_ON_HOLD) {
                    await pauseOrder({ variables });
                } else if (status === ORDER_STATUS_ONGOING_PROJECT) {
                    variables = {
                        ...variables,
                        ...values,
                    };
                    await resumeOrder({ variables });
                } else if (status === ORDER_STATUS_SUBMITTED) {
                    await changeOrder({ variables });
                }
            },
            [resumeOrder, pauseOrder, changeOrder, markAsComplete]
        );
        const handleResume = async move => {
            setIsShowResume(false);
            message.destroy();
            message.loading('Updating status');
            await handleChangeStatus(ORDER_STATUS_ONGOING_PROJECT, { move });
            // await refetchOrders();
            message.destroy();
            message.success('Request has been resumed');
        };

        const handleMarkComplete = async values => {
            message.destroy();
            message.loading('Updating status...');
            await handleChangeStatus(ORDER_STATUS_COMPLETED, values);
            message.destroy();
            message.success('Request completed. Your feedback has been submitted');
            setIsShowComplete(false);
        };
        return (
            <Draggable draggableId={`${id}`} index={index} isDragDisabled={$isNotCustomer || !enableDrag}>
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        $d="flex"
                        $flexDir="row"
                        $alignItems="center"
                        $flexWrap="nowrap"
                        className="row-request"
                        $pos="relative"
                        $borderBottom={!isLastRequest ? '1px solid #D5D6DD' : 'none'}
                        $cursor="default"
                        {...provided.draggableProps}
                        style={{
                            backgroundColor: status === ORDER_STATUS_ON_HOLD ? '#F3F3F3' : 'white',
                            ...provided.draggableProps.style,
                            ...(snapshot.isDragging
                                ? {
                                      opacity: 0.4,
                                  }
                                : {}),
                            cursor: 'default',
                        }}
                    >
                        <RowItemContainer style={{ cursor: 'default' }} $isOpen={isOpen}>
                            <Box $cursor="default" $d="flex" $alignItems="center" $overflow="hidden">
                                {!hasFilter &&
                                    ![ORDER_STATUS_ON_HOLD, ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_COMPLETED, ORDER_STATUS_DRAFT].includes(status) && (
                                        <PrioritySticker>{priority}</PrioritySticker>
                                    )}
                                <Box $w="100%" $minW="0" $maxW="300">
                                    <Box $d="flex" $h={height.toString()} $flexDir="row" $alignItems="center">
                                        {![ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_COMPLETED].includes(status) && (
                                            <Box $pl="16" $pr={['5', '10']} $cursor="move" $w="38" $minW="38" />
                                        )}
                                        {(rate && status === ORDER_STATUS_COMPLETED && (
                                            <Box $px="0" $pl="16" $colorScheme={colorRate} $w="38">
                                                <Tooltip
                                                    overlayStyle={{ paddingBottom: '5px' }}
                                                    color="white"
                                                    title={
                                                        <Text $radii="4" $colorScheme="primary" $textVariant="Badge">
                                                            {feedback?.comment ?? 'No Feedback'}
                                                        </Text>
                                                    }
                                                    placement="top"
                                                >
                                                    <Box as="span" $fontSize="22" $d="flex" $alignItems="center">
                                                        {rate === RATE.NEUTRAL && <IconRateNeutral />}
                                                        {rate === RATE.BAD && <IconRateBad />}
                                                        {rate === RATE.GREAT && <IconRateGreat />}
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        )) ||
                                            (status === ORDER_STATUS_DELIVERED_PROJECT && (
                                                <Box $px="0" $pl="16" $colorScheme={colorRate} $w="38" onClick={() => setIsShowComplete(true)}>
                                                    <Tooltip color="white" title={RATE_MESSAGE[rate]} trigger={['click']}>
                                                        <Box
                                                            as="span"
                                                            $fontSize="22"
                                                            $d="flex"
                                                            $alignItems="center"
                                                            onMouseEnter={() => {
                                                                setIsHovered(true);
                                                            }}
                                                            onMouseLeave={() => {
                                                                setIsHovered(false);
                                                            }}
                                                        >
                                                            {isHovered ? <IconWaitFeedbackHover /> : <IconWaitFeedback />}
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                            ))}
                                        <Box as={Link} to={DETAIL_REQUEST.replace(':id', id)} $px="14" $w="100%">
                                            <Box $d="flex" $flexDir="row" $alignItems="center">
                                                <Text $textVariant="P4" $colorScheme="secondary" $pl="4" $fontSize={['12', '14']} className={'as-link'}>
                                                    #{id}
                                                </Text>
                                                {unreadMessages > 0 && (
                                                    <Box
                                                        $pl="8"
                                                        $w="20"
                                                        $h="20"
                                                        $zIndex="10"
                                                        $textVariant="H6"
                                                        $colorScheme="white"
                                                        $cursor="pointer"
                                                        $pos="relative"
                                                        $d="flex"
                                                        $alignItems="center"
                                                    >
                                                        <img
                                                            src={ASSET_UNREAD_MESSAGE}
                                                            alt={ASSET_UNREAD_MESSAGE_ALT}
                                                            width={20}
                                                            height={20}
                                                            style={{ maxWidth: 'unset' }}
                                                        />
                                                        <Box
                                                            $pos="absolute"
                                                            $bg="other-pink"
                                                            $colorScheme="white"
                                                            $radii="100%"
                                                            $minW="20"
                                                            $minH="20"
                                                            $textVariant="SmallNotification"
                                                            $right="-20"
                                                            $top="-10"
                                                            $lineH="0"
                                                            $d="flex"
                                                            $alignItems="center"
                                                            $justifyContent="center"
                                                            $pt="2"
                                                        >
                                                            {unreadMessages}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Text className="as-link" $d="block" $textVariant="P4" $isTruncate $colorScheme="primary" $fontSize="16" $lineH="28">
                                                <EllipsisMultiple line={2} setHeight={setHeight} $lineHeight="20px" $fontSize="14">
                                                    {name}
                                                </EllipsisMultiple>
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                                {windowWidth > 768 && (
                                    <>
                                        <Box $w="100%" $maxW="140" hide="mobile">
                                            {!rate && status === ORDER_STATUS_DELIVERED_PROJECT ? (
                                                <Tooltip color="white" title="Your feedback is needed">
                                                    <Badge $variant={BADGE_STATUS[status]}>{BADGE_STATUS[status]}</Badge>
                                                </Tooltip>
                                            ) : (
                                                <Badge $variant={BADGE_STATUS[status]}>{BADGE_STATUS[status]}</Badge>
                                            )}
                                        </Box>

                                        {
                                            <Box $w="100%" $maxW="140" $py="12">
                                                {brand ? (
                                                    <Text as={Link} to={BRAND.replace(':brandId', brand?.id)} $textVariant="Badge" $colorScheme="cta">
                                                        {brand?.name}
                                                    </Text>
                                                ) : (
                                                    <Text $textVariant="P4" $colorScheme="primary">
                                                        -
                                                    </Text>
                                                )}
                                            </Box>
                                        }

                                        {
                                            <Box $w="100%" $maxW="186" hide="mobile">
                                                {companyTeamId ? (
                                                    <RowDesignerField
                                                        companyTeamId={companyTeamId}
                                                        requestId={id}
                                                        designerIds={designerIds}
                                                        requestStatus={status}
                                                    />
                                                ) : (
                                                    <Text $textVariant="Badge" $colorScheme="other-red">
                                                        No team assigned yet
                                                    </Text>
                                                )}
                                            </Box>
                                        }
                                        <Box $d="flex" $flexDir="row" $w="100%" $flex="1 0 0" $alignItems="center">
                                            <Tooltip color="white" title={category?.title}>
                                                <Box $maxW="120" $w="100%" $px="16" $py="12">
                                                    <Text
                                                        $textVariant="P4"
                                                        $colorScheme="primary"
                                                        $pr="4"
                                                        $whiteSpace="nowrap"
                                                        $fontSize={['12', '14']}
                                                        $textOverflow="ellipsis"
                                                        $overflow="hidden"
                                                    >
                                                        {category?.title}
                                                    </Text>
                                                </Box>
                                            </Tooltip>
                                            {!isMobile && (
                                                <Box $maxW="140" $w="100%" $px="16" $py="12">
                                                    <EllipsisMultiple $textVariant="P4" $colorScheme="primary" $textAlign="center" line={2} $w="108">
                                                        {owners.map(owner => `${owner.firstname} ${owner.lastname}`).join(', ')}
                                                    </EllipsisMultiple>
                                                </Box>
                                            )}
                                            <Box $px="16" $py="12" $w="100%" $maxW="142" hide="mobile" $textAlign="center">
                                                <Text $textVariant="P4" $colorScheme="primary" $whiteSpace="nowrap">
                                                    {dateNode}
                                                </Text>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                                {!$isNotCustomer && (
                                    <Box $px="16" $py="12" $w="100%" $maxW="78">
                                        <OptionComponent onOpenchange={handleVisibleChange} {...optionProps} />
                                    </Box>
                                )}
                            </Box>
                        </RowItemContainer>
                        <Popup
                            open={isShowResume}
                            onCancel={() => setIsShowResume(false)}
                            title="Resume Request"
                            $variant="default"
                            width={500}
                            centered
                            footer={null}
                        >
                            <FormResumeRequest onChange={handleResume} />
                        </Popup>
                        <Popup
                            open={isShowComplete}
                            onCancel={() => setIsShowComplete(false)}
                            $variant="default"
                            width={500}
                            destroyOnClose
                            centered
                            footer={null}
                        >
                            <FormRequestComplete onSuccessSubmit={handleMarkComplete} />
                        </Popup>
                    </Box>
                )}
            </Draggable>
        );
    }
);
