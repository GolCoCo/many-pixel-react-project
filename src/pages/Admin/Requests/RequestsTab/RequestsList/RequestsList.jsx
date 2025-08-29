import React, { memo, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConfigProvider, Tooltip } from 'antd';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { Badge } from '@components/Badge';
import IconNoData from '@components/Svg/IconNoData';
import IconWarning from '@components/Svg/IconWarning';
import IconQuestions from '@components/Svg/IconQuestions';
import { ALL_ADMIN_ORDERS } from '@graphql/queries/order';
import { ORDER_STATUS_LABELS as BADGE_STATUS } from '@constants/order';
import { USER_TYPE_WORKER } from '@constants/account';
import { DETAIL_REQUEST, MANAGE_TEAM, BRAND, ACCOUNT_INFO, MEMBER_INFO } from '@constants/routes';
import { useLocation } from 'react-router-dom';
import { Pagination } from '@components/Pagination';
import styled from 'styled-components';
import StatusColoredText from '@components/Text/StatusColoredText';
import RowDesignerField from '../blocks/RowDesignerField';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';
import { ASSET_UNREAD_MESSAGE, ASSET_UNREAD_MESSAGE_ALT } from '@constants/assets';

const StyledLink = styled(Link)`
    position: relative;
    display: block;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 16px;
`;

const CustomEmptyTable = () => {
    return (
        <Box $textAlign="center">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No requests found
            </Text>
        </Box>
    );
};

