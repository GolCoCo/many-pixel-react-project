import React, { useState, useMemo, memo, useEffect } from 'react';
import { Box } from '@components/Box';
import Header from './Header';
import Tabs from './Tabs';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import { COMPANY_ACCOUNT_INFO } from '@graphql/queries/company';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { getValueFromQueryString } from '@utils/queryStringHelpers';
import { ACCOUNT_INFO, CUSTOMERS, REQUESTS } from '@constants/routes';
import withLoggedUser from '@components/WithLoggedUser';
import { USER_TYPE_WORKER } from '@constants/account';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { Button } from '@components/Button';

const Account = memo(({ viewer }) => {
    const routeMatch = useRouteMatch(ACCOUNT_INFO);
    const isWorker = viewer?.role === USER_TYPE_WORKER;

    const variables = useMemo(() => {
        const vars = { id: routeMatch.params.id, usersWhere: { AND: [] } };
        return vars;
    }, [routeMatch.params.id]);

    const location = useLocation();
    const history = useHistory();
    const [tabKey, setTabKey] = useState(getValueFromQueryString(location, 'tab', String, 'requests'));
    const { data, refetch, loading } = useQuery(COMPANY_ACCOUNT_INFO, {
        variables,
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    });
    const company = useMemo(() => data?.Company, [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const newTab = getValueFromQueryString(location, 'tab', String, 'requests');
        setTabKey(newTab);
    }, [location]);

    const previousPage = history?.location?.state?.previousPage ?? null;

    const handleClickBack = () => {
        if (isWorker) {
            history.push(previousPage || REQUESTS);
        } else {
            history.push(previousPage || CUSTOMERS);
        }
    };

    return (
        <DocumentTitle title="Account | ManyPixels">
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
                        <Box $maxW="1200" $w="100%">
                            <Header loading={loading} company={company} isWorker={isWorker} />
                            <Tabs refetch={refetch} isWorker={isWorker} company={company} tabKey={tabKey} loading={loading} previousPage={previousPage} />
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default withLoggedUser(Account);
