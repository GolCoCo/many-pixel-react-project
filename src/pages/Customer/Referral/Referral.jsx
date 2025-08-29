import React from 'react';
import { ConfigProvider } from 'antd';
import { fbButton, tw, linkedin } from 'vanilla-sharing';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import IconEmailInvitation from '@components/Svg/IconEmailInvitation';
import IconEmailBoblo from '@components/Svg/IconEmailBoblo';
import { Button } from '@components/Button';
import IconBrandFacebook from '@components/Svg/IconBrandFacebook';
import IconBrandTwitter from '@components/Svg/IconBrandTwitter';
import IconBrandLinkedin from '@components/Svg/IconBrandLinkedin';
import { Table } from '@components/Table';
import { Badge } from '@components/Badge';
import message from '@components/Message';
import DocumentTitle from '@components/DocumentTitle';
import FormReferralInvite from './blocks/FormReferralInvite.jsx';
import { EmptyData } from '@components/EmptyData';
import { Skeleton } from '@components/Skeleton/index.js';

const columns = [
    {
        title: 'Activity',
        dataIndex: 'from',
        key: 'activity',
        render: act => (
            <Text $textVariant="P4" $colorScheme="primary">
                {act === 'EMAIL' ? 'Email referral' : 'Link referral'}
            </Text>
        ),
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: text => (
            <Text $textVariant="P4" $colorScheme="primary">
                {text}
            </Text>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'date',
        render: createdAt => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateObj = new Date(createdAt);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();

            return (
                <Text $textVariant="P4" $colorScheme="primary">
                    {day} {month} {year}
                </Text>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: stat => {
            const currentStatus = stat === 'INVITED' ? 'Sent' : 'Accepted';

            return <Badge $variant={currentStatus}>{currentStatus}</Badge>;
        },
    },
];

const Referral = ({ viewer }) => {
    const referralURL = `https://platform.manypixels.co/onboard?referral=${viewer?.id ?? null}`;

    const handleCopyShareLink = () => {
        navigator.clipboard.writeText(referralURL);
        message.destroy();
        message.success('Link copied');
    };

    const getTotalEarned = referralData => {
        if (referralData.length) {
            let totalEarned = 0;
            referralData.map(data => {
                const { paid } = data;

                if (paid) {
                    totalEarned += 100;
                }

                return data;
            });
            return `$${totalEarned}`;
        } else {
            return '$0';
        }
    };

    if (!viewer) {
        return (
            <DocumentTitle title="Referral | ManyPixels">
                <Basepage>
                    <PageContainer $maxW="1200">
                        <Box $mb={['20', '10']}>
                            <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                                Refer a friend
                            </Text>
                            <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                                Refer a friend
                            </Text>
                        </Box>
                        <Text hide="mobile" $textVariant="P4" $colorScheme="secondary" $maxW="730" $w="100%" $mb="24">
                            You can earn money by referring friends to ManyPixels. For every new referral who completes the 14-day trial period, you will get $100
                            off your next invoice while your friend will get $100 off their first month.
                        </Text>
                        <Box $d="flex" $alignItems="center" $gap="35px" $mb="35px" $mt="26px">
                            <Skeleton $w="107" $h="20" />
                            <Skeleton $w="143" $h="20" />
                        </Box>
                        <Box $d="flex" $justifyContent="space-between" $mb="33px">
                            <Box>
                                <Skeleton $w="59" $h="20" $mb="23px" />
                                <Skeleton $w="116" $h="16" $mb="11px" />
                                <Skeleton $w="298" $h="40" $mb="22px" style={window.innerWidth < 600 ? { display: 'none' } : {}} />
                                <Skeleton $w="132" $h="40" />
                            </Box>
                            <Box>
                                <Skeleton $w="184" $h="20" $mb="23px" />
                                <Skeleton $w="116" $h="16" $mb="11px" />
                                <Skeleton $w="580" $h="40" $mb="19px" style={window.innerWidth < 950 ? { display: 'none' } : {}} />
                                <Box $d="flex" $gap="12px">
                                    <Skeleton $w="40" $h="40" />
                                    <Skeleton $w="40" $h="40" />
                                    <Skeleton $w="40" $h="40" />
                                </Box>
                            </Box>
                        </Box>
                        <hr />
                        <Skeleton $w="160" $h="20" $mt="35px" $mb="20px" />
                        <Box $d="flex" $flexDir="column" style={{ border: '1px solid #D5D6DD' }} $mb="20px">
                            <Box $d="flex" style={{ borderBottom: '1px solid #D5D6DD' }}>
                                <Box $w="100%" $h="40px" $d="flex" $alignItems="center">
                                    <Skeleton $w="47px" $h="16" $ml="20px" $mr="220px" />
                                    <Skeleton $w="71px" $h="16" $mr="362px" style={window.innerWidth < 800 ? { display: 'none' } : {}} />
                                    <Skeleton $w="33px" $h="16" $mr="186px" style={window.innerWidth < 800 ? { display: 'none' } : {}} />
                                    <Skeleton $w="37px" $h="16" $pr="16px" style={window.innerWidth < 600 ? { display: 'none' } : {}} />
                                </Box>
                            </Box>
                            {Array.from({ length: 3 }, (_, i) => (
                                <Box $d="flex" style={i !== 2 ? { borderBottom: '1px solid #D5D6DD' } : {}}>
                                    <Box $w="100%" $h="52px" $d="flex" $alignItems="center">
                                        <Skeleton $w="79px" $h="16" $ml="20px" $mr="188px" />
                                        <Skeleton $w="266px" $h="16" $mr="167px" style={window.innerWidth < 800 ? { display: 'none' } : {}} />
                                        <Skeleton $w="69px" $h="16" $mr="150px" style={window.innerWidth < 800 ? { display: 'none' } : {}} />
                                        <Skeleton $w="108px" $h="32" $pr="16px" style={window.innerWidth < 600 ? { display: 'none' } : {}} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box $d="flex" $justifyContent="flex-end" $gap="8px">
                            {Array.from({ length: 7 }, (_, i) => (
                                <Skeleton $w="40" $h="40" />
                            ))}
                            <Skeleton $w="87" $h="40" />
                        </Box>
                    </PageContainer>
                </Basepage>
            </DocumentTitle>
        );
    }

    return (
        <DocumentTitle title="Referral | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1200">
                    <Box $mb={['20', '10']}>
                        <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                            Refer a friend
                        </Text>
                        <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                            Refer a friend
                        </Text>
                    </Box>
                    <Text hide="mobile" $textVariant="P4" $colorScheme="secondary" $maxW="730" $w="100%" $mb="24">
                        You can earn money by referring friends to ManyPixels. For every new referral who completes the 14-day trial period, you will get $100 off
                        your next invoice while your friend will get $100 off their first month.
                    </Text>
                    <Box $d="flex" $alignItems="center" $mb="30">
                        <Box $hasSpace space="8" $d="flex" $alignItems="center" $mr="34">
                            <Box $colorScheme="cta" $lineH="1">
                                <IconEmailInvitation />
                            </Box>
                            <Text $textVariant="P4" $colorScheme="cta">
                                {viewer?.referees?.length}
                            </Text>
                            <Text $textVariant="P4" $colorScheme="primary">
                                invitations
                            </Text>
                        </Box>
                        <Box $hasSpace space="8" $d="flex" $alignItems="center">
                            <Box $colorScheme="#009846" $lineH="1">
                                <IconEmailBoblo />
                            </Box>
                            <Text $textVariant="P4" $colorScheme="#009846">
                                {getTotalEarned(viewer?.referees)}
                            </Text>
                            <Text $textVariant="P4" $colorScheme="primary">
                                total earned
                            </Text>
                        </Box>
                    </Box>
                    <Box $mx="-16px" $d="flex" $flexWrap="wrap" $mb="30">
                        <Box $px="16px" $w="100%" $maxW={['100%', '50%']}>
                            <Box $mb={['30', '0']}>
                                <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                                    Invite
                                </Text>
                                <FormReferralInvite />
                            </Box>
                        </Box>
                        <Box $px="16px" $w="100%" $maxW={['100%', '50%']}>
                            <Box>
                                <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                                    Share with friends
                                </Text>
                                <Text $textVariant="P4" $colorScheme="primary" $mb="10">
                                    Copy following link to share
                                </Text>
                                <Box $d="flex" $w="100%" $mb="20">
                                    <Text
                                        $textVariant="P4"
                                        $colorScheme="primary"
                                        $pt="10"
                                        $pb="10"
                                        $pl="16"
                                        $pr="16"
                                        $bg="bg-gray"
                                        $maxW="500"
                                        $isTruncate
                                        $radii="10px 0 0 10px"
                                    >
                                        {referralURL}
                                    </Text>
                                    <Button $radii="0 10px 10px 0" type="primary" htmlType="button" mobileH="40" onClick={handleCopyShareLink}>
                                        Copy
                                    </Button>
                                </Box>
                                <Box $hasSpace space="12">
                                    <Button
                                        $w="40"
                                        mobileH="40"
                                        $h="40"
                                        style={{ $borderColor: '#475993' }}
                                        icon={<IconBrandFacebook />}
                                        onClick={() =>
                                            fbButton({
                                                url: referralURL,
                                            })
                                        }
                                    />
                                    <Button
                                        $w="40"
                                        mobileH="40"
                                        $h="40"
                                        style={{ $borderColor: '#55ACEE' }}
                                        icon={<IconBrandTwitter />}
                                        onClick={() =>
                                            tw({
                                                url: referralURL,
                                                title: 'Get Your Graphic Design Team in a Few Clicks at ManyPixels',
                                                hashtags: [],
                                            })
                                        }
                                    />
                                    <Button
                                        $w="40"
                                        mobileH="40"
                                        $h="40"
                                        $lineH="1"
                                        style={{ $borderColor: '#0077B7' }}
                                        icon={<IconBrandLinkedin />}
                                        onClick={() =>
                                            linkedin({
                                                url: referralURL,
                                                title: 'Get Your Graphic Design Team in a Few Clicks at ManyPixels',
                                                description: `Get Your Graphic Design Team in a Few Clicks at ManyPixels ${referralURL}`,
                                            })
                                        }
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box hide="mobile">
                        <Box as="hr" $borderColor="outline-gray" />
                        <Box $mt="30">
                            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                                Referral activity
                            </Text>
                        </Box>
                        <ConfigProvider renderEmpty={EmptyData}>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={viewer?.referees ?? null}
                                rowKey={row => row.id}
                                pagination={{
                                    defaultPageSize: 3,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['3', '10', '20', '30', '40'],
                                }}
                            />
                        </ConfigProvider>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default Referral;
