import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as qs from 'query-string';
import withLoggedUser from '@components/WithLoggedUser';
import { CREATE_REQUEST } from '@constants/routes';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Tabs } from '@components/Tabs';
import IconAdd from '@components/Svg/IconAdd';
import { useNavSearchContext, withNavSearchProvider } from '@components/Basepage/NavSearch';
import DocumentTitle from '@components/DocumentTitle';
import { ALL_ORDERS } from '@graphql/queries/order';
import { getOrderGroupValues, getOrderGroupStatus } from '@constants/order';
import { SectionRequest } from './blocks/ListRequest/SectionRequest';
import SubscriptionInactive from './blocks/SubscriptionInactive';
import { PopupFeedbackRequests } from './blocks/FeedbackRequest/PopupFeedbackRequests';
import { CUSTOMER_BRANDS_FOR_SEARCH } from '@graphql/queries/user';
import { ALL_CATEGORIES } from '@graphql/queries/category';
import { COMPANY_USERS, COMPANY_DESIGNERS } from '@graphql/queries/company';
import { CustomTabBar, ExtraTabContent, getCurrentValue } from './Filters';
import { withResponsive } from '@components/ResponsiveProvider/ResponsiveProvider';
import { Skeleton } from '@components/Skeleton';

const initialState = {
    tab: 'QUEUE',
    page: 1,
    max: 10,
    status: 'All',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_LOCATION':
            return {
                ...state,
                ...action.values,
            };
        default:
            return state;
    }
};

