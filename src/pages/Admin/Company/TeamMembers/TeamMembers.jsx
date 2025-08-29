import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Box } from '@components/Box';
import { Link } from '@components/Link';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import IconAdd from '@components/Svg/IconAdd';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import { MANAGE_COMPANY_TEAM, MANAGE_TEAM, REQUESTS } from '@constants/routes';
import { USER_TYPE_OWNER, USER_TYPE_MANAGER } from '@constants/account';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { GET_TEAM } from '@graphql/queries/team';
import IconEdit from '@components/Svg/IconEdit';
import { Skeleton } from '@components/Skeleton';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import withLoggedUser from '@components/WithLoggedUser';
import { getValueFromQueryString, updateURLWithQueryString } from '@utils/queryStringHelpers';
import MembersTab from './MembersTab';
import AccountsTab from './AccountsTab';

const TeamMembers = ({ viewer }) => {
    const routeMatch = useRouteMatch(MANAGE_TEAM);
    const location = useLocation();
    const history = useHistory();
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [tabKey, setTabKey] = useState(getValueFromQueryString(location, 'tab', String, 'members'));
    const { data, loading } = useQuery(GET_TEAM, {
        variables: {
            id: routeMatch.params.id,
        },
    });

    const team = useMemo(() => data?.Team || {}, [data]);

    useEffect(() => {
        setIsShowAdd(false);
        setIsShowEdit(false);
        const newTab = getValueFromQueryString(location, 'tab', String, 'members');
        setTabKey(newTab);
    }, [location]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onChangeTab = useCallback(
        newTab => {
            if (newTab !== tabKey) {
                const newUrl = updateURLWithQueryString(location, { tab: newTab });
                history.push(newUrl);
            }
        },
        [history, location, tabKey]
    );

    const handleClickAdd = () => {
        setIsShowAdd(true);
    };

    const handleCloseAdd = () => {
        setIsShowAdd(false);
    };

    const handleClickEdit = () => {
        setIsShowEdit(true);
    };

    const handleCloseEdit = () => {
        setIsShowEdit(false);
    };

    const isMembersActive = tabKey === 'members';

    const isManagerOrOwner = viewer?.role === USER_TYPE_MANAGER || viewer?.role === USER_TYPE_OWNER;

    return (
        <DocumentTitle title="Team Members | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1288" $d="flex" $flexDir="row">
                    <Box $pt="4">
                        {loading ? (
                            <Skeleton $w="36" $h="36" mobileH="36" />
                        ) : (
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                as={Link}
                                to={isManagerOrOwner ? MANAGE_COMPANY_TEAM : REQUESTS}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        )}
                    </Box>
                    <Box $pl="20" $flex="1" $h="100%">
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb={['30', '12']}>
                            <Box $d="flex" $alignItems="center">
                                {loading ? (
                                    <Skeleton $h="34" $w="40" />
                                ) : (
                                    <>
                                        <Text hide="mobile" $textVariant="H3">
                                            {team.name}
                                        </Text>
                                        <Text hide="desktop" $textVariant="H4">
                                            {team.name}
                                        </Text>
                                    </>
                                )}
                            </Box>
                            {isManagerOrOwner && (
                                <Box $d="flex" $alignItems="center">
                                    <Button type="default" icon={<IconEdit style={{ fontSize: 20 }} />} $mr="20" onClick={handleClickEdit}>
                                        Edit
                                    </Button>
                                    <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />} onClick={handleClickAdd}>
                                        ADD TO TEAM
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        <Box $mb="30">
                            {loading ? (
                                <Skeleton $w="80" $h="34" />
                            ) : (
                                <Breadcrumb>
                                    {isManagerOrOwner ? (
                                        <BreadcrumbItem isFirst as={Link} to="/company">
                                            Company
                                        </BreadcrumbItem>
                                    ) : (
                                        <BreadcrumbItem isFirst as={Link} to="/requests">
                                            Teams
                                        </BreadcrumbItem>
                                    )}
                                    {isManagerOrOwner ? (
                                        <BreadcrumbItem as={Link} to={MANAGE_COMPANY_TEAM}>
                                            Teams
                                        </BreadcrumbItem>
                                    ) : null}
                                    <BreadcrumbItem>{team.name}</BreadcrumbItem>
                                </Breadcrumb>
                            )}
                        </Box>
                        <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                            <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => onChangeTab('members')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={isMembersActive ? 'cta' : 'primary'} $mr="6" $pb="11" $pos="relative" $overflow="hidden">
                                    Members
                                    <Box
                                        $h="3"
                                        $w="64.172"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={isMembersActive ? '0' : '64.172'}
                                    />
                                </Text>
                            </Box>
                            <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => onChangeTab('accounts')} $mb="-1">
                                <Text $textVariant="H6" $colorScheme={!isMembersActive ? 'cta' : 'primary'} $mr="6" $pb="11" $pos="relative" $overflow="hidden">
                                    Accounts
                                    <Box
                                        $h="3"
                                        $w="63.109"
                                        $bg="cta"
                                        $pos="absolute"
                                        $bottom="0"
                                        $trans="left 250ms ease-in-out"
                                        $left={!isMembersActive ? '0' : '-63.109'}
                                    />
                                </Text>
                            </Box>
                        </Box>
                        <Box>
                            {isMembersActive ? (
                                <MembersTab
                                    team={team}
                                    isAddVisible={isShowAdd}
                                    isEditVisible={isShowEdit}
                                    onAddClose={handleCloseAdd}
                                    onEditClose={handleCloseEdit}
                                />
                            ) : (
                                <AccountsTab
                                    team={team}
                                    isAddVisible={isShowAdd}
                                    isEditVisible={isShowEdit}
                                    onAddClose={handleCloseAdd}
                                    onEditClose={handleCloseEdit}
                                />
                            )}
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(TeamMembers);
