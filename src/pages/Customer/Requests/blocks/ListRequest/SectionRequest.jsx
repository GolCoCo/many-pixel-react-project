import React, { useMemo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Pagination } from '@components/Pagination';
import { Skeleton } from '@components/Skeleton';
import { ORDER_TAB_STATUSES } from '@constants/order';
import { withResponsive } from '@components/ResponsiveProvider';
import SubscriptionPaused from '../SubscriptionPaused';
import { SectionRequestRenderer } from './SectionRequestRenderer';
import { EmptyQueue } from './EmptyQueue';
import { EmptyRequest } from './EmptyRequest';
import { RowHeader } from './RowHeader';
import RowItemRequestSkeleton from './RowItemRequestSkeleton';

function arrayEquals(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

export const SectionRequest = withResponsive(
    ({
        name,
        data,
        isSubscriptionPaused,
        activeFilter,
        activeStatusName,
        page,
        max,
        handleChangePage,
        totalRequestCount,
        allRequestsTotal,
        handleChangeMax,
        refetch,
        refetchOrder,
        loading,
        windowWidth,
        search,
        $isNotCustomer = false,
        isWorker = false,
        isAdmin = false,
        customEmpty,
        hasActiveFilters,
        tab,
    }) => {
        const isDragEnabled = useMemo(() => {
            if (search || isWorker || $isNotCustomer) return false;

            if (activeStatusName !== 'All') return false;

            if (hasActiveFilters === false) return true;
            if (hasActiveFilters === true) return false;

            if (Array.isArray(activeFilter)) {
                const defaultFilters = ORDER_TAB_STATUSES[name?.toUpperCase()] || [];
                return (
                    activeFilter.length === defaultFilters.length &&
                    activeFilter.every(filter => defaultFilters.includes(filter)) &&
                    defaultFilters.every(filter => activeFilter.includes(filter))
                );
            }

            return false;
        }, [search, isWorker, $isNotCustomer, activeStatusName, hasActiveFilters, activeFilter, name]);

        if (isSubscriptionPaused && !activeFilter.some(item => ORDER_TAB_STATUSES.DELIVERED.includes(item))) {
            return <SubscriptionPaused />;
        }

        const isDesktop = windowWidth >= 768;

        const dataIsNotEmpty = Array.isArray(data) && data.length > 0;
        const groupedDataOnHold = dataIsNotEmpty ? data.filter(item => item.status === 'ON_HOLD') : [];
        const groupedDataNotOnHold = dataIsNotEmpty ? data.filter(item => item.status !== 'ON_HOLD') : [];
        const dataSorted = [...groupedDataNotOnHold, ...groupedDataOnHold];

        const lastRequest = useMemo(() => {
            return dataSorted[dataSorted.length - 1];
        }, [dataSorted]);
        return (
            <>
                {loading ? (
                    <>
                        <Box $radii="10" $border="1px solid #D5D6DD" $my="20" $overflow="hidden">
                            <RowHeader isAdmin={isAdmin} isMobile={windowWidth < 768} isLoading />
                            <RowItemRequestSkeleton />
                            <RowItemRequestSkeleton />
                            <RowItemRequestSkeleton />
                            <RowItemRequestSkeleton />
                            <RowItemRequestSkeleton />
                            <RowItemRequestSkeleton isLastRequest />
                        </Box>
                        <Skeleton $w="60" $h="20" />
                    </>
                ) : (
                    <>
                        {dataIsNotEmpty && (
                            <Box $radii="10" $border="1px solid #D5D6DD" $my="20" $overflow="hidden">
                                <RowHeader isAdmin={isAdmin} isMobile={windowWidth < 768} />
                                <SectionRequestRenderer
                                    refetch={refetch}
                                    refetchOrder={refetchOrder}
                                    lastRequest={lastRequest}
                                    tab={tab}
                                    isAdmin={isAdmin}
                                    data={dataSorted}
                                    enableDrag={isDragEnabled}
                                    $isNotCustomer={$isNotCustomer}
                                    windowWidth={windowWidth}
                                />
                            </Box>
                        )}
                        {dataIsNotEmpty && (
                            <Box>
                                {!(arrayEquals(activeFilter, ORDER_TAB_STATUSES.QUEUE) && activeStatusName === 'All') && tab !== 'QUEUE' ? (
                                    <Pagination
                                        total={totalRequestCount ?? 0}
                                        defaultCurrent={1}
                                        style={{
                                            width: 'auto',
                                            marginLeft: 'auto',
                                            justifyContent: isDesktop ? undefined : 'flex-end',
                                            marginTop: 0,
                                        }}
                                        showSizeChanger
                                        showLessItems
                                        showTotal={isDesktop ? (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} requests` : undefined}
                                        current={page}
                                        onChange={(newPage, pageSize) => {
                                            if (newPage !== page) {
                                                handleChangePage(newPage);
                                            }

                                            if (pageSize !== max) {
                                                handleChangeMax(pageSize);
                                            }
                                        }}
                                        pageSize={max}
                                    />
                                ) : (
                                    <Text $colorScheme="primary">
                                        {totalRequestCount ?? 0} Request{(totalRequestCount ?? 0) > 1 ? 's' : ''}
                                    </Text>
                                )}
                            </Box>
                        )}

                        {!dataIsNotEmpty ? (
                            <>{customEmpty ? <>{customEmpty}</> : name === 'queue' ? allRequestsTotal ? <EmptyRequest /> : <EmptyQueue /> : <EmptyRequest />}</>
                        ) : null}
                    </>
                )}
            </>
        );
    }
);
