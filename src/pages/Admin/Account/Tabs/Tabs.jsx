import React from 'react';
import _ from 'lodash';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import BrandsTab from './blocks/BrandsTab';
import UsersTab from './blocks/UsersTab';
import InfoTab from './blocks/InfoTab';
import SettingsTab from './blocks/SettingsTab';
import RequestsTab from './blocks/RequestsTab';
import SubscriptionTab from './blocks/SubscriptionTab';
import NotesTab from './blocks/NotesTab';
import { TabItem } from '../blocks/TabItem';

const AllTabs = {
    requests: RequestsTab,
    notes: NotesTab,
    settings: SettingsTab,
    subscription: SubscriptionTab,
    info: InfoTab,
    brands: BrandsTab,
    users: UsersTab,
};

const WorkerTabs = {
    requests: RequestsTab,
    info: InfoTab,
    settings: SettingsTab,
    brands: BrandsTab,
    users: UsersTab,
};

const Tabs = ({ isWorker, tabKey, company, viewer, refetch, loading, previousPage }) => {
    const isTabActive = key => _.toLower(tabKey) === _.toLower(key);
    const UsedTabs = isWorker ? WorkerTabs : AllTabs;
    const ActiveTab = UsedTabs[tabKey] ?? InfoTab;

    if (loading) {
        return (
            <Box>
                <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke" $mb="30">
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" $mr="27" />
                    <Skeleton $w="64" $h="20" $mb="11" />
                </Box>
                <Box>
                    <Skeleton $w="65" $h="26" $mb="20" />
                    <Box $d="flex" $alignItems="flex-start" $mb="20">
                        <Box $mr="40">
                            <Skeleton $w="109" $h="20" $mb="10" />
                            <Skeleton $w="545" $h="40" />
                        </Box>
                        <Box>
                            <Skeleton $w="109" $h="20" $mb="10" />
                            <Skeleton $w="545" $h="40" />
                        </Box>
                    </Box>
                    <Box $d="flex" $alignItems="flex-start" $mb="20">
                        <Box $mr="40">
                            <Skeleton $w="109" $h="20" $mb="10" />
                            <Skeleton $w="545" $h="40" />
                        </Box>
                        <Box>
                            <Skeleton $w="109" $h="20" $mb="10" />
                            <Skeleton $w="545" $h="40" />
                        </Box>
                    </Box>
                    <Box $mb="20">
                        <Skeleton $w="109" $h="20" $mb="10" />
                        <Skeleton $w="100%" $h="40" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="requests" label="Requests" />
                <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="info" label="Info" />
                <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="settings" label="Settings" />
                <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="users" label="Users" />
                <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="brands" label="Brands" />
                {!isWorker && <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="notes" label="Notes" />}
                {!isWorker && <TabItem isTabActive={isTabActive} previousPage={previousPage} tabName="subscription" label="Subscription" />}
            </Box>
            <Box>
                <ActiveTab isWorker={isWorker} refetch={refetch} viewer={viewer} company={company} />
            </Box>
        </>
    );
};

export default Tabs;
