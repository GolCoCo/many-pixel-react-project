import React from 'react';
import { Tabs } from '@components/Tabs';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import { withResponsive } from '@components/ResponsiveProvider';
import { useDetailContext } from './DetailContext.js';
import { TabMessage } from './TabMessage.jsx';
import { TabBrief } from './TabBrief.jsx';
import { TabFile } from './TabFile.jsx';
import { CardAsideDetail } from './CardAsideDetail.jsx';
import withSocket from '@components/WithSocket';
import { USER_TYPE_WORKER } from '@constants/account';
import { RequestTabContainer } from '../../style.js';

const DetailContent = ({ windowHeight, ...socket }) => {
    const { request, activeTab, setActiveTab, viewerRole } = useDetailContext();
    const isWorker = viewerRole === USER_TYPE_WORKER;

    return (
        <Box $d="flex" $flexDir="row" $mx={['0', '-15px']} $flexWrap="wrap">
            <Box $px="14px" $w="100%" $maxW="930">
                <RequestTabContainer $borderW="1" style={{ borderRadius: '10px' }} $borderStyle="solid" $borderColor="outline-gray">
                    <Tabs
                        activeKey={activeTab}
                        renderTabBar={({ panels, ...props }, DefaultTabBar) => (
                            <Box $px="20" $h="49" $d="flex" $alignItems="flex-end" $borderB="1" $borderBottomStyle="solid" $borderBottomColor="outline-gray">
                                <DefaultTabBar {...props} panels={panels} style={{ borderBottomWidth: 0 }} />
                            </Box>
                        )}
                        onChange={setActiveTab}
                    >
                        <Tabs.TabPane
                            tab={
                                <Text $d="inline-flex" $alignItems="center">
                                    Messages{' '}
                                    {request.unreadMessages > 0 && (
                                        <Badge $isNotification $ml="6">
                                            &nbsp;
                                        </Badge>
                                    )}
                                </Text>
                            }
                            key="messages"
                        >
                            <TabMessage {...socket} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Files" key="files">
                            <TabFile />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Brief" key="brief">
                            <TabBrief />
                        </Tabs.TabPane>
                    </Tabs>
                </RequestTabContainer>
            </Box>
            <Box $px="15px" $w="100%" $maxW="300px">
                <CardAsideDetail isWorker={isWorker} />
            </Box>
        </Box>
    );
};

export default withSocket(withResponsive(DetailContent));
