import React, { useMemo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import withLoggedUser from '@components/WithLoggedUser';
import { useHistory, useLocation } from 'react-router-dom';
import AccountsTab from './AccountsTab';
import RequestsTab from './RequestsTab';
import { USER_TYPE_WORKER } from '@constants/account';

const AdminRequests = ({ viewer }) => {
    const { search, pathname } = useLocation();
    const { push } = useHistory();

    const { searchParams, tab } = useMemo(() => {
        const newSearchParams = new URLSearchParams(search);

        return {
            searchParams: newSearchParams,
            tab: newSearchParams.get('tab') || 'accounts',
        };
    }, [search]);

    const handleChangeTab = toTab => {
        searchParams.set('tab', toTab);
        searchParams.set('page', 1);
        searchParams.set('pageSize', 10);

        push({
            pathname,
            search: searchParams.toString(),
        });
    };

    const isAccountsActive = tab === 'accounts';
    const isWorker = viewer?.role === USER_TYPE_WORKER;

    return (
        <DocumentTitle title="Requests | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1232">
                    <Box $mb="30">
                        <Text hide="mobile" $textVariant="H3">
                            Requests
                        </Text>
                        <Text hide="desktop" $textVariant="H4">
                            Requests
                        </Text>
                    </Box>

                    {!isWorker && (
                        <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                            <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('accounts')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={isAccountsActive ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                                    Accounts
                                    <Box
                                        $h="3"
                                        $w="64.172"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={isAccountsActive ? '0' : '64.172'}
                                    />
                                </Text>
                            </Box>
                            <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('requests')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={!isAccountsActive ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                                    Requests
                                    <Box
                                        $h="3"
                                        $w="63.109"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={!isAccountsActive ? '0' : '-63.109'}
                                    />
                                </Text>
                            </Box>
                        </Box>
                    )}
                    {isWorker && (
                        <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                            <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('requests')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={!isAccountsActive ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                                    Requests
                                    <Box
                                        $h="3"
                                        $w="63.109"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={!isAccountsActive ? '0' : '-63.109'}
                                    />
                                </Text>
                            </Box>
                            <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('accounts')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={isAccountsActive ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                                    Accounts
                                    <Box
                                        $h="3"
                                        $w="64.172"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={isAccountsActive ? '0' : '64.172'}
                                    />
                                </Text>
                            </Box>
                        </Box>
                    )}

                    <Box $py="30">{isAccountsActive ? <AccountsTab viewer={viewer} /> : <RequestsTab viewer={viewer} />}</Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(AdminRequests);
