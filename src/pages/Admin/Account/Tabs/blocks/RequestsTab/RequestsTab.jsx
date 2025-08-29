import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import * as qs from 'query-string';
import withLoggedUser from '@components/WithLoggedUser';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Tabs } from '@components/Tabs';
import { ALL_ORDERS } from '@graphql/queries/order';
import { getOrderGroupValues, getOrderGroupStatus } from '@constants/order';
import { SectionRequest } from '@pages/Customer/Requests/blocks/ListRequest/SectionRequest';
import message from '@components/Message';
import { EmptyData } from '@components/EmptyData';
import { CustomTabBar, ExtraTabContent } from '@pages/Customer/Requests/Filters';
import { CUSTOMER_BRANDS_FOR_SEARCH } from '@graphql/queries/user';
import { ALL_CATEGORIES } from '@graphql/queries/category';
import { COMPANY_DESIGNERS, COMPANY_USERS } from '@graphql/queries/company';
import { CHECK_COMPANY } from '@graphql/mutations/checker';
import moment from 'moment';
import { Image } from '@components/Image';
import { Button } from '@components/Button';
import { Tooltip } from 'antd';
import get from 'lodash/get';

const Requests = ({ viewer, company, refetch: refetchCompany }) => {
    const $isNotCustomer = viewer?.role !== 'customer';
    const isWorker = viewer?.role === 'worker';
    const location = useLocation();
    const history = useHistory();
    const [isChecking, setIsChecking] = useState(false);
    const [checkCompany] = useMutation(CHECK_COMPANY);

    const [state, setState] = useState(() => {
        const parsed = qs.parse(location.search);
        return {
            filterTab: parsed.filterTab?.toUpperCase() ?? 'QUEUE',
            page: parsed.page ? parseInt(parsed.page, 10) : 1,
            max: parsed.max ? parseInt(parsed.max, 10) : 10,
            status: parsed.status ?? 'All',
            brands: parsed.brand ?? '',
            design: parsed.design ?? '',
            owner: parsed.owner ?? '',
            designer: parsed.designer ?? '',
            search: parsed.search ?? '',
        };
    });

    const {
        data: designersData,
        loading: designersLoading,
        refetch: refetchDesigners,
    } = useQuery(COMPANY_DESIGNERS, {
        variables: {
            id: company.id,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        refetchDesigners();
    }, [state.tab]);

    const allDesigners = useMemo(() => {
        if (!designersData?.Company) {
            return [];
        }

        const orderDesigners = (designersData.Company.orders || [])
            .flatMap(order =>
                (order.workers || []).map(worker => ({
                    ...worker,
                    orders: [
                        {
                            id: order.id,
                            status: order.status,
                        },
                    ],
                }))
            )
            .filter(worker => worker);

        const assignedDesigners = (designersData.Company.assignedDesigners || []).map(ad => ad.designer).filter(designer => designer);

        const designersMap = new Map();

        orderDesigners.forEach(designer => {
            if (!designer) return;
            if (designersMap.has(designer.id)) {
                const existing = designersMap.get(designer.id);
                existing.orders = [...(existing.orders || []), ...(designer.orders || [])];
            } else {
                designersMap.set(designer.id, {
                    ...designer,
                    orders: designer.orders || [],
                    firstname: designer.firstname || '',
                    lastname: designer.lastname || '',
                });
            }
        });

        assignedDesigners.forEach(designer => {
            if (!designer) return;
            if (!designersMap.has(designer.id)) {
                designersMap.set(designer.id, {
                    ...designer,
                    orders: [],
                    firstname: designer.firstname || '',
                    lastname: designer.lastname || '',
                });
            }
        });

        return Array.from(designersMap.values());
    }, [designersData]);

    const activeFilter = useMemo(() => {
        if (Array.isArray(state.status)) {
            if (state.status.length > 0) {
                return state.status
                    .map(stat => getOrderGroupStatus(state.filterTab, stat))
                    .flat()
                    .filter(Boolean);
            }

            return getOrderGroupStatus(state.filterTab, 'All');
        }

        return getOrderGroupStatus(state.filterTab, state.status);
    }, [state.status, state.filterTab]);

    const variables = useMemo(() => {
        let vars = {
            where: { AND: [] },
            ...(state.status !== 'All' || state.filterTab === 'DELIVERED' || state.filterTab === 'DRAFT'
                ? {
                      first: state.max,
                      skip: (state.page - 1) * state.max,
                      orderBy: state.filterTab === 'QUEUE' ? { priority: 'Asc' } : { updatedAt: 'Desc' },
                  }
                : { orderBy: state.filterTab === 'QUEUE' ? { priority: 'Asc' } : { updatedAt: 'Desc' } }),
        };

        vars.where.AND.push({
            companyId: company?.id,
        });
        if (state.brands && state.brands.length > 0) {
            vars.where.AND.push({
                brandId: {
                    in: state.brands,
                },
            });
        }
        if (state.status !== 'All' && activeFilter.length > 0) {
            vars.where.AND.push({
                status: {
                    in: activeFilter,
                },
            });
        }

        if (state.design && state.design.length > 0) {
            vars.where.AND.push({
                categoryId: {
                    in: state.design,
                },
            });
        }
        if (state.owner) {
            vars.where.AND.push({
                owners: {
                    some: {
                        ownerId: {
                            in: [state.owner],
                        },
                    },
                },
            });
        }
        if (state.designer) {
            vars.where.AND.push({
                workers: {
                    some: {
                        workerId: {
                            in: [state.designer],
                        },
                    },
                },
            });
        }

        if (state.search) {
            vars.where.AND.push({
                OR: [{ name: { contains: state.search, mode: 'Insensitive' } }, Number.isInteger(state.search) ? { id: state.search } : {}],
            });
        }

        if (vars.where.AND.length) {
            if (state.status !== 'All' || state.filterTab === 'DELIVERED' || state.filterTab === 'DRAFT') {
                vars = {
                    ...vars,
                    first: state.max,
                    skip: (state.page - 1) * state.max,
                };
            }
        }

        vars.where.AND.push({
            companyId: company?.id,
            status: {
                in: activeFilter,
            },
            isArchived: false,
        });

        return vars;
    }, [state, state.search, state.status, activeFilter]);

    const { data, loading, refetch } = useQuery(ALL_ORDERS, {
        variables,
        fetchPolicy: 'network-only',
    });
    const requestData = data?.allOrders;
    const callback = async obj => {
        setState({ ...state, ...obj });
        await refetch();
    };
    const user = get(company, 'users[0]', null);
    const { data: brandsData } = useQuery(CUSTOMER_BRANDS_FOR_SEARCH, {
        variables: { id: user.id },
        fetchPolicy: 'cache-and-network',
    });
    const { data: categoriesData } = useQuery(ALL_CATEGORIES, {
        variables: {
            where: {
                isActivated: true,
            },
            orderBy: { position: 'Asc' },
        },
        fetchPolicy: 'cache-first',
    });

    const { data: companyData } = useQuery(COMPANY_USERS, {
        variables: {
            id: company?.id,
        },
    });

    const checkedLabel = company?.checkedBy ? 'Checked' : 'Check';
    const handleCheckAccount = async ev => {
        // Prevent panel header triggered because button is inside same div container
        if (ev) {
            ev.stopPropagation();
        }
        setIsChecking(true);
        try {
            await checkCompany({ variables: { companyId: company?.id } });
            await refetchCompany();
            setIsChecking(false);
            message.destroy();
        } catch (e) {
            setIsChecking(false);
            message.destroy();
            message.error('Error on checking account');
        }
    };

    useEffect(() => {
        const parsed = qs.parse(location.search);
        const values = {
            page: parsed.page ? parseInt(parsed.page, 10) : 1,
        };
        if (parsed.tab) {
            const uppercased = parsed.tab?.toUpperCase();
            values.tab = uppercased;
            values.status = 'All';
        }
        if (parsed.max) {
            values.max = parseInt(parsed.max, 10);
        }
        setState({ ...state, values });
    }, [location.search, state.filterTab, state.page]);

    const refetchAll = async () => {
        try {
            await refetch();
        } catch (err) {
            console.log(err);
        }
    };

    const navigateLocation = async obj => {
        const stringify = qs.stringify(obj);
        window.history.pushState('', '', `${location.pathname}?${stringify}`);
        setState(obj);
        await refetch();
    };

    const handleChangePage = page => {
        navigateLocation({ ...state, page, tab: 'requests' });
    };

    const handleChangeTab = tab => {
        navigateLocation({ filterTab: tab, page: 1, max: state.max, status: 'All', tab: 'requests' });
    };

    const handleChangeSearch = search => {
        navigateLocation({ ...state, search, tab: 'requests' });
    };

    const handleChangeMax = max => {
        navigateLocation({ ...state, max, tab: 'requests' });
    };

    const handleChangeStatus = status => {
        navigateLocation({ status, filterTab: state.filterTab, max: state.max, page: 1, tab: 'requests' });
    };

    const requestSectionProps = {
        activeFilter,
        data: requestData,
        totalRequestCount: data?._allOrdersMeta?.count,
        allRequestsTotal: data?._allOrdersMeta.total,
        page: state.page,
        max: state.max,
        loading,
        handleChangeStatus,
        handleChangePage,
        handleChangeMax,
        refetch: refetchAll,
        search: state.search,
        activeStatusName: state.status,
        showSearchBox: true,
        handleSearch: handleChangeSearch,
        customEmpty: (
            <Box $pt="10">
                <EmptyData />
            </Box>
        ),
    };

    const items = useMemo(() => {
        const tabPanes = [
            {
                key: 'QUEUE',
                label: 'Queue',
                children: (
                    <SectionRequest
                        $isNotCustomer={$isNotCustomer}
                        isWorker={isWorker}
                        isAdmin
                        name="queue"
                        statuses={getOrderGroupValues('QUEUE')}
                        {...requestSectionProps}
                    />
                ),
            },
            {
                key: 'DELIVERED',
                label: 'Delivered',
                children: (
                    <SectionRequest
                        $isNotCustomer={$isNotCustomer}
                        isWorker={isWorker}
                        isAdmin
                        name="delivered"
                        statuses={getOrderGroupValues('DELIVERED')}
                        {...requestSectionProps}
                    />
                ),
            },
        ];

        if (!isWorker) {
            tabPanes.push({
                key: 'DRAFT',
                label: 'Draft',
                children: <SectionRequest $isNotCustomer={$isNotCustomer} isAdmin isWorker={isWorker} {...requestSectionProps} />,
            });
        }

        return tabPanes;
    }, [loading, requestData, $isNotCustomer, isWorker]);
    return (
        <Box $mt="24">
            <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="24px">
                <Text $textVariant="H5">Requests</Text>
                <Box $d="flex" $alignItems="center" $gap="6px">
                    {company?.checkedBy && !isWorker && (
                        <Box $d="flex" $alignItems="center" $gap="8px">
                            <Image
                                src={company?.checkedBy?.manager?.picture?.url}
                                name={`${company?.checkedBy?.manager?.firstname ?? ''}`}
                                size={32}
                                $fontSize="16"
                                isRounded
                            />
                            <Tooltip color="white" trigger="hover" title={company?.checkedBy?.manager?.firstname}>
                                <Box>
                                    <Text $textVariant="P5" $colorScheme="secondary">
                                        <span
                                            style={{ color: '#07122b' }}
                                        >{`${company?.checkedBy?.manager?.firstname} ${company?.checkedBy?.manager?.lastname[0]}`}</span>{' '}
                                        {'- '}
                                        {moment(company?.checkedBy?.checkedAt).fromNow()}
                                    </Text>
                                </Box>
                            </Tooltip>
                        </Box>
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
                            $w="142"
                            $radii="8"
                            $px="16"
                            $minW="94"
                        >
                            {isChecking ? 'Checking' : checkedLabel}
                        </Button>
                    )}
                </Box>
            </Box>
            <Box $mt="9">
                <Tabs
                    defaultActiveKey={state.filterTab}
                    animated={false}
                    onChange={handleChangeTab}
                    items={items}
                    renderTabBar={tabBarProps => (
                        <CustomTabBar
                            {...tabBarProps}
                            extraContent={
                                <ExtraTabContent
                                    currentTab={state.filterTab}
                                    location={location}
                                    history={history}
                                    categoriesData={categoriesData}
                                    brandsData={brandsData}
                                    companyData={companyData}
                                    adminView
                                    callback={callback}
                                    withReload={false}
                                    state={state}
                                    allDesigners={allDesigners}
                                    search={{
                                        initialValue: state.search || '',
                                        onChange: handleChangeSearch,
                                        isSubscriptionActive: false,
                                        subStatus: null,
                                    }}
                                />
                            }
                        />
                    )}
                />
            </Box>
        </Box>
    );
};

export default withLoggedUser(Requests);
