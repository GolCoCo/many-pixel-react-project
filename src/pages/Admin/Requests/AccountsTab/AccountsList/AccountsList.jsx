import React, { memo, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Tooltip } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Pagination } from '@components/Pagination';
import IconNoData from '@components/Svg/IconNoData';
import { USER_TYPE_WORKER } from '@constants/account';
import { ALL_COMPANIES_REQUESTS } from '@graphql/queries/company';
import AccountPanel from './AccountPanel';
import IconQuestions from '@components/Svg/IconQuestions';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';

const AccountsList = memo(({ viewer, filters, designerId }) => {
    const parsed = qs.parse(window.location.search);
    const [page, setPage] = useState(parsed.page ? parseInt(parsed.page) : 1);
    const [pageSize, setPageSize] = useState(parsed.pageSize ? parseInt(parsed.pageSize) : 10);

    const offset = (page - 1) * pageSize;
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

    const { loading, data, refetch } = useQuery(ALL_COMPANIES_REQUESTS, {
        variables: { ...filters, limit: pageSize, offset },
        fetchPolicy: 'network-only',
    });
    const isWorker = viewer?.role === USER_TYPE_WORKER;

    const { data: companies, total: companiesTotalCount } = data?.allCompaniesRequests || {
        data: [],
        total: 0,
    };

    const totalOutputs = useMemo(() => {
        let outputCount = 0;

        companies.forEach(company => {
            const output = company?.subscription?.plan?.dailyOutput;

            if (output) {
                outputCount += output;
            }
        });

        return outputCount;
    }, [companies]);

    const { status, keyword, designer } = filters || {};
    let activeFilterStatusTab = 'QUEUE';

    if (status.includes('SUBMITTED') || status.includes('ONGOING_PROJECT') || status.includes('ON_HOLD')) {
        activeFilterStatusTab = 'QUEUE';
    }

    if (status.includes('DELIVERED_PROJECT') || status.includes('COMPLETED')) {
        activeFilterStatusTab = 'DELIVERED';
    }

    if (status.includes('DRAFT')) {
        activeFilterStatusTab = 'DRAFT';
    }

    if (loading) {
        return (
            <Box>
                <Box $d="flex" $alignItems="center" $mb="20">
                    <Skeleton $w="80" $h="20" />
                    {!isWorker && (
                        <>
                            <Box $mx="16" $h="20" $w="1" $bg="outline-gray" />
                            <Skeleton $w="71" $h="20" />
                        </>
                    )}
                </Box>
                <Box>
                    <Box $px="16" $py="16" $bg="#FAFAFA" $mb="21" $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $bg="#FAFAFA" $mb="21" $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $bg="#FAFAFA" $mb="21" $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $bg="#FAFAFA" $mb="21" $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $bg="#FAFAFA" $borderW="1" $borderStyle="solid" $borderColor="other-gray" $radii="10">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            </Box>
        );
    }

    const handleChangePage = (current, size) => {
        if (page !== current) {
            setPage(current);
            changeParams({ page: current });
        }

        if (size !== pageSize) {
            setPageSize(size);
            changeParams({ pageSize: size });
        }
    };

    const tooltip = ' On this view you only see the Active accounts (the ones who can submit new requests). Inactive and Paused accounts are not showing.';

    return (
        <Box>
            {companies.length > 0 && (
                <Box $d="flex" $alignItems="center" $mb="20">
                    <Text $textVariant="Badge" $colorScheme="primary">
                        {companiesTotalCount} account{companiesTotalCount > 1 ? 's' : ''}
                    </Text>
                    <Tooltip color="white" title={tooltip} trigger="hover">
                        <Box as="span" $pl="8" $d="inline-flex" $alignItems="center" $colorScheme="cta">
                            <IconQuestions />
                        </Box>
                    </Tooltip>
                    {!isWorker && (
                        <>
                            <Box $mx="16" $h="20" $w="1" $bg="outline-gray" />
                            <Text $textVariant="Badge" $colorScheme="primary">
                                {totalOutputs} output{totalOutputs > 1 ? 's' : ''}
                            </Text>
                        </>
                    )}
                </Box>
            )}
            {companies.length > 0 ? (
                companies.map(data => (
                    <AccountPanel
                        key={data?.id}
                        company={data}
                        activeFilterStatusTab={activeFilterStatusTab}
                        selectedStatus={status}
                        selectedKeyword={keyword}
                        selectedDesigner={designer}
                        companyRefetch={refetch}
                        isWorker={isWorker}
                        designerId={designerId}
                    />
                ))
            ) : (
                <Box $textAlign="center" $mt="20" $pt="20" $pb="25" $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $lineH="1" $fontSize="121" $mb="10">
                        <IconNoData />
                    </Box>
                    <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                        No accounts found
                    </Text>
                </Box>
            )}
            {companiesTotalCount > 0 && (
                <Box $d="flex" $alignItems="center" $justifyContent="flex-end" $mt="-20">
                    <Pagination
                        showSizeChanger
                        defaultCurrent={page}
                        total={companiesTotalCount}
                        defaultPageSize={pageSize}
                        onChange={handleChangePage}
                        pageSize={pageSize}
                        current={page}
                    />
                </Box>
            )}
        </Box>
    );
});

export default AccountsList;
