import React, { memo, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { REQUESTS } from '@constants/routes';
import { Link } from '@components/Link';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import withLoggedUser from '@components/WithLoggedUser';
import { EllipsisMultiple } from '@components/EllipsisMultiple';
import { Skeleton } from '@components/Skeleton';
import DocumentTitle from '@components/DocumentTitle';
import { ORDER } from '@graphql/queries/order';
import { ALL_USERS, USERS_FOR_REQUEST } from '@graphql/queries/user';
import { ORDER_STATUS_LABELS } from '@constants/order';
import qs from 'qs';
import { withResponsive } from '@components/ResponsiveProvider';
import { DropdownRequestAction } from '../blocks/DetailRequest/DropdownRequestAction';
import DetailContent from '../blocks/DetailRequest/DetailContent';
import SubscriptionInactive from '../blocks/SubscriptionInactive';
import { MessageContext } from '../blocks/DetailRequest/MessageContext';
import { DetailContext } from '../blocks/DetailRequest/DetailContext';

function toArray(arrayLike) {
    const newArray = [];

    if (arrayLike?.length) {
        for (let x = 0; x < arrayLike.length; x += 1) {
            newArray.push(arrayLike[x]);
        }
    }

    return newArray;
}

const DetailRequest = memo(({ viewer, match, location }) => {
    const [activeFolderId, setActiveFolderId] = useState(() => {
        const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        return parsed.folder ?? null;
    });
    const companyId = viewer.company?.id;
    const [activeTab, setTab] = useState(() => {
        const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
        return parsed.tab ?? 'messages';
    });

    const setActiveTab = tab => {
        let parsed = new URLSearchParams(location.search);
        if (parsed.folder && tab !== 'files') {
            setActiveFolderId(null);
            delete parsed.folder;
        }
        searchParams.set('tab', tab);
        setTab(tab);
        window.history.pushState('', '', `${location.pathname}?${searchParams.toString()}`);
    };

    const searchParams = new URLSearchParams(location.search);

    const [refetching, setRefetching] = useState(false);
    const { params } = match;
    const { data, loading, refetch } = useQuery(ORDER, {
        variables: {
            id: +params?.id,
        },
        fetchPolicy: 'cache-first',
    });
    const { data: usersData } = useQuery(USERS_FOR_REQUEST, {
        variables: {
            where: {
                companyId,
            },
        },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (activeFolderId) {
            setActiveTab('files');
        }
    }, [activeFolderId]);

    const request = data?.Order;

    const files = request?.attachments;
    const size = files ? files.reduce((acc, f) => acc + f.size, 0) : 0;

    const users = usersData?.allUsers ?? [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const refetchRequests = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    const subStatus = viewer?.company?.subscription?.status;

    const isSubscriptionActive = subStatus === 'active' || subStatus === 'paused';
    const isSubscriptionPaused = subStatus === 'paused';

    if (!request) {
        return (
            <DocumentTitle title={`#${+params?.id} ${request?.name ?? ''} | ManyPixels`}>
                <Basepage>
                    {searchParams.get('tab') === 'files' ? <MySkeletonFiles /> : searchParams.get('tab') === 'brief' ? <MySkeletonBrief /> : <MySkeleton />}
                </Basepage>
            </DocumentTitle>
        );
    }
    const previewsFinal = toArray(request.previews);
    previewsFinal.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    const folders = [{ id: 'attachments', size, name: 'Discussion Attachments', files }].concat(previewsFinal);
    if (files?.length) {
        folders[0].createdAt = files[0]?.createdAt;
        folders[0].updatedAt = files[files.length - 1]?.updatedAt;
    }
    return (
        <DocumentTitle title={`#${+params?.id} ${request?.name ?? ''} | ManyPixels`}>
            <DetailContext.Provider
                value={{ folders, request, refetchRequests, activeTab, setActiveTab, isSubscriptionPaused, users, activeFolderId, setActiveFolderId }}
            >
                <MessageContext.Provider value={{ messages: [] }}>
                    <Basepage>
                        {(loading && !refetching) || request?.company?.id !== companyId ? (
                            <MySkeleton />
                        ) : (
                            <PageContainer $maxW="1288" $d="flex" $flexDir="row" $px={['8', '16']}>
                                <Box $pt="4" hide="mobile">
                                    <Button
                                        $w="36"
                                        $h="36"
                                        mobileH="36"
                                        type="default"
                                        className="ant-btn ant-btn-default"
                                        as={Link}
                                        to={REQUESTS}
                                        icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                    />
                                </Box>
                                <Box $pl={['0', '20']} $flex="1" $h="100%" $overflow="hidden">
                                    <Box hide="mobile">
                                        <Box $d="flex" $alignItems="center">
                                            <Text $textVariant="H3" $colorScheme="headline" $mb="12">
                                                {request.name}
                                            </Text>
                                            {isSubscriptionActive && (
                                                <Box $ml="auto">
                                                    <Badge $variant={ORDER_STATUS_LABELS[request.status]}>{ORDER_STATUS_LABELS[request.status]}</Badge>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box $d="flex" $alignItems="center" $mb="16">
                                            <Box>
                                                <Breadcrumb>
                                                    <BreadcrumbItem isFirst as={Link} to={REQUESTS}>
                                                        Requests
                                                    </BreadcrumbItem>
                                                    <BreadcrumbItem>Details</BreadcrumbItem>
                                                </Breadcrumb>
                                            </Box>
                                            <Box $mx="10" $h="20" $w="1" $bg="outline-gray" />
                                            <Box>
                                                <Text $textVariant="H6" $colorScheme="cta" $lineH="20">
                                                    #{request.id}
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box hide="desktop">
                                        <Box $d="flex" $mb="10" $flexWrap="nowrap" $px="8">
                                            <Box $d="inline-flex">
                                                <Button
                                                    $w="36"
                                                    $h="36"
                                                    mobileH="36"
                                                    type="default"
                                                    className="ant-btn ant-btn-default"
                                                    as={Link}
                                                    to={REQUESTS}
                                                    icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                                />
                                            </Box>
                                            <Box $pl="16" $flex="1" $minW="0">
                                                <EllipsisMultiple $textVariant="H4" $colorScheme="headline" line={2}>
                                                    {request.name}
                                                </EllipsisMultiple>
                                            </Box>
                                        </Box>
                                        <Box $d="flex" $alignItems="center" $mb={isSubscriptionActive ? '20' : '0'}>
                                            {isSubscriptionActive && (
                                                <Box $mr="10">
                                                    <Badge $variant={ORDER_STATUS_LABELS[request.status]}>{ORDER_STATUS_LABELS[request.status]}</Badge>
                                                </Box>
                                            )}
                                            <Box $pl={isSubscriptionActive ? '0' : '52'}>
                                                <Text $textVariant="H5" $colorScheme="cta">
                                                    #{request.id}
                                                </Text>
                                            </Box>
                                            {isSubscriptionActive && (
                                                <Box $ml="auto" $pr="6">
                                                    <DropdownRequestAction />
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    {isSubscriptionActive ? (
                                        <Box>
                                            <DetailContent activeFolderId={activeFolderId} />
                                        </Box>
                                    ) : (
                                        <SubscriptionInactive spaceTop={['47', '153']}>
                                            This request and its associated files have been deleted as you are no longer an active subscriber. To submit new
                                            requests, please subscribe to a plan first.
                                        </SubscriptionInactive>
                                    )}
                                </Box>
                            </PageContainer>
                        )}
                    </Basepage>
                </MessageContext.Provider>
            </DetailContext.Provider>
        </DocumentTitle>
    );
});

export default withResponsive(withLoggedUser(DetailRequest));

export function MySkeleton() {
    return (
        <PageContainer $maxW="1288" $px={['8', '16']}>
            <Box $mb="16">
                <Box $d="flex" $justifyContent="space-between">
                    <Box $flex="1" $mr="20">
                        <Skeleton $maxW="881" $w="100%" $h="44" $mb="12" />
                        <Skeleton $h="20" $w="201" />
                    </Box>
                    <Skeleton $w="104" $h="32" />
                </Box>
            </Box>
            <Box $d="flex" $flexDir="row" $mx="-15px" $flexWrap="wrap">
                <Box $px="15px" $w="100%" $maxW={['100%', 'calc(100% - 300px)']}>
                    <Box $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="10">
                        <Box $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="outline-gray" $px="20" $py="14" $d="flex" $alignItems="center">
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" />
                        </Box>
                        <Box $px="20" $pt="16" $pb="14">
                            <Box $d="flex" $mb="16">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                    <Skeleton $w="100%" $h="40" />
                                </Box>
                            </Box>
                            <Box $d="flex" $mb="22">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                    <Skeleton $w="100%" $h="40" $mb="10" />
                                    <Box $d="flex" $alignItems="center">
                                        <Skeleton $maxW="241" $w="100%" $h="60" $mr="14" />
                                        <Skeleton $maxW="241" $w="100%" $h="60" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box $d="flex" $alignItems="center" $mb="22">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                                        <Skeleton $maxW="303" $w="100%" $h="20" $mr="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box $d="flex" $mb="16">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                    <Skeleton $w="100%" $h="40" />
                                </Box>
                            </Box>
                            <Box $d="flex" $mb="16">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                    <Skeleton $w="100%" $h="40" />
                                </Box>
                            </Box>
                            <Box $d="flex" $mb="34">
                                <Skeleton $variant="avatar" $w="32" $h="32" $mr="16" />
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                        <Skeleton $w="74" $h="20" />
                                    </Box>
                                    <Skeleton $w="100%" $h="40" />
                                </Box>
                            </Box>
                            <Box $radii="10" $borderW="1" $borderStyle="solid" $borderColor="#BEC6D6" $px="10" $pt="16" $pb="10">
                                <Skeleton $w="155" $h="20" $mb="27" />
                                <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                                    <Box $d="flex" $alignItems="center">
                                        <Skeleton $w="20" $h="20" $mr="16" />
                                        <Skeleton $w="20" $h="20" $mr="16" />
                                        <Skeleton $w="20" $h="20" $mr="16" />
                                        <Skeleton $w="20" $h="20" $mr="16" />
                                        <Skeleton $w="20" $h="20" $mr="16" />
                                        <Skeleton $w="20" $h="20" />
                                    </Box>
                                    <Box $d="flex" $alignItems="center">
                                        <Skeleton $w="20" $h="20" $mr="24" />
                                        <Skeleton $w="20" $h="20" />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box hide="mobile" $px="15px" $w="100%" $maxW={['100%', '300px']}>
                    <Box $mb="14">
                        <Box
                            $px="20"
                            $pt="15"
                            $pb="14"
                            $borderW="1"
                            $borderStyle="solid"
                            $borderColor="outline-gray"
                            $borderB="0"
                            $borderBottomStyle="solid"
                            $borderBottomColor="outline-gray"
                            $radii="10px 10px 0 0"
                        >
                            <Skeleton $w="107" $h="20" />
                        </Box>
                        <Box $px={['14', '20']} $pt="14" $pb="16" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="0 0 10px 10px">
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="8" />
                                <Box $d="flex" $alignItems="center">
                                    <Skeleton $w="24" $h="24" $mr="10" />
                                    <Skeleton $w="58" $h="16" $mr="10" />
                                </Box>
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="120" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="94" $h="18" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="110" $h="16" />
                            </Box>
                            <Skeleton $w="100%" $h="34" $mb="10" />
                            <Skeleton $w="100%" $h="34" />
                        </Box>
                    </Box>
                    <Skeleton $w="100%" $h="170" />
                </Box>
            </Box>
        </PageContainer>
    );
}

function MySkeletonFiles() {
    return (
        <PageContainer $maxW="1288" $px={['8', '16']}>
            <Box $mb="16">
                <Box $d="flex" $justifyContent="space-between">
                    <Box $flex="1" $mr="20">
                        <Skeleton $maxW="881" $w="100%" $h="44" $mb="12" />
                        <Skeleton $h="20" $w="201" />
                    </Box>
                    <Skeleton $w="104" $h="32" />
                </Box>
            </Box>
            <Box $d="flex" $flexDir="row" $mx="-15px" $flexWrap="wrap">
                <Box $px="15px" $w="100%" $maxW={['100%', 'calc(100% - 300px)']}>
                    <Box $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="10">
                        <Box $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="outline-gray" $px="20" $py="14" $d="flex" $alignItems="center">
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" />
                        </Box>
                        <Box $px="20" $pt="16" $pb="14">
                            <Box $d="flex">
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="6">
                                        <Skeleton $w="92" $h="20" />
                                    </Box>
                                    <Box $d="flex" $gap="20px" $mt="22px" $mb="30px" $flexWrap="wrap">
                                        <Skeleton $w="200" $h="170" />
                                        <Skeleton $w="200" $h="170" />
                                        <Skeleton $w="200" $h="170" />
                                        <Skeleton $w="200" $h="170" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box $d="flex">
                                <Box $flex="1">
                                    <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                                        <Skeleton $w="54" $h="20" />
                                    </Box>
                                    <Box $d="flex" $gap="20px" $mt="22px" $mb="141px" $flexWrap="wrap">
                                        <Skeleton $w="270" $h="78" />
                                        <Skeleton $w="270" $h="78" />
                                        <Skeleton $w="270" $h="78" />
                                        <Skeleton $w="270" $h="78" />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box hide="mobile" $px="15px" $w="100%" $maxW={['100%', '300px']}>
                    <Box $mb="14">
                        <Box
                            $px="20"
                            $pt="15"
                            $pb="14"
                            $borderW="1"
                            $borderStyle="solid"
                            $borderColor="outline-gray"
                            $borderB="0"
                            $borderBottomStyle="solid"
                            $borderBottomColor="outline-gray"
                            $radii="10px 10px 0 0"
                        >
                            <Skeleton $w="107" $h="20" />
                        </Box>
                        <Box $px={['14', '20']} $pt="14" $pb="16" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="0 0 10px 10px">
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="8" />
                                <Box $d="flex" $alignItems="center">
                                    <Skeleton $w="24" $h="24" $mr="10" />
                                    <Skeleton $w="58" $h="16" $mr="10" />
                                </Box>
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="120" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="94" $h="18" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="110" $h="16" />
                            </Box>
                            <Skeleton $w="100%" $h="34" $mb="10" />
                            <Skeleton $w="100%" $h="34" />
                        </Box>
                    </Box>
                    <Skeleton $w="100%" $h="170" />
                </Box>
            </Box>
        </PageContainer>
    );
}

function MySkeletonBrief() {
    return (
        <PageContainer $maxW="1288" $px={['8', '16']}>
            <Box $mb="16">
                <Box $d="flex" $justifyContent="space-between">
                    <Box $flex="1" $mr="20">
                        <Skeleton $maxW="881" $w="100%" $h="44" $mb="12" />
                        <Skeleton $h="20" $w="201" />
                    </Box>
                    <Skeleton $w="104" $h="32" />
                </Box>
            </Box>
            <Box $d="flex" $flexDir="row" $mx="-15px" $flexWrap="wrap">
                <Box $px="15px" $w="100%" $maxW={['100%', 'calc(100% - 300px)']}>
                    <Box $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="10">
                        <Box $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="outline-gray" $px="20" $py="14" $d="flex" $alignItems="center">
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" $mr="26" />
                            <Skeleton $w="45" $h="20" />
                        </Box>
                        <Box $px="20" $pt="16" $pb="14">
                            <Box $d="flex">
                                <Box $flex="1">
                                    <Box>
                                        <Skeleton $w="140" $h="34" $mb="16px" />
                                        <Skeleton $w="70" $h="16" $mb="16px" />
                                        <Skeleton $w="100%" $h="16" $mb="4px" style={window.innerWidth < 500 ? { display: 'none' } : {}} />
                                        <Skeleton $w="366" $h="16" $mb="20px" style={window.innerWidth < 500 ? { display: 'none' } : {}} />
                                        <Box $d="flex" $gap="4px" $flexDir="column" $mb="26px">
                                            <Skeleton $w="209" $h="16" />
                                            <Skeleton $w="51" $h="16" />
                                            <Skeleton $w="91" $h="16" />
                                            <Skeleton $w="59" $h="16" />
                                            <Skeleton $w="81" $h="16" />
                                            <Skeleton $w="118" $h="16" />
                                            <Skeleton $w="65" $h="16" />
                                            <Skeleton $w="96" $h="16" />
                                            <Skeleton $w="135" $h="16" />
                                            <Skeleton $w="131" $h="16" />
                                            <Skeleton $w="115" $h="16" />
                                            <Skeleton $w="110" $h="16" />
                                        </Box>
                                        <Skeleton $w="83" $h="16" $mb="12px" />
                                        <Box $d="flex" $gap="20px" $mb="20px" $flexWrap="wrap">
                                            <Skeleton $w="270" $h="60" />
                                            <Skeleton $w="270" $h="60" />
                                            <Skeleton $w="270" $h="60" />
                                            <Skeleton $w="270" $h="60" />
                                            <Skeleton $w="270" $h="60" />
                                            <Skeleton $w="270" $h="60" />
                                        </Box>
                                        <Skeleton $w="83" $h="20" $mb="15px" />
                                        <Skeleton $w="110" $h="16" $mb="10px" />
                                        <Box $d="flex" $gap="4px" $flexDir="column" $mb="11px">
                                            <Skeleton $w="51" $h="16" />
                                            <Skeleton $w="91" $h="16" />
                                            <Skeleton $w="59" $h="16" />
                                            <Skeleton $w="81" $h="16" />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box hide="mobile" $px="15px" $w="100%" $maxW={['100%', '300px']}>
                    <Box $mb="14">
                        <Box
                            $px="20"
                            $pt="15"
                            $pb="14"
                            $borderW="1"
                            $borderStyle="solid"
                            $borderColor="outline-gray"
                            $borderB="0"
                            $borderBottomStyle="solid"
                            $borderBottomColor="outline-gray"
                            $radii="10px 10px 0 0"
                        >
                            <Skeleton $w="107" $h="20" />
                        </Box>
                        <Box $px={['14', '20']} $pt="14" $pb="16" $borderW="1" $borderStyle="solid" $borderColor="outline-gray" $radii="0 0 10px 10px">
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="8" />
                                <Box $d="flex" $alignItems="center">
                                    <Skeleton $w="24" $h="24" $mr="10" />
                                    <Skeleton $w="58" $h="16" $mr="10" />
                                </Box>
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="120" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="94" $h="18" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="150" $h="16" />
                            </Box>
                            <Box $mb="16">
                                <Skeleton $w="36" $h="16" $mb="6" />
                                <Skeleton $w="110" $h="16" />
                            </Box>
                            <Skeleton $w="100%" $h="34" $mb="10" />
                            <Skeleton $w="100%" $h="34" />
                        </Box>
                    </Box>
                    <Skeleton $w="100%" $h="170" />
                </Box>
            </Box>
        </PageContainer>
    );
}
