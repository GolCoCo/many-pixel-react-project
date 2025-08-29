import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import _ from 'lodash';
import moment from 'moment';
import { SUBSCRIPTION_INVOICES } from '@graphql/queries/subscription';
import { usdFormatter } from '@constants/utils';
import IconNoData from '@components/Svg/IconNoData';
import { ConfigProvider, Spin } from 'antd';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import ArrowDownIcon from '@components/Svg/ArrowDown';
import { Pagination } from '@components/Pagination';
import Icon, { LoadingOutlined } from '@ant-design/icons';

const SkeletonTableHeader = () => (
    <Box
        $d="flex"
        $h="43"
        $alignItems="center"
        $px="20"
        $borderTop="1px solid"
        $borderLeft="1px solid"
        $borderRight="1px solid"
        $borderColor="outline-gray"
        style={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
        $maxW="780"
    >
        <Skeleton $w="73" $h="16" $mr="244" style={window.innerWidth < 1200 ? { display: "none" } : {}} />
        <Skeleton $w="50" $h="16" $mr="55" />
        <Skeleton $w="29" $h="16" $mr="95" />
        <Skeleton $w="37" $h="16" $mr="86" />
        <Skeleton $w="65" $h="16" />
    </Box>
);

const SkeletonTableRow = ({ index, total }) => (
    <Box
        $d="flex"
        $h="52"
        $px="20"
        $borderTop="1px solid"
        $borderLeft="1px solid"
        $borderRight="1px solid"
        $borderColor="outline-gray"
        $alignItems="center"
        $maxW="780"
        _last={{ borderBottom: '1px solid', $borderColor: 'outline-gray' }}
        style={index === total - 1 ? { borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" } : {}}
    >
        <Skeleton $w="215" $h="16" $mr="102" style={window.innerWidth < 1200 ? { display: "none" } : {}} />
        <Skeleton $w="32" $h="16" $mr="77" />
        <Skeleton $w="67" $h="16" $mr="55" />
        <Skeleton $w="75" $h="32" $mr="71" $radii="18" />
        <Skeleton $w="20" $h="20" />
    </Box>
);

const SkeletonPagination = () => (
    <Box $d="flex" $alignItems="center" $maxW="780">
        <Box $ml="auto">
            <Box $my="20" $d="flex" $gap="6px" $alignItems="center">
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="40px" $h="40px" />
                <Skeleton $w="87" $h="40" />
            </Box>
        </Box>
    </Box>
);

const CustomEmptyTable = () => {
    return (
        <Box $textAlign="center">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No invoice found
            </Text>
        </Box>
    );
};

const paymentStatusVariant = {
    paid: 'Active',
    void: 'Cancelled',
    uncollectible: 'Inactive',
    draft: 'Draft',
    open: 'Ongoing',
};

const InvoicesHistory = ({ billLoading = false, subscriptionId, isFromCompany = false, isWorker = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [pageQuery, setPageQuery] = useState({
        startingAfter: null,
    });

    const [paginationState, setPaginationState] = useState({
        data: [],
        hasMore: false,
        cursors: {}, // Store cursors for each page
    });



    const { loading, refetch } = useQuery(SUBSCRIPTION_INVOICES, {
        fetchPolicy: 'network-only',
        variables: {
            subscriptionId,
            limit: pageSize,
            startingAfter: paginationState.cursors[currentPage - 1] || null,
        },
        onCompleted: result => {
            const resultData = result?.getInvoices;
            const newData = resultData?.data || [];

            setPaginationState(prev => {
                // Store the cursor (last item's id) for the next page
                const newCursors = { ...prev.cursors };
                if (newData.length === pageSize) {
                    newCursors[currentPage] = newData[newData.length - 1].id;
                }

                return {
                    data: newData,
                    hasMore: resultData?.hasMore || false,
                    cursors: newCursors,
                };
            });
        },
    });

    const handlePageChange = useCallback(async (page) => {
        if (page < currentPage) {
            // Going backwards - need to refetch with adjusted cursor
            await refetch({
                subscriptionId,
                limit: pageSize,
                startingAfter: paginationState.cursors[page - 2] || null, // Use cursor from 2 pages back
                endingBefore: paginationState.cursors[page - 1], // Current page cursor
            });
        } else {
            // Going forward - use stored cursor
            await refetch({
                subscriptionId,
                limit: pageSize,
                startingAfter: paginationState.cursors[page - 1] || null,
                endingBefore: undefined,
            });
        }
        setCurrentPage(page);
    }, [currentPage, pageSize, paginationState.cursors, refetch, subscriptionId]);


    const handlePageSizeChange = useCallback(async (current, size) => {
        setPageSize(size);
        setCurrentPage(1);
        setPaginationState(prev => ({
            ...prev,
            cursors: {}, // Reset cursors when changing page size
        }));
        await refetch({
            subscriptionId,
            limit: size,
            startingAfter: null,
            endingBefore: undefined,
        });
    }, [refetch, subscriptionId]);

    // Calculate total based on current page data and hasMore flag
    const total = paginationState.hasMore ?
        (currentPage * pageSize) + 1 : // If there are more items, add one more page
        ((currentPage - 1) * pageSize) + paginationState.data.length; // Otherwise use actual count



    if ((loading || billLoading) && pageSize === 5) {
        const currentTotal = 5;
        return isFromCompany ? (
            <Box my="32">
                <Skeleton w="145" h="26" mb="20" />
                <Box borderW="1" borderStyle="solid" borderColor="other-gray">
                    <Box px="16" py="16" bg="#FAFAFA">
                        <Skeleton w="100%" h="18" />
                    </Box>
                    <Box px="16" py="16" borderW="0" borderT="1" borderStyle="solid" borderColor="other-gray">
                        <Skeleton w="100%" h="18" />
                    </Box>
                    <Box px="16" py="16" borderW="0" borderT="1" borderStyle="solid" borderColor="other-gray">
                        <Skeleton w="100%" h="18" />
                    </Box>
                    <Box px="16" py="16" borderW="0" borderT="1" borderStyle="solid" borderColor="other-gray">
                        <Skeleton w="100%" h="18" />
                    </Box>
                    <Box px="16" py="16" borderW="0" borderT="1" borderStyle="solid" borderColor="other-gray">
                        <Skeleton w="100%" h="18" />
                    </Box>
                </Box>
            </Box>
        ) : (
            <Box mt="32" mb="32">
                <Skeleton w="154" h="20" mb="20" />
                <SkeletonTableHeader />
                <Box>
                    {Array.from({ length: currentTotal }, (_, index) => (
                        <SkeletonTableRow key={index} index={index} total={currentTotal} />
                    ))}
                </Box>
                <SkeletonPagination />
            </Box>
        );
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: ms => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {moment(ms * 1000).format('DD MMM YYYY')}
                </Text>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amountDue',
            key: 'amountDue',
            render: amount => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {usdFormatter.format(amount / 100)}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: paymentStatus => (
                <Badge $variant={paymentStatusVariant[paymentStatus]}>{_.upperFirst(paymentStatus)}</Badge>
            ),
        },
        {
            title: 'Download',
            dataIndex: 'pdf',
            key: 'pdf',
            width: 100,
            align: 'center',
            render: (pdf, record) =>
                !isWorker ? (
                    <Text
                        $fontSize="20"
                        $colorScheme="tertiary"
                        _hover={{ $colorScheme: 'cta' }}
                        $textAlign="center"
                        $cursor="pointer"
                        as="a"
                        href={pdf}
                    >
                        <IconDownloadAlt fontSize="24px" />
                    </Text>
                ) : (
                    '-'
                ),
        },
    ];



    return (
        <Box $mt="32" $mb="32">
            <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                Invoice history
            </Text>
            <ConfigProvider renderEmpty={CustomEmptyTable}>
                <Table
                    columns={columns}
                    dataSource={paginationState.data}
                    bordered
                    hideEmptyPagination
                    pagination={false}
                    tableLayout="fixed"
                    showHeader={false}
                    rowClassName={() => 'custom-height'}
                />
                <Box $d="flex" $justifyContent="flex-start" $mt="16">
                    {paginationState.hasMore && (<Box $d="flex" $alignItems="center" $hasSpace space="8" $cursor="pointer" onClick={() => setPageSize(pageSize + 5)}>
                        {loading ? <Spin
                            indicator={
                                <Icon component={LoadingOutlined} style={{ fontSize: 12, marginRight: 4 }} spin />
                            }
                        /> : <ArrowDownIcon fontSize="16px" />}
                        <Text $textVariant="P6" $colorScheme="secondary">View more</Text>
                    </Box>)}
                </Box>
            </ConfigProvider>
        </Box>
    );
};

export default InvoicesHistory;
