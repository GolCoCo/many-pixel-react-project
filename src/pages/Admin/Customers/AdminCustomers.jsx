import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import IconAdd from '@components/Svg/IconAdd';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import { openProtectedDownloadLink } from '@constants/client';
import CustomersByAccounts from './CustomersByAccounts';
import CustomersByUsers from './CustomersByUsers';
import { CustomerPopupContext, CustomerPopupProvider } from './blocks/CustomerPopupContext.jsx';

function doExport(isCompanies) {
    if (isCompanies) {
        openProtectedDownloadLink('/admin/export/stream-all-companies-to-csv');
    } else {
        openProtectedDownloadLink('/admin/export/stream-all-users-to-csv');
    }
}

const AdminCustomers = () => {
    const [activeTab, setActiveTab] = useState('ACCOUNTS');

    const handleChangeTab = tab => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };

    const isAccountsActive = activeTab === 'ACCOUNTS';

    return (
        <DocumentTitle title="Customers | ManyPixels">
            <Basepage>
                <CustomerPopupProvider>
                    <PageContainer $maxW="1232">
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="30">
                            <Text hide="mobile" $textVariant="H3">
                                Customers
                            </Text>
                            <Text hide="desktop" $textVariant="H4">
                                Customers
                            </Text>
                            <CustomerPopupContext.Consumer>
                                {({ setAdding }) => (
                                    <Box $d="flex" $alignItems="center">
                                        <Button type="default" $mr="20" onClick={() => doExport(isAccountsActive)}>
                                            EXPORT CSV
                                        </Button>

                                        <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />} onClick={() => setAdding(true)}>
                                            ADD {isAccountsActive ? 'ACCOUNT' : 'USER'}
                                        </Button>
                                    </Box>
                                )}
                            </CustomerPopupContext.Consumer>
                        </Box>
                        <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                            <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('ACCOUNTS')} $mb="-1">
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
                            <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => handleChangeTab('USERS')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={!isAccountsActive ? 'cta' : 'primary'} $pb="11" $pos="relative" $overflow="hidden">
                                    Users
                                    <Box
                                        $h="3"
                                        $w="38.42"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={!isAccountsActive ? '0' : '-38.42'}
                                    />
                                </Text>
                            </Box>
                        </Box>
                        {isAccountsActive ? <CustomersByAccounts /> : <CustomersByUsers />}
                    </PageContainer>
                </CustomerPopupProvider>
            </Basepage>
        </DocumentTitle>
    );
};

export default AdminCustomers;
