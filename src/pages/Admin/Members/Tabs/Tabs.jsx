import React from 'react';
import _ from 'lodash';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';
import { USER_TYPE_WORKER } from '@constants/account';
import Profile from './blocks/Profile';
import Designers from './blocks/Designers';
import Requests from './blocks/Requests';
import Accounts from './blocks/Accounts';
import { TabItem } from '@pages/Admin/Account/blocks/TabItem';

const getMemberTabs = (member, isWorker) => {
    const tabs = {
        profile: Profile,
    };
    if (isWorker) {
        tabs.requests = Requests;
        tabs.accounts = Accounts;
    } else {
        tabs.designers = Designers;
    }

    return tabs;
};

const Tabs = ({ tabKey, onChangeTab, viewer, refetch, loading, member, ...props }) => {
    const isWorker = viewer?.role === USER_TYPE_WORKER;
    const isMemberWorker = member?.role === USER_TYPE_WORKER;
    const isTabActive = key => _.toLower(tabKey) === _.toLower(key);
    const AllTabs = getMemberTabs(member, isMemberWorker);
    const ActiveTab = AllTabs[tabKey];

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
                <TabItem isTabActive={isTabActive} label="Profile" tabName="profile" />
                {!isMemberWorker && <TabItem isTabActive={isTabActive} label="Designers" tabName="designers" />}
                {isMemberWorker && (
                    <>
                        <TabItem isTabActive={isTabActive} label="Requests" tabName="requests" />
                        <TabItem isTabActive={isTabActive} label="Accounts" tabName="accounts" />
                    </>
                )}
            </Box>
            <Box>
                <ActiveTab refetch={refetch} member={member} isWorker={isWorker} viewer={viewer} {...props} />
            </Box>
        </>
    );
};

export default Tabs;