const RequestsList = memo(({ filters, viewer, designerId }) => {
    const parsed = qs.parse(window.location.search);
    const [page, setPage] = useState(parsed.page ? parseInt(parsed.page) : 1);
    const [pageSize, setPageSize] = useState(parsed.pageSize ? parseInt(parsed.pageSize) : 10);

    const skip = (page - 1) * pageSize;

    const { loading, data } = useQuery(ALL_ADMIN_ORDERS, {
        variables: { ...filters, skip, first: pageSize, page: 'requests' },
        fetchPolicy: 'network-only',
    });
    const location = useLocation();
    const { push } = useHistory();
    const changeParams = useCallback(
        newParams => {
            const location = window.location;
            const parsed = qs.parse(window.location.search);
            const stringify = qs.stringify(Object.assign(parsed, newParams));
            push({
                pathname: location.pathname,
                search: stringify,
            });
        },
        [push]
    );

    const isWorker = viewer?.role === USER_TYPE_WORKER;

    const { data: orders, total: ordersTotalCount } = data?.allAdminOrders || {
        data: [],
        total: 0,
    };

    const handleChangePageSize = (current, size) => {
        setPageSize(size);
        setPage(1);
        changeParams({ pageSize: size, page: 1 });
    };

    const handleChangePage = (current, size) => {
        setPage(current);
        changeParams({ page: current });
    };

    if (loading) {
        return (
            <Box>
                <Skeleton $w="90" $h="20" $mb="21" />
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                    <Box $px="16" $py="16" $bg="#FAFAFA">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            </Box>
        );
    }

    const columns = [
        {
            title: 'Request',
            dataIndex: 'name',
            key: 'name',
            width: '162px',
            render: (name, row) => {
                const dateNow = moment().startOf('day');
                const lastPrioritized = row?.prioritizedAt ? moment(row?.prioritizedAt).startOf('day') : null;
                const dateDiff = row?.prioritizedAt ? dateNow.diff(lastPrioritized, 'days') : null;

                return (
                    <Box $mt="-20" $mb="-20" $ml="-16">
                        <StyledLink to={DETAIL_REQUEST.replace(':id', row.id)}>
                            {dateDiff !== null && dateDiff < 1 ? (
                                <Tooltip color="white" title="Priority Request" trigger="hover">
                                    <Box $w="5" $h="100%" $cursor="pointer" $bg="other-red" $left="0" $top="0" $pos="absolute" />
                                </Tooltip>
                            ) : null}
                            <Box $d="flex" $alignItems="center">
                                <Text $textVariant="Badge" $colorScheme="cta" $mr="6">
                                    #{row.id}
                                </Text>
                                {/* {row.unreadMessages > 0 && <Box $w="12" $h="12" className="vignette" $bg="other-pink" $radii="100%" />} */}
                                {row.unreadMessages > 0 && (
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
                                        <img src={ASSET_UNREAD_MESSAGE} alt={ASSET_UNREAD_MESSAGE_ALT} width={20} height={20} style={{ maxWidth: 'unset' }} />
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
                                            {row.unreadMessages}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            <Text $textVariant="P5" $colorScheme="gray">
                                {name}
                            </Text>
                        </StyledLink>
                    </Box>
                );
            },
        },
        {
            title: 'Account',
            dataIndex: 'company',
            key: 'company',
            width: '153.33px',
            render: company => (
                <Box $d="flex" $alignItems="center">
                    <Text
                        as={Link}
                        to={{
                            pathname: `${ACCOUNT_INFO.replace(':id?', company?.id)}`,
                            state: { previousPage: '/requests' },
                        }}
                        $isTruncate
                        $maxW="84"
                        $textVariant="Badge"
                        $colorScheme="cta"
                    >
                        {company.name}
                    </Text>
                    {!isWorker && !company?.isNotesCleared && company?.notes?.length > 0 && (
                        <Tooltip color="white" title={company?.notes[company?.notes?.length - 1]?.text} trigger="hover">
                            <Box $ml="6" $h="19.52">
                                <IconWarning />
                            </Box>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
        {
            title: 'User',
            dataIndex: 'customer',
            key: 'customer',
            width: '140px',
            render: customer => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {customer?.firstname} {customer?.lastname}
                </Text>
            ),
        },
        {
            title: 'Plan',
            dataIndex: 'company',
            key: 'plan',
            width: '140px',
            render: company => (
                <Box>
                    <Text $textVariant="P4" $colorScheme="gray">
                        {<StatusColoredText status={company?.subscription?.statusFinal}>{company?.subscription?.plan?.name}</StatusColoredText> ?? 'N/A'}
                    </Text>
                    <Text $textVariant="P5" $colorScheme="secondary">
                        {capitalize(company?.subscription?.plan?.interval ?? '-')}
                    </Text>
                </Box>
            ),
        },
        {
            title: 'Product',
            dataIndex: 'service',
            key: 'product',
            width: '170.33px',
            render: (service, row) => (
                <Box>
                    <Text $textVariant="P4" $colorScheme="gray">
                        {service.name}
                    </Text>
                    <Text $textVariant="P5" $colorScheme="secondary">
                        {row.category.title}
                    </Text>
                </Box>
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            width: '150.33px',
            render: brand =>
                brand ? (
                    <Text as={Link} to={BRAND.replace(':brandId', brand?.id)} $textVariant="Badge" $colorScheme="cta">
                        {brand?.name}
                    </Text>
                ) : (
                    <Text $textVariant="P4" $colorScheme="primary">
                        -
                    </Text>
                ),
        },
        {
            title: 'Team',
            dataIndex: 'company',
            key: 'team',
            width: '90px',
            render: company => (
                <Text as={Link} to={MANAGE_TEAM.replace(':id', company?.teams[0]?.id)} $textVariant="Badge" $colorScheme="cta">
                    {company?.teams[0]?.name ?? 'N/A'}
                </Text>
            ),
        },
        {
            title: 'Last updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '141px',
            render: updatedAt => {
                const dateNow = moment().startOf('day');
                const lastUpdated = moment(updatedAt).startOf('day');
                const dateDiff = dateNow.diff(lastUpdated, 'days');

                let formattedLastUpdateDate;
                switch (dateDiff) {
                    case 0:
                        formattedLastUpdateDate = 'Today';
                        break;
                    case 1:
                        formattedLastUpdateDate = 'Yesterday';
                        break;
                    default:
                        formattedLastUpdateDate = moment(updatedAt).format('D MMM');
                        break;
                }

                const formattedTime = moment(updatedAt).format('H: mm');

                return (
                    <Text $textVariant="P4" $colorScheme="gray">
                        {formattedLastUpdateDate}, {formattedTime}
                    </Text>
                );
            },
        },
        {
            title: 'Designer(s)',
            dataIndex: 'workers',
            key: 'designers',
            width: '230px',
            render: (workers, row) => {
                const filteredWorkers = workers && workers?.length > 0 ? workers?.filter(worker => !worker.archived) : undefined;
                const designerIds = filteredWorkers ? filteredWorkers?.map(worker => worker.id) : undefined;

                return isWorker || designerId ? (
                    <>
                        {workers && workers?.length > 0
                            ? workers?.map((worker, index) => (
                                  <Box $my="1" key={worker.id} $d="inline-block">
                                      <Text
                                          as={Link}
                                          to={{
                                              pathname: MEMBER_INFO.replace(':id', worker.id),
                                              state: { previousPage: location.pathname },
                                          }}
                                          $textVariant="Badge"
                                          $colorScheme="cta"
                                      >
                                          {worker.firstname} {worker.lastname}
                                      </Text>
                                      {index + 1 < workers?.length ? ', ' : ''}
                                  </Box>
                              ))
                            : null}
                    </>
                ) : (
                    <RowDesignerField requestId={row?.id} designerIds={designerIds} requestStatus={row.status} />
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '169px',
            render: status => <Badge $variant={BADGE_STATUS[status]}>{BADGE_STATUS[status]}</Badge>,
        },
    ];

    const tooltip = ' On this view you only see the Active accounts (the ones who can submit new requests). Inactive and Paused accounts are not showing.';

    return (
        <Box>
            <Box $d="flex" $alignItems="center" $mb="21">
                <Text $textVariant="Badge" $colorScheme="primary">
                    {ordersTotalCount} request{ordersTotalCount > 1 && 's'}
                </Text>
                <Tooltip color="white" title={tooltip} trigger="hover">
                    <Box as="span" $pl="8" $d="inline-flex" $alignItems="center" $colorScheme="cta">
                        <IconQuestions />
                    </Box>
                </Tooltip>
            </Box>
            <Box>
                <ConfigProvider renderEmpty={CustomEmptyTable}>
                    <Table
                        isAdminTable
                        bordered
                        columns={columns}
                        $height="89"
                        dataSource={orders}
                        rowKey={row => row.id}
                        pagination={false}
                        scroll={{ x: 1300 }}
                    />
                </ConfigProvider>
            </Box>

            <Box $d="flex" $justifyContent="flex-end">
                <Pagination
                    showSizeChanger
                    defaultCurrent={page}
                    total={ordersTotalCount}
                    defaultPageSize={pageSize}
                    onShowSizeChange={handleChangePageSize}
                    onChange={handleChangePage}
                />
            </Box>
        </Box>
    );
});

export default RequestsList;
