import React, { memo, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Box } from '@components/Box';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';
import { USER_TYPE_WORKER } from '@constants/account';
import AccountsTabFilter from './AccountsTabFilter';
import AccountsList from './AccountsList';

const AccountsTab = memo(({ viewer, designerId }) => {
    const parsed = qs.parse(window.location.search);
    const { push } = useHistory();
    const [filters, setFilters] = useState({
        account: 'ALL',
        designer: designerId || (viewer?.role === USER_TYPE_WORKER ? viewer?.id : 'ALL'),
        keyword: parsed.keyword ? parsed.keyword : '',
        product: parsed.product ? parsed.product : 'ALL',
        status: ['ALL'],
        team: parsed.team ? parsed.team : 'ALL',
    });

    const onChangeFilters = useCallback(
        debounce((name, value) => {
            setFilters(current => {
                if (name in current) {
                    return { ...current, [name]: value };
                }

                return current;
            });

            const currentFilter = qs.parse(window.location.search);
            const stringify = qs.stringify(Object.assign(currentFilter, { [name]: value }));
            push({
                pathname: window.location.pathname,
                search: stringify,
            });
        }, 1000),
        []
    );

    return (
        <Box>
            <AccountsTabFilter viewer={viewer} onChangeFilters={onChangeFilters} designerId={designerId} />
            <AccountsList viewer={viewer} filters={filters} designerId={designerId} />
        </Box>
    );
});

export default AccountsTab;
