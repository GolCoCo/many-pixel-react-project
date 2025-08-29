import React, { useState, memo, useEffect, useMemo } from 'react';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Tabs } from '@components/Tabs';
import withLoggedUser from '@components/WithLoggedUser';
import DocumentTitle from '@components/DocumentTitle';
import { COMPANY_ROLE_ADMIN } from '@constants/account';
import { PROFILE, COMPANY, BILLING } from '@constants/routes';
import ProfileInfo from './ProfileInfo';
import Company from './Company';
import Billing from './Billing';

const Profile = memo(({ location, viewer, refetchViewer }) => {
    /**
     * Allow us to target a particular tab on mounting
     * */
    const [activeTab, setActiveTab] = useState('Profile');
    const history = useHistory();
    const [defaultTab, setDefaultTab] = useState('1');
    const tabItems = useMemo(() => {
        let defaultTabs = [
            {
                key: '1',
                label: 'Profile',
                children: <ProfileInfo user={viewer} />
            }
        ]
        if (viewer?.companyRole && viewer.role === 'customer') {
            defaultTabs = [
                ...defaultTabs,
                {
                    key: '2',
                    label: 'Company',
                    children: <Company user={viewer} refetchViewer={refetchViewer} />
                }
            ]
        }
        if (viewer?.companyRole === COMPANY_ROLE_ADMIN) {
            defaultTabs = [
                ...defaultTabs,
                {
                    key: '3',
                    label: 'Billing',
                    children: <Billing user={viewer} />
                }
            ]
        }
        return defaultTabs
    }, [viewer])


    useEffect(() => {
        let selectedTab;
        const parsed = qs.parse(location.search);
        const tabKey = parsed.tab ? parsed.tab : '1';

        switch (tabKey) {
            case '1': {
                selectedTab = 'Profile';
                break;
            }
            case '2': {
                selectedTab = 'Company';
                break;
            }
            case '3': {
                selectedTab = 'Billing';
                break;
            }
            default: {
                selectedTab = 'Profile';
                break;
            }
        }

        setActiveTab(selectedTab);
        setDefaultTab(tabKey);
    }, [location]);

    const handleChangeTab = key => {
        switch (key) {
            case '1': {
                history.push(PROFILE);
                break;
            }
            case '2': {
                history.push(COMPANY);
                break;
            }
            case '3': {
                history.push(BILLING);
                break;
            }
            default: {
                history.push(PROFILE);
                break;
            }
        }
    };


    return (
        <DocumentTitle title={`${activeTab} | ManyPixels`}>
            <Basepage>
                <PageContainer $maxW="1200">
                    <Text hide="mobile" $textVariant="H3" $colorScheme="headline" $mb="15">
                        {activeTab}
                    </Text>
                    <Text hide="desktop" $textVariant="H4" $colorScheme="headline" $mb="15">
                        {activeTab}
                    </Text>
                    <Box $mt="22">
                        <Tabs
                            items={tabItems}
                            activeKey={defaultTab}
                            onChange={handleChangeTab}
                        />
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default withLoggedUser(Profile);
