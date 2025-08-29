import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import { Tabs } from '@components/Tabs';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { withResponsive } from '@components/ResponsiveProvider';
import { useDetailContext } from './DetailContext.js';
import { TabMessage } from './TabMessage.jsx';
import { TabBrief } from './TabBrief.jsx';
import { TabFile } from './TabFile.jsx';
import { CardAsideDetail } from './CardAsideDetail.jsx';
import { CardAsideFeedback } from './CardAsideFeedback.jsx';
import { ORDER_STATUS_COMPLETED } from '@constants/order';
import withSocket from '@components/WithSocket';
import { RequestTabContainer } from '../../style.js';

const helpText = (
    <>
        If you would like to contact your project manager directly, please use the{' '}
        <Text as="span" $fontWeight="600">
            chat button{' '}
        </Text>{' '}
        below.
    </>
);
const DetailContent = ({ windowHeight, windowWidth, ...socket }) => {
    const { request, activeTab, setActiveTab } = useDetailContext();
    const tabItems = useMemo(() => {
        let defaultTabs = [
            {
                key: 'messages',
                label: (
                    <Text $d="inline-flex" $alignItems="center">
                        Messages
                    </Text>
                ),
                children: <TabMessage {...socket} />,
            },
            {
                key: 'files',
                label: 'Files',
                children: <TabFile />,
            },
            {
                key: 'brief',
                label: 'Brief',
                children: <TabBrief />,
            },
            {
                key: 'details',
                label: 'Details',
                children: <CardAsideDetail hideHeader />,
            },
        ];
        if (windowWidth >= 768) {
            defaultTabs.pop();
        }

        return defaultTabs;
    }, [windowWidth, socket]);

    return (
        <Box $d="flex" $flexDir="row" $mx={['0', '-15px']} $flexWrap="wrap">
            <Box x="14px" $w="100%" $maxW="930">
                <RequestTabContainer $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $overflow="hidden" $radii="12">
                    <Tabs
                        activeKey={activeTab}
                        items={tabItems}
                        renderTabBar={(props, DefaultTabBar) => {
                            return (
                                <Box
                                    $px={['14', '20']}
                                    $h="49"
                                    $d="flex"
                                    $alignItems="flex-end"
                                    $borderB="1"
                                    $borderBottomStyle="solid"
                                    $borderBottomColor="outline-gray"
                                >
                                    <DefaultTabBar {...props} style={{ borderBottomWidth: 0 }} />
                                </Box>
                            );
                        }}
                        onChange={setActiveTab}
                    />
                </RequestTabContainer>
            </Box>
            <Box hide="mobile" $px="15px" $w="100%" $maxW={['100%', '300px']}>
                <CardAsideDetail />
                {request.rate && request.status === ORDER_STATUS_COMPLETED ? (
                    <CardAsideFeedback rate={request.rate} />
                ) : (
                    <Box $bg="bg-gray" $py={windowHeight >= 850 ? '20' : '11'} $px="20" $radii="10">
                        {windowHeight >= 850 ? (
                            <>
                                <Text $textVariant="H6" $colorScheme="primary" $mb="10" $lineH="20">
                                    Need Help?
                                </Text>
                                <Text $textVariant="Badge" $colorScheme="primary" $fontWeight="300">
                                    {helpText}
                                </Text>
                            </>
                        ) : (
                            <Tooltip color="white" title={helpText}>
                                <Text $d="inline" $textVariant="H6" $colorScheme="cta" $cursor="pointer">
                                    Need Help?
                                </Text>
                            </Tooltip>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default withSocket(withResponsive(DetailContent));
