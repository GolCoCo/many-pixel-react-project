import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Tooltip } from 'antd';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Link } from '@components/Link';
import { Checkbox } from '@components/Checkbox';
import message from '@components/Message';
import ArrowDownIcon from '@components/Svg/ArrowDown';
import IconWarning from '@components/Svg/IconWarning';
import { MANAGE_TEAM, ACCOUNT_INFO } from '@constants/routes';
import { CHECK_COMPANY } from '@graphql/mutations/checker';
import { Button } from '@components/Button';
import { Image } from '@components/Image';
import StatusColoredText from '@components/Text/StatusColoredText';
import { computeStatusFinal } from '@utils/subscription';
import AccountRequestsList from '../AccountRequestsList';

const AccountPanel = ({
    activeFilterStatusTab,
    selectedStatus,
    company,
    selectedKeyword,
    companyRefetch,
    selectedDesigner,
    isWorker,
    designerId,
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isShowPaused, setIsShowPaused] = useState(false);
    const [orderActiveStatusTab, setOrderActiveStatusTab] = useState(activeFilterStatusTab);
    const [queueNotifCount, setQueueNotifCount] = useState(0);
    const [deliveredNotifCount, setDeliveredNotifCount] = useState(0);
    const [draftNotifCount, setDraftNotifCount] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [checkCompany] = useMutation(CHECK_COMPANY);

    useEffect(() => {
        setOrderActiveStatusTab(activeFilterStatusTab);
    }, [activeFilterStatusTab]);

    const handleOpenPanel = ev => {
        const nodeName = ev?.target?.nodeName?.toLowerCase();

        if (nodeName !== 'a' && nodeName !== 'button') {
            setIsPanelOpen(old => !old);
        }
    };

    const handleShowPaused = () => {
        setIsShowPaused(!isShowPaused);
    };

    const handleChangeStatus = val => {
        setOrderActiveStatusTab(val);
    };

    const handleQueueNotifCount = val => {
        setQueueNotifCount(val);
    };

    const handleDeliveredNotifCount = val => {
        setDeliveredNotifCount(val);
    };

    const handleDraftNotifCount = val => {
        setDraftNotifCount(val);
    };

    const companyTeamId = company?.teams ? company?.teams[0]?.id : undefined;

    const handleCheckAccount = async ev => {
        // Prevent panel header triggered because button is inside same div container
        if (ev) {
            ev.stopPropagation();
        }
        setIsChecking(true);
        try {
            await checkCompany({ variables: { companyId: company?.id } });
            await companyRefetch();
            setIsChecking(false);
            setIsPanelOpen(false);
            message.destroy();
        } catch (e) {
            console.log(e);
            setIsChecking(false);
            message.destroy();
            message.error('Error on checking account');
        }
    };

    const checkedLabel = company?.checkedBy ? 'Checked' : 'Check';

    return (
        <Box $mb="21">
            <Box
                $bg="#FAFAFA"
                $cursor="pointer"
                $userSelect="none"
                $borderW="1"
                $borderStyle="solid"
                $borderColor="other-gray"
                onClick={handleOpenPanel}
            >
                <Box $d="flex" $alignItems="center" $justifyContent="space-between" $h="52">
                    <Box $d="flex" $alignItems="center">
                        <Box $mx="16" $d="flex" $alignItems="center">
                            <Text
                                as={Link}
                                to={{
                                    pathname: `${ACCOUNT_INFO.replace(':id?', company?.id)}`,
                                    state: { previousPage: '/requests' },
                                }}
                                $textVariant="Badge"
                            >
                                {company?.name}
                            </Text>
                            {!isWorker && !company?.isNotesCleared && company?.notes?.length > 0 && (
                                <Tooltip
                                    color="white"
                                    title={company?.notes[company?.notes?.length - 1]?.text}
                                    trigger="hover"
                                >
                                    <Box $ml="8" $h="19.52">
                                        <IconWarning />
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                        <Box $h="32" $w="1" $bg="outline-gray" />
                        <Text
                            $mx="16"
                            $textVariant="P4"
                            $colorScheme={company?.teams?.length > 0 ? 'primary' : 'other-red'}
                        >
                            Team:{' '}
                            {company?.teams?.length > 0 ? (
                                <Text
                                    $textVariant="Badge"
                                    as={Link}
                                    to={MANAGE_TEAM.replace(':id', company?.teams[0]?.id)}
                                >
                                    {company?.teams[0]?.name}
                                </Text>
                            ) : (
                                <Box as="span">Not assigned yet</Box>
                            )}
                        </Text>
                        {company?.subscription
                            ? (() => {
                                  const status = computeStatusFinal(company.subscription);

                                  return (
                                      <>
                                          <Box $h="32" $w="1" $bg="outline-gray" />
                                          <Text $mx="16" $textVariant="P4" $colorScheme="primary">
                                              <StatusColoredText status={status}>
                                                  {company.subscription?.plan?.name}
                                              </StatusColoredText>{' '}
                                              -{' '}
                                              <Text as="span" $colorScheme="secondary">
                                                  {capitalize(company.subscription?.plan?.interval)}
                                              </Text>
                                          </Text>
                                      </>
                                  );
                              })()
                            : null}
                        {!designerId && company?.assignedDesigners?.length > 0 && (
                            <>
                                <Box $h="32" $w="1" $bg="outline-gray" />
                                <Text $mx="16" $textVariant="P4" $colorScheme="primary" $maxW="420">
                                    {company.assignedDesigners.map((assignedDesigner, index) => {
                                        if (!assignedDesigner?.designer) return null;

                                        const { designer, type } = assignedDesigner;

                                        if (designer?.id && type?.id) {
                                            return (
                                                <Text
                                                    as="span"
                                                    $colorScheme="primary"
                                                    key={`${type.id}-${designer.id}`}
                                                >
                                                    [{type.name}]{' '}
                                                    <Link to={`/member/${designer.id}`}>
                                                        {designer.firstname} {designer.lastname[0]}
                                                    </Link>
                                                    {index + 1 !== company.assignedDesigners.length ? ', ' : ''}
                                                </Text>
                                            );
                                        }

                                        return null;
                                    })}
                                </Text>
                            </>
                        )}
                        {designerId && (
                            <>
                                <Box $h="32" $w="1" $bg="outline-gray" />
                                <Text $mx="16" $textVariant="P4" $colorScheme="primary" $maxW="420">
                                    {company?.assignedDesigners?.map((assignedDesigner, index) => {
                                        if (assignedDesigner?.designer?.id === designerId) {
                                            return (
                                                <Box as="span" key={assignedDesigner?.designer?.id}>
                                                    [{assignedDesigner?.type?.name}]{' '}
                                                    {assignedDesigner?.designer?.firstname}{' '}
                                                    {assignedDesigner?.designer?.lastname[0]}
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })}
                                </Text>
                            </>
                        )}
                    </Box>
                    <Box $d="flex" $alignItems="center">
                        {company?.checkedBy && !isWorker && (
                            <>
                                <Image
                                    src={company?.checkedBy?.manager?.picture?.url}
                                    name={`${company?.checkedBy?.manager?.firstname ?? ''}`}
                                    size={32}
                                    $fontSize="16"
                                    isRounded
                                />
                                <Tooltip color="white" trigger="hover" title={company?.checkedBy?.manager?.firstname}>
                                    <Box $ml="8">
                                        <Text $textVariant="P5" $colorScheme="secondary">
                                            {moment(company?.checkedBy?.checkedAt).fromNow()}
                                        </Text>
                                    </Box>
                                </Tooltip>
                            </>
                        )}
                        {!isWorker && (
                            <Button
                                type="primary"
                                disabled={isChecking}
                                $textTransform="unset"
                                onClick={handleCheckAccount}
                                fontFamily="Mulish"
                                $fontSize="12"
                                $fontWeight="900"
                                $lineH="19"
                                $h="30"
                                $ml="14"
                                $px="16"
                                $minW="94"
                            >
                                {isChecking ? 'Checking' : checkedLabel}
                            </Button>
                        )}
                        <Box
                            $h="20"
                            $px="17.8"
                            $cursor="pointer"
                            $transform={isPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                            $trans="transform 250ms ease-in-out"
                        >
                            <ArrowDownIcon />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {isPanelOpen ? (
                <Box>
                    <Box
                        $d="flex"
                        $justifyContent="space-between"
                        $px="17"
                        $pt="17"
                        $borderW="0"
                        $borderL="1"
                        $borderR="1"
                        $borderStyle="solid"
                        $borderColor="other-gray"
                        $bg="white"
                        $pos="relative"
                        $zIndex="1"
                    >
                        <Box $d="flex" $alignItems="center">
                            {activeFilterStatusTab === 'QUEUE' && (
                                <Box
                                    onClick={() => handleChangeStatus('QUEUE')}
                                    $d="flex"
                                    $mr="27"
                                    $alignItems="flex-start"
                                    $cursor="pointer"
                                >
                                    <Text
                                        $textVariant="H6"
                                        $colorScheme={orderActiveStatusTab === 'QUEUE' ? 'cta' : 'primary'}
                                        $pb="13"
                                        $pos="relative"
                                        $overflow="hidden"
                                    >
                                        Queue
                                        <Box
                                            $h="3"
                                            $w="44.094"
                                            $bg="cta"
                                            $pos="absolute"
                                            $bottom="0"
                                            $trans="left 250ms ease-in-out"
                                            $left={orderActiveStatusTab === 'QUEUE' ? '0' : '44.094'}
                                        />
                                    </Text>
                                    {queueNotifCount > 0 && (
                                        <Text
                                            $ml="6"
                                            $textVariant="SmallTitle"
                                            $colorScheme="white"
                                            $bg="other-pink"
                                            $radii="12"
                                            $px="9"
                                            $lineH="20"
                                            $minW="28"
                                            $textAlign="center"
                                        >
                                            {queueNotifCount}
                                        </Text>
                                    )}
                                </Box>
                            )}
                            {((!selectedStatus.includes('ALL') && activeFilterStatusTab === 'DELIVERED') ||
                                (selectedStatus.includes('ALL') && activeFilterStatusTab !== 'DELIVERED')) && (
                                <Box
                                    onClick={() => handleChangeStatus('DELIVERED')}
                                    $d="flex"
                                    $mr="27"
                                    $alignItems="flex-start"
                                    $cursor="pointer"
                                >
                                    <Text
                                        $textVariant="H6"
                                        $colorScheme={orderActiveStatusTab === 'DELIVERED' ? 'cta' : 'primary'}
                                        $pb="13"
                                        $pos="relative"
                                        $overflow="hidden"
                                    >
                                        Delivered
                                        <Box
                                            $h="3"
                                            $w="64.813"
                                            $bg="cta"
                                            $pos="absolute"
                                            $bottom="0"
                                            $trans="left 250ms ease-in-out"
                                            $left={orderActiveStatusTab === 'DELIVERED' ? '0' : '64.813'}
                                        />
                                    </Text>
                                    {deliveredNotifCount > 0 && (
                                        <Text
                                            $ml="6"
                                            $textVariant="SmallTitle"
                                            $colorScheme="white"
                                            $bg="other-pink"
                                            $radii="12"
                                            $px="9"
                                            $lineH="20"
                                            $minW="28"
                                            $textAlign="center"
                                        >
                                            {deliveredNotifCount}
                                        </Text>
                                    )}
                                </Box>
                            )}
                            {((!selectedStatus.includes('ALL') && activeFilterStatusTab === 'DRAFT') ||
                                (selectedStatus.includes('ALL') && activeFilterStatusTab !== 'DRAFT')) &&
                                !isWorker && (
                                    <Box
                                        onClick={() => handleChangeStatus('DRAFT')}
                                        $d="flex"
                                        $alignItems="flex-start"
                                        $cursor="pointer"
                                    >
                                        <Text
                                            $textVariant="H6"
                                            $colorScheme={orderActiveStatusTab === 'DRAFT' ? 'cta' : 'primary'}
                                            $pb="13"
                                            $pos="relative"
                                            $overflow="hidden"
                                        >
                                            Draft
                                            <Box
                                                $h="3"
                                                $w="36.859"
                                                $bg="cta"
                                                $pos="absolute"
                                                $bottom="0"
                                                $trans="left 250ms ease-in-out"
                                                $left={orderActiveStatusTab === 'DRAFT' ? '0' : '36.859'}
                                            />
                                        </Text>
                                        {draftNotifCount > 0 && (
                                            <Text
                                                $ml="6"
                                                $textVariant="SmallTitle"
                                                $colorScheme="white"
                                                $bg="other-pink"
                                                $radii="12"
                                                $px="9"
                                                $lineH="20"
                                                $minW="28"
                                                $textAlign="center"
                                            >
                                                {draftNotifCount}
                                            </Text>
                                        )}
                                    </Box>
                                )}
                        </Box>
                        {orderActiveStatusTab === 'QUEUE' &&
                            !selectedStatus.includes('SUBMITTED') &&
                            !selectedStatus.includes('ONGOING_PROJECT') &&
                            !isWorker && (
                                <Box $mt="-2" $d="flex">
                                    <Checkbox
                                        checked={isShowPaused}
                                        onChange={handleShowPaused}
                                        $check$colorScheme="white"
                                    >
                                        <Text $d="inline-block" $textVariant="P4" $colorScheme="gray">
                                            Show paused request
                                        </Text>
                                    </Checkbox>
                                </Box>
                            )}
                    </Box>
                    <AccountRequestsList
                        isWorker={isWorker}
                        keyword={selectedKeyword}
                        designer={selectedDesigner}
                        companyId={company?.id}
                        companyTeamId={companyTeamId}
                        isShowPaused={isShowPaused}
                        orderActiveStatusTab={orderActiveStatusTab}
                        selectedStatus={selectedStatus}
                        activeFilterStatusTab={activeFilterStatusTab}
                        handleQueueNotifCount={handleQueueNotifCount}
                        handleDeliveredNotifCount={handleDeliveredNotifCount}
                        handleDraftNotifCount={handleDraftNotifCount}
                    />
                </Box>
            ) : null}
        </Box>
    );
};

export default AccountPanel;