const RequestsBase = ({ location, viewer, history, windowWidth, showFilter, handleSetFilter, handleSetActiveFilters }) => {
    const didUpdate = useRef(false);
    const [state, dispatch] = useReducer(reducer, initialState, init => {
        const parsed = qs.parse(location.search);
        return {
            tab: parsed.tab?.toUpperCase() ?? init.tab,
            page: parsed.page ? parseInt(parsed.page, 10) : init.page,
            max: parsed.max ? parseInt(parsed.max, 10) : init.max,
            status: parsed.status ?? init.status,
            brands: parsed.brand ?? '',
            design: parsed.design ?? '',
            owner: parsed.owner ?? '',
            designer: parsed.designer ?? '',
        };
    });
    const [isFilterOpen, setIsFilterOpen] = useState(showFilter);
    const { search, debouncedSearch, intSearch, setSearch } = useNavSearchContext();
    const { data: brandsData } = useQuery(CUSTOMER_BRANDS_FOR_SEARCH, {
        variables: { id: viewer.id },
        fetchPolicy: 'cache-and-network',
    });

    const activeFilter = useMemo(() => {
        if (Array.isArray(state.status)) {
            return state.status.map(stat => getOrderGroupStatus(state.tab, stat)).flat();
        }
        return getOrderGroupStatus(state.tab, state.status);
    }, [state.status, state.tab]);
    const variables = useMemo(() => {
        let vars = { where: { AND: [] }, orderBy: state.tab === 'QUEUE' ? { priority: 'Asc' } : { updatedAt: 'Desc' } };
        vars.where.AND.push({
            companyId: viewer?.company?.id,
            isArchived: false,
        });

        if (state.brands) {
            const brandValues = getCurrentValue(state.brands);
            if (brandValues.includes('none')) {
                vars.where.AND.push({
                    OR: [{ brandId: null }],
                });
            } else if (brandValues.length > 0) {
                vars.where.AND.push({
                    brandId: {
                        in: brandValues,
                    },
                });
            }
        }
        vars.where.AND.push({
            status: {
                in: activeFilter,
            },
        });

        if (state.design) {
            const designIds = getCurrentValue(state.design);
            if (designIds && designIds.length > 0) {
                vars.where.AND.push({
                    categoryId: {
                        in: designIds,
                    },
                });
            }
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

        if (debouncedSearch !== '') {
            vars.where.AND.push({
                OR: [
                    {
                        name: {
                            contains: debouncedSearch,
                            mode: 'Insensitive',
                        },
                    },
                    intSearch !== '' ? { id: intSearch } : {},
                ],
            });
        }

        if (state.tab === 'DRAFT') {
            vars = {
                ...vars,
                orderBy: {
                    createdAt: 'Desc',
                },
            };
        }

        if (state.tab === 'DELIVERED') {
            vars = {
                ...vars,
                orderBy: {
                    updatedAt: 'Desc',
                },
            };
        }

        if (state.tab !== 'QUEUE') {
            vars = {
                ...vars,
                first: state.max,
                skip: (state.page - 1) * state.max,
            };
        }

        return vars;
    }, [activeFilter, debouncedSearch, intSearch, state, viewer.company.id]);

    const { data, loading, refetch, error } = useQuery(ALL_ORDERS, {
        variables,
        fetchPolicy: 'network-only',
    });

    const { data: categoriesData } = useQuery(ALL_CATEGORIES, {
        variables: {
            where: {
                isActivated: true,
            },
        },
        fetchPolicy: 'cache-and-network',
    });

    const { data: companyData } = useQuery(COMPANY_USERS, {
        variables: {
            id: viewer.company.id,
        },
    });

    const {
        data: designersData,
        loading: designersLoading,
        refetch: refetchDesigners,
    } = useQuery(COMPANY_DESIGNERS, {
        variables: {
            id: viewer.company.id,
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

    useEffect(() => {
        if (!didUpdate.current) {
            didUpdate.current = true;
        } else {
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
            dispatch({ type: 'CHANGE_LOCATION', values });
        }
    }, [location.search]);

    useEffect(() => {
        setIsFilterOpen(showFilter);
    }, [showFilter]);

    const refetchAll = async () => {
        try {
            await Promise.all([refetch(), refetchDesigners()]);
        } catch (err) {
            console.log(err);
        }
    };

    const requestData = data?.allOrders;
    const subStatus = viewer?.company?.subscription?.status;
    const isSubscriptionActive = subStatus === 'active' || subStatus === 'paused';
    const isSubscriptionPaused = subStatus === 'paused';
    const navigateLocation = (obj, p) => {
        const stringify = qs.stringify(obj);
        history.push(`${location.pathname}?${stringify}`);
    };

    const handleChangeTab = tab => {
        navigateLocation({ tab, page: 1, max: state.max, status: 'All' });
        handleSetActiveFilters(false);
    };

    const handleChangePage = page => {
        navigateLocation({ ...state, page });
    };

    const handleChangeMax = max => {
        navigateLocation({ ...state, max });
    };

    const handleChangeStatus = status => {
        navigateLocation({ status, tab: state.tab, max: state.max, page: 1 });
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
        refetchOrder: refetch,
        search,
        activeStatusName: state.status,
        isSubscriptionPaused,
        tab: state.tab,
    };

    return (
        <DocumentTitle title="Requests">
            <Basepage location={location.pathname}>
                <PageContainer $maxW="1200">
                    <PopupFeedbackRequests refetch={refetchAll} />
                    <Box $d="flex" $justifyContent="space-between" $alignItems="center">
                        <Text hide="mobile" $textVariant="H3">
                            Requests
                        </Text>
                        <Text hide="desktop" $textVariant="H4">
                            Requests
                        </Text>
                        <Box $w="100%">
                            <Box $d="flex" $justifyContent="flex-end">
                                {isSubscriptionActive && subStatus !== 'paused' && (
                                    <Link to={CREATE_REQUEST}>
                                        {loading ? (
                                            <Box $d="flex" $flexDir="row" $gap="20px">
                                                {/* <Skeleton $w="404" $h="40" style={window.innerWidth < 800 ? { display: 'none' } : {}} /> */}
                                                <Skeleton $w="194" $h="44" style={window.innerWidth < 370 ? { display: 'none' } : {}} />
                                            </Box>
                                        ) : (
                                            <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />}>
                                                CREATE REQUEST
                                            </Button>
                                        )}
                                    </Link>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    {isSubscriptionActive ? (
                        <Box $mt="18">
                            {loading ? (
                                <Box>
                                    <Box $d="flex" $flexDir="row" $gap="20px" $mt="16px" $mb="13px" $justifyContent="space-between">
                                        <Box $d="flex" $flexDir="row" $gap="20px">
                                            <Skeleton $w="80" $h="48" />
                                            <Skeleton $w="80" $h="48" />
                                            <Skeleton $w="80" $h="48" />
                                        </Box>
                                        <Box $d="flex" $flexDir="row" $gap="20px">
                                            <Skeleton $w="400" $h="48" />
                                            <Skeleton $w="120" $h="48" />
                                        </Box>
                                    </Box>
                                    <SectionRequest name="queue" statuses={getOrderGroupValues('QUEUE')} windowWidth={windowWidth} {...requestSectionProps} />
                                </Box>
                            ) : (
                                <Tabs
                                    defaultActiveKey={state.tab}
                                    animated={false}
                                    onChange={handleChangeTab}
                                    items={[
                                        {
                                            key: 'QUEUE',
                                            label: 'Queue',
                                            children: (
                                                <SectionRequest
                                                    name="queue"
                                                    statuses={getOrderGroupValues('QUEUE')}
                                                    windowWidth={windowWidth}
                                                    {...requestSectionProps}
                                                />
                                            ),
                                        },
                                        {
                                            key: 'DELIVERED',
                                            label: 'Delivered',
                                            children: (
                                                <SectionRequest
                                                    name="delivered"
                                                    statuses={getOrderGroupValues('DELIVERED')}
                                                    windowWidth={windowWidth}
                                                    {...requestSectionProps}
                                                />
                                            ),
                                        },
                                        {
                                            key: 'DRAFT',
                                            label: 'Draft',
                                            children: <SectionRequest name="draft" windowWidth={windowWidth} {...requestSectionProps} />,
                                        },
                                    ]}
                                    renderTabBar={tabBarProps => (
                                        <CustomTabBar
                                            {...tabBarProps}
                                            extraContent={
                                                windowWidth >= 768 ? (
                                                    <ExtraTabContent
                                                        currentTab={state.tab}
                                                        location={location}
                                                        history={history}
                                                        categoriesData={categoriesData}
                                                        brandsData={brandsData}
                                                        companyData={companyData}
                                                        handleSetActiveFilters={handleSetActiveFilters}
                                                        search={{
                                                            initialValue: search,
                                                            onChange: setSearch,
                                                            isSubscriptionActive,
                                                            subStatus,
                                                        }}
                                                        allDesigners={allDesigners}
                                                        isDesignersLoading={designersLoading}
                                                    />
                                                ) : null
                                            }
                                        />
                                    )}
                                />
                            )}
                            {windowWidth <= 768 && isFilterOpen && (
                                <Box style={{ width: '100%', maxWidth: '100vw' }} $pos="fixed" $left="0" $bottom="0">
                                    <ExtraTabContent
                                        currentTab={state.tab}
                                        location={location}
                                        history={history}
                                        categoriesData={categoriesData}
                                        brandsData={brandsData}
                                        companyData={companyData}
                                        search={false}
                                        isNav
                                        handleSetFilter={handleSetFilter}
                                        handleSetActiveFilters={handleSetActiveFilters}
                                        allDesigners={allDesigners}
                                        isDesignersLoading={designersLoading}
                                    />
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <SubscriptionInactive />
                    )}
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(withNavSearchProvider(withResponsive(RequestsBase)));
