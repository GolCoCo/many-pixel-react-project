import React, { memo, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ConfigProvider, Tooltip } from 'antd';
import moment from 'moment';
import concat from 'lodash/concat';
import orderBy from 'lodash/orderBy';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { Badge } from '@components/Badge';
import IconNoData from '@components/Svg/IconNoData';
import { ALL_ADMIN_ORDERS } from '@graphql/queries/order';
import { DETAIL_REQUEST, BRAND, MEMBER_INFO } from '@constants/routes';
import { ORDER_STATUS_LABELS as BADGE_STATUS, ORDER_STATUS_AWAITING_FEEDBACK, ORDER_STATUS_QUEUED } from '@constants/order';
import { useLocation } from 'react-router-dom';
import { Pagination } from '@components/Pagination';
import styled from 'styled-components';
import RowDesignerField from '../../blocks/RowDesignerField';

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

const AccountRequestsList = memo(
    ({
        isWorker,
        isShowPaused,
        orderActiveStatusTab,
        selectedStatus,
        handleQueueNotifCount,
        handleDeliveredNotifCount,
        handleDraftNotifCount,
        companyId,
        companyTeamId,
        designer,
    }) => {
        const status = useMemo(() => {
            if (orderActiveStatusTab === 'DRAFT') {
                return ['DRAFT'];
            }

            if (orderActiveStatusTab === 'DELIVERED') {
                return ['DELIVERED_PROJECT', 'DELIVERED_REVISION', 'COMPLETED'];
            }

            // orderActiveStatusTab === 'QUEUE'

            const newStatus = ['SUBMITTED', 'ONGOING_PROJECT', 'ONGOING_REVISION', ORDER_STATUS_AWAITING_FEEDBACK, ORDER_STATUS_QUEUED];

            if (isShowPaused) {
                newStatus.push('ON_HOLD');
            }

            return newStatus;
        }, [orderActiveStatusTab, isShowPaused]);

        useEffect(() => {
            setPage(0);
        }, [isShowPaused]);

        const [page, setPage] = useState(0);
        const [pageSize, setPageSize] = useState(10);

        const offset = page * pageSize;

        const handleChangePageSize = (current, size) => {
            setPageSize(size);
            setPage(0);
        };

        const handleChangePage = (current, size) => {
            setPage(current - 1);
        };

        const { loading, data } = useQuery(ALL_ADMIN_ORDERS, {
            variables: {
                account: companyId,
                designer,
                product: 'ALL',
                status,
                team: 'ALL',
                skip: offset,
                first: pageSize,
                page: 'accounts',
            },
            fetchPolicy: 'network-only',
        });

        const { data: orders, total: ordersTotalCount } = data?.allAdminOrders || {
            data: [],
            total: 0,
        };

        const [dataSource, setDataSource] = useState(null);
        const location = useLocation();

        useEffect(() => {
            if (!loading) {
                const isForQueueFilter =
                    !selectedStatus.includes('ALL') ||
                    selectedStatus.includes('SUBMITTED') ||
                    selectedStatus.includes('ONGOING_PROJECT') ||
                    selectedStatus.includes('ONGOING_REVISION') ||
                    selectedStatus.includes('ON_HOLD') ||
                    selectedStatus.includes(ORDER_STATUS_AWAITING_FEEDBACK) ||
                    selectedStatus.includes(ORDER_STATUS_QUEUED);
                const isForDeliveredFilter =
                    !selectedStatus.includes('ALL') ||
                    selectedStatus.includes('DELIVERED_PROJECT') ||
                    selectedStatus.includes('DELIVERED_REVISION') ||
                    selectedStatus.includes('COMPLETED');
                const allData = orders;

                const noPausedData = orders?.filter(order => order.status !== 'ON_HOLD');
                const initialData = isShowPaused ? allData : noPausedData;
                const queueData = !isForQueueFilter
                    ? initialData?.filter(
                          order =>
                              order.status === 'ONGOING_PROJECT' ||
                              order.status === 'ONGOING_REVISION' ||
                              order.status === 'SUBMITTED' ||
                              order.status === 'ON_HOLD' ||
                              order.status === ORDER_STATUS_AWAITING_FEEDBACK ||
                              order.status === ORDER_STATUS_QUEUED
                      )
                    : initialData?.filter(order =>
                          selectedStatus.includes('ONGOING_PROJECT')
                              ? ['ONGOING_PROJECT', 'ONGOING_REVISION'].indexOf(order.status) > -1
                              : selectedStatus.includes(order.status)
                      );
                const deliveredData = !isForDeliveredFilter
                    ? initialData?.filter(order => order.status === 'DELIVERED_PROJECT' || order.status === 'DELIVERED_REVISION' || order.status === 'COMPLETED')
                    : initialData?.filter(order =>
                          selectedStatus.includes('DELIVERED_PROJECT')
                              ? ['DELIVERED_PROJECT', 'DELIVERED_REVISION'].indexOf(order.status) > -1
                              : selectedStatus.includes(order.status)
                      );
                const draftData = initialData?.filter(order => order.status === 'DRAFT');
                let dataToShow;
                const queueUnreads = queueData?.filter(order => order.unreadMessages > 0)?.length;
                const deliveredUnreads = deliveredData?.filter(order => order.unreadMessages > 0)?.length;
                const draftUnreads = draftData?.filter(order => order.unreadMessages > 0)?.length;
                switch (orderActiveStatusTab) {
                    case 'QUEUE':
                        dataToShow = queueData;
                        break;
                    case 'DELIVERED':
                        const deliveredRequests = deliveredData.filter(order => order.status === 'DELIVERED_PROJECT' || order.status === 'DELIVERED_REVISION');
                        const completedRequests = deliveredData.filter(order => order.status === 'COMPLETED');
                        dataToShow = orderBy(concat(deliveredRequests, completedRequests), ['updatedAt'], ['desc']);

                        break;
                    case 'DRAFT':
                        dataToShow = orderBy(draftData, ['id'], ['desc']);
                        break;
                    default:
                        dataToShow = orderBy(initialData, ['id'], ['desc']);
                        break;
                }

                handleQueueNotifCount(queueUnreads);
                handleDeliveredNotifCount(deliveredUnreads);
                handleDraftNotifCount(draftUnreads);
                setDataSource(dataToShow);
            }
        }, [
            loading,
            orders,
            isShowPaused,
            orderActiveStatusTab,
            handleQueueNotifCount,
            handleDeliveredNotifCount,
            handleDraftNotifCount,
            selectedStatus,
            companyId,
        ]);

        if (loading) {
            return (
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $px="16" $py="16" $bg="#FAFAFA">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            );
        }

        const columns = [
            {
                title: 'Request',
                dataIndex: 'name',
                key: 'name',
                width: '189px',
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
                                    {row.unreadMessages > 0 && <Box $w="12" $h="12" $bg="other-pink" $radii="100%" />}
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
                title: 'User',
                dataIndex: 'customer',
                key: 'customer',
                width: '150.33px',
                render: customer => (
                    <Text $textVariant="P4" $colorScheme="primary">
                        {customer?.firstname} {customer?.lastname}
                    </Text>
                ),
            },
            {
                title: 'Product',
                dataIndex: 'service',
                key: 'product',
                width: '180.33px',
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
                width: '220px',
                render: (workers, row) => {
                    const filteredWorkers = workers && workers?.length > 0 ? workers?.filter(worker => !worker.archived) : undefined;
                    const designerIds = filteredWorkers ? filteredWorkers?.map(worker => worker.id) : undefined;

                    if (!companyTeamId) {
                        return (
                            <Text $textVariant="Badge" $colorScheme="other-red">
                                No team assigned yet
                            </Text>
                        );
                    }

                    return isWorker ? (
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
                        <RowDesignerField companyTeamId={companyTeamId} requestId={row?.id} designerIds={designerIds} requestStatus={row.status} />
                    );
                },
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '169px',
                render: statusInRow => <Badge $variant={BADGE_STATUS[statusInRow]}>{BADGE_STATUS[statusInRow]}</Badge>,
            },
        ];

        return (
            <Box $mt="-1" $overflow="hidden">
                <ConfigProvider renderEmpty={CustomEmptyTable}>
                    <Table isAdminTable bordered columns={columns} $height="89" dataSource={dataSource} rowKey={row => row.id} pagination={false} />

                    <Box
                        $d="flex"
                        $alignItems="center"
                        $justifyContent="flex-end"
                        $borderW="0"
                        $borderL="1"
                        $borderR="1"
                        $borderT="0"
                        $borderB="1"
                        $borderStyle="solid"
                        $borderColor="other-gray"
                        $h="60"
                        $pr="10"
                        $radii="0 0 10px 10px"
                    >
                        <Pagination
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                            showSizeChanger
                            defaultCurrent={page + 1}
                            total={ordersTotalCount}
                            defaultPageSize={pageSize}
                            onShowSizeChange={handleChangePageSize}
                            onChange={handleChangePage}
                            pageSizeOptions={['10', '20', '30', '40']}
                        />
                    </Box>
                </ConfigProvider>
            </Box>
        );
    }
);

export default AccountRequestsList;
