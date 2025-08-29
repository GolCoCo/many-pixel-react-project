import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import withLoggedUser from '@components/WithLoggedUser';
import AccountsTab from '@pages/Admin/Requests/AccountsTab';
import RequestsTab from '@pages/Admin/Requests/RequestsTab';

const WorkerRequests = ({ viewer }) => {
    const [activeTab, setActiveTab] = useState('REQUESTS');

    const handleChangeTab = tab => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };

    const isAccountsActive = activeTab === 'ACCOUNTS';

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
                    <>
                        <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                            <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('REQUESTS')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={!isAccountsActive ? 'cta' : 'primary'} $mr="6" $pb="11" $pos="relative" $overflow="hidden">
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
                            <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('ACCOUNTS')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={isAccountsActive ? 'cta' : 'primary'} $mr="6" $pb="11" $pos="relative" $overflow="hidden">
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
                        <Box $py="30">
                            <Box $h={isAccountsActive ? 'auto' : '0'} $overflow={isAccountsActive ? 'visible' : 'hidden'}>
                                <AccountsTab viewer={viewer} />
                            </Box>
                            <Box $h={!isAccountsActive ? 'auto' : '0'} $overflow={!isAccountsActive ? 'visible' : 'hidden'}>
                                <RequestsTab viewer={viewer} />
                            </Box>
                        </Box>
                    </>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(WorkerRequests);
