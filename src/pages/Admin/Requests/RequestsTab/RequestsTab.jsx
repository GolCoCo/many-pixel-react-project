import React, { memo, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Box } from '@components/Box';
import { USER_TYPE_WORKER } from '@constants/account';
import RequestsTabFilter from './RequestsTabFilter';
import RequestsList from './RequestsList';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';

const RequestsTab = memo(({ viewer, designerId }) => {
    const parsed = qs.parse(window.location.search);
    const { push } = useHistory();
    const [filters, setFilters] = useState({
        account: 'ALL',
        designer: designerId || (viewer?.role === USER_TYPE_WORKER ? viewer?.id : 'ALL'),
        keyword: parsed.keyword ? parsed.keyword : '',
        product: parsed.product ? parsed.product : 'ALL',
        status: viewer?.role === USER_TYPE_WORKER ? ['SUBMITTED', 'ONGOING_PROJECT'] : parsed.status || ['ALL'],
        team: parsed.team ? parsed.team : 'ALL',
    });

    const onChangeFilters = useCallback(
        debounce((name, value, reset) => {
            let newFilter = { [name]: value };
            if (reset) {
                newFilter = {
                    account: 'ALL',
                    designer: designerId || (viewer?.role === USER_TYPE_WORKER ? viewer?.id : 'ALL'),
                    keyword: '',
                    product: 'ALL',
                    status: viewer?.role === USER_TYPE_WORKER ? ['SUBMITTED', 'ONGOING_PROJECT'] : ['ALL'],
                    team: 'ALL',
                    page: 1,
                    pageSize: 10,
                };
                setFilters(newFilter);
            } else {
                setFilters(current => {
                    const newValue = { ...current, [name]: value };
                    return newValue;
                });
            }

            const currentFilter = qs.parse(window.location.search);
            const stringify = qs.stringify(Object.assign(currentFilter, newFilter));
            push({
                pathname: window.location.pathname,
                search: stringify,
            });
        }, 1000),
        [viewer.role]
    );

    return (
        <Box>
            <RequestsTabFilter viewer={viewer} onChangeFilters={onChangeFilters} designerId={designerId} />
            <RequestsList viewer={viewer} filters={filters} designerId={designerId} />
        </Box>
    );
});

export default RequestsTab;
