import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
// import { ADMIN_COMPANY } from '@constants/routes';
import withLoggedUser from '@components/WithLoggedUser';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import Header from './Header';
import { USER_MEMBER_INFO } from '@graphql/queries/user';
import { MEMBER_INFO } from '@constants/routes';
import { getValueFromQueryString, updateURLWithQueryString } from '@utils/queryStringHelpers';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import Tabs from './Tabs';
// import { USER_TYPE_WORKER } from '@constants/account';

const PREV_LOCATION_STORAGE_KEY = 'PREV_MEMBER_PATH';
const getFromStorage = () => window.localStorage.getItem(PREV_LOCATION_STORAGE_KEY);
const setToStorage = value => window.localStorage.setItem(PREV_LOCATION_STORAGE_KEY, value);

const Members = memo(({ viewer }) => {
    const routeMatch = useRouteMatch(MEMBER_INFO);
    // const isWorker = viewer?.role === USER_TYPE_WORKER;
    const history = useHistory();
    const location = useLocation();
    const [page, setPage] = useState(1);
    const [refetching, setRefetching] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [tabKey, setTabKey] = useState(() => getValueFromQueryString(location, 'tab', String, 'profile'));
    const [previousPage] = useState(() => {
        return location.state?.previousPage ?? getFromStorage() ?? null;
    });

    const { data, loading, refetch } = useQuery(USER_MEMBER_INFO, {
        variables: {
            id: routeMatch.params.id,
            first: pageSize,
            skip: (page - 1) * pageSize,
        },
    });

    const handleRefetch = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    useEffect(() => {
        const newTab = getValueFromQueryString(location, 'tab', String, 'profile');
        setTabKey(newTab);

        if (location.state?.previousPage) {
            setToStorage(location.state.previousPage);
        }
    }, [location]);

    const member = useMemo(() => data?.User, [data]);
    const onChangeTab = useCallback(
        newTab => {
            if (newTab && newTab !== tabKey) {
                const newUrl = updateURLWithQueryString(location, { tab: newTab });
                history.push(newUrl);
            }
        },
        [history, location, tabKey]
    );

    const handleClickBack = () => {
        if (previousPage !== null && previousPage) {
            history.push(previousPage);
        } else {
            history.goBack();
        }
    };

    return (
        <DocumentTitle title="Member | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1288">
                    <Box $d="flex" $alignItems="flext-start">
                        <Box $mr="20">
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                onClick={handleClickBack}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        </Box>
                        <Box $w="1200">
                            <Header viewer={viewer} member={member} refetch={handleRefetch} loading={loading && !refetching} />
                            <Tabs
                                member={member}
                                onChangeTab={onChangeTab}
                                loading={loading && !refetching}
                                tabKey={tabKey}
                                page={page}
                                refetch={handleRefetch}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                setPage={setPage}
                                viewer={viewer}
                            />
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default withLoggedUser(Members);
