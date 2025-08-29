import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'antd';
import { Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Link, NavLink } from '@components/Link';
import withLoggedUser from '@components/WithLoggedUser';
import { NB_NOTIFICATIONS_NOT_READ } from '@graphql/queries/notification';
import {
    WEBPAGE_HELP,
    WEBPAGE_NOTION,
    REQUESTS,
    BRANDS,
    TEAM,
    LOG_OUT,
    PROFILE,
    COMPANY,
    BILLING,
    EDIT_PLAN,
    NOTIFICATIONS,
    PLANNING,
    ADMIN_COMPANY,
    CUSTOMERS,
    SETTINGS,
} from '@constants/routes';
import { ASSET_LOGO_SMALL_MP, ASSET_LOGO_SMALL_MP_ALT, ASSET_QUESTION, ASSET_QUESTION_ALT, ASSET_NOTIFICATION, ASSET_NOTIFICATION_ALT } from '@constants/assets';
import { COMPANY_ROLE_ADMIN, USER_TYPE_WORKER, USER_TYPE_CUSTOMER } from '@constants/account';
import IconLogOut from '@components/Svg/IconLogOut';
import IconBilling from '@components/Svg/IconBilling';
import IconProfile from '@components/Svg/IconProfile';
import IconCompany from '@components/Svg/IconCompany';
import IconExternalLink from '@components/Svg/IconExternalLink';
import IconBurger from '@components/Svg/IconBurger';
import IconSearch from '@components/Svg/IconSearch';
import profileDropdownArrow from '@public/assets/icons/profile-dropdown-arrow.svg';
import { withResponsive } from '@components/ResponsiveProvider';
import { NavbarLink, NavSidebar } from '../style.js';
import NavSearch from '../NavSearch';
import NotificationsDrawer from '../NotificationsDrawer';
import { Image } from '@components/Image';
import { SUBSCRIBE_NB_NOTIFICATIONS_NOT_READ } from '@graphql/subscriptions/notification.js';
import { useCustomSubscription } from '@utils/useCustomSubscription.js';
import IconFilterWhite from '@components/Svg/IconFilterWhite.jsx';

const Nav = ({ location, viewer, windowWidth, showFilter, handleToggleFilter, handleSetFilter, hasActiveFilters }) => {
    const [showBurger, setShowBurger] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
    const navRef = useRef(null);
    const {
        loading,
        data = {},
        refetch,
    } = useQuery(NB_NOTIFICATIONS_NOT_READ, {
        variables: { userId: viewer.id },
        fetchPolicy: 'network-only',
    });

    useCustomSubscription({ query: SUBSCRIBE_NB_NOTIFICATIONS_NOT_READ, variables: { viewerId: viewer.id }, refetch });

    useEffect(() => {
        const handleOutsideClick = e => {
            if (!navRef.current.contains(e.target) && !e.target.closest('[class*="Filters__DropdownContainer"]')) {
                setShowBurger(false);
                setShowSearch(false);
                handleSetFilter(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleResponsiveMenu = () => {
        setShowBurger(old => !old);
    };

    const handleShowSearch = () => {
        setShowSearch(old => !old);
    };

    const handleNotificationsVisible = () => {
        setShowNotificationsDrawer(!showNotificationsDrawer);
    };

    const allNotificationCount = data._allNotificationsMeta?.count ?? 0;

    const menu = (
        <DropdownMenu>
            <DropdownMenuItem key="1" $p="0">
                <Link to={PROFILE}>
                    <DropdownMenuItemContent icon={<IconProfile />}>Profile</DropdownMenuItemContent>
                </Link>
            </DropdownMenuItem>
            {viewer?.role === USER_TYPE_CUSTOMER && (
                <DropdownMenuItem key="2" $p="0">
                    <Link to={COMPANY}>
                        <DropdownMenuItemContent icon={<IconCompany />}>Company</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )}
            {viewer?.role === USER_TYPE_CUSTOMER && viewer?.companyRole === COMPANY_ROLE_ADMIN && (
                <DropdownMenuItem key="3" $p="0">
                    <Link to={BILLING}>
                        <DropdownMenuItemContent icon={<IconBilling />}>Billing</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )}
            {/* {viewer?.role === USER_TYPE_CUSTOMER && (
                <DropdownMenuItem key="4" $p="0">
                    <Link to={REFERRAL}>
                        <DropdownMenuItemContent icon={<IconGiveGet />}>Give & Get $100</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )} */}
            <DropdownMenu.Divider />
            <DropdownMenuItem key="5" $p="0" $variant="danger">
                <Link to={LOG_OUT}>
                    <DropdownMenuItemContent icon={<IconLogOut />}>Logout</DropdownMenuItemContent>
                </Link>
            </DropdownMenuItem>
        </DropdownMenu>
    );

    const menuMobile = (
        <DropdownMenu>
            <DropdownMenuItem key="0" $p="0">
                <Box $py="9" $px="16" $w="100%">
                    <Box $d="flex" $alignItems="center" $w="100%">
                        <Image src={viewer?.picture?.url} name={`${viewer.firstname} ${viewer.lastname}`} size={32} $fontSize={14} isRounded />
                        <Text $textVariant="H6" $colorScheme="primary" $pl="8">
                            {viewer.firstname} {viewer.lastname}
                        </Text>
                    </Box>
                </Box>
            </DropdownMenuItem>
            <DropdownMenu.Divider />
            <DropdownMenuItem key="1" $p="0">
                <Link to={PROFILE}>
                    <DropdownMenuItemContent icon={<IconProfile />}>Profile</DropdownMenuItemContent>
                </Link>
            </DropdownMenuItem>
            {viewer?.role === USER_TYPE_CUSTOMER && (
                <DropdownMenuItem key="2" $p="0">
                    <Link to={COMPANY}>
                        <DropdownMenuItemContent icon={<IconCompany />}>Company</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )}
            {viewer?.role === USER_TYPE_CUSTOMER && viewer?.companyRole === COMPANY_ROLE_ADMIN && (
                <DropdownMenuItem key="3" $p="0">
                    <Link to={BILLING}>
                        <DropdownMenuItemContent icon={<IconBilling />}>Billing</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )}
            {/* {viewer?.role === USER_TYPE_CUSTOMER && (
                <DropdownMenuItem key="4" $p="0">
                    <Link to={REFERRAL}>
                        <DropdownMenuItemContent icon={<IconGiveGet />}>Give & Get $100</DropdownMenuItemContent>
                    </Link>
                </DropdownMenuItem>
            )} */}
            <DropdownMenu.Divider />
            <DropdownMenuItem key="5" $p="0" $variant="danger">
                <Link to={LOG_OUT}>
                    <DropdownMenuItemContent icon={<IconLogOut />}>Logout</DropdownMenuItemContent>
                </Link>
            </DropdownMenuItem>
        </DropdownMenu>
    );

    const navbar = (
        <>
            <NavbarLink as={NavLink} to={REQUESTS}>
                <span>REQUESTS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={BRANDS}>
                <span>BRANDS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={TEAM}>
                <span>TEAM</span>
            </NavbarLink>
        </>
    );

    const navbarMobile = (
        <>
            <NavbarLink as={NavLink} to={REQUESTS}>
                <span>REQUESTS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={BRANDS}>
                <span>BRANDS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={TEAM}>
                <span>TEAM</span>
            </NavbarLink>
            <NavbarLink as="a" href={WEBPAGE_HELP}>
                <span>HELP CENTER</span>
            </NavbarLink>
        </>
    );

    const adminNavbar = (
        <>
            <NavbarLink as={NavLink} to={REQUESTS}>
                <span>REQUESTS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={PLANNING}>
                <span>PLANNING</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={ADMIN_COMPANY}>
                <span>COMPANY</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={CUSTOMERS}>
                <span>CUSTOMERS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={SETTINGS}>
                <span>SETTINGS</span>
            </NavbarLink>
            <NavbarLink as="a" target="_blank" href={WEBPAGE_NOTION} rel="noopener noreferrer">
                <Box $d="flex" $alignItems="center">
                    <Box $mr="10">NOTION</Box>
                    <Box $pt="4">
                        <IconExternalLink />
                    </Box>
                </Box>
            </NavbarLink>
        </>
    );

    const workerNavbar = (
        <>
            <NavbarLink as={NavLink} to={REQUESTS}>
                <span>REQUESTS</span>
            </NavbarLink>
            <NavbarLink as={NavLink} to={PLANNING}>
                <span>PLANNING</span>
            </NavbarLink>
            <NavbarLink as="a" target="_blank" href={WEBPAGE_NOTION}>
                <Box $d="flex" $alignItems="center">
                    <Box $mr="10">NOTION</Box>
                    <Box>
                        <IconExternalLink />
                    </Box>
                </Box>
            </NavbarLink>
        </>
    );

    return (
        <>
            <NotificationsDrawer handleNotificationsVisible={handleNotificationsVisible} showNotificationsDrawer={showNotificationsDrawer} userId={viewer.id} />
            <Box ref={navRef} $h="60" $bg="primary" $pos="fixed" $zIndex="999" $w="100%" $top="0" $left="0">
                <NavSidebar $isOpen={showBurger}>
                    <Box $px="16" $h="60" $d="flex" $alignItems="center" $justifyContent="space-between">
                        <Box $w="110" as={Link} to={REQUESTS}>
                            <img src={ASSET_LOGO_SMALL_MP} alt={ASSET_LOGO_SMALL_MP_ALT} />
                        </Box>
                        <Box $d="inline-flex" $colorScheme="white" $alignItems="center" $transform="scaleX(-1)" onClick={handleResponsiveMenu}>
                            <IconBurger />
                        </Box>
                    </Box>
                    <Box $flex={1}>
                        {viewer?.role === USER_TYPE_CUSTOMER && (
                            <Box $d="flex" $flexDir="column">
                                {windowWidth > 992 ? navbar : navbarMobile}
                            </Box>
                        )}
                        {viewer?.role !== USER_TYPE_CUSTOMER && viewer?.role !== USER_TYPE_WORKER && windowWidth <= 1200 && (
                            <Box $d="flex" $flexDir="column">
                                {adminNavbar}
                            </Box>
                        )}
                        {viewer?.role === USER_TYPE_WORKER && (
                            <Box $d="flex" $flexDir="column">
                                {workerNavbar}
                            </Box>
                        )}
                    </Box>
                    {viewer?.role === USER_TYPE_CUSTOMER && viewer?.companyRole === COMPANY_ROLE_ADMIN && (
                        <Box $px="16" $pb="40">
                            <Box as={Link} $textVariant="white" $colorScheme="white" to={EDIT_PLAN}>
                                <Button $fontSize="12" type="primary" block $h="34" $radii="8">
                                    UPGRADE
                                </Button>
                            </Box>
                        </Box>
                    )}
                </NavSidebar>
                {showSearch && <NavSearch handleClose={handleShowSearch} />}

                <Box
                    $mx={{ xs: '16', sm: '16', md: '16', lg: '40', xl: '40', xxl: '40' }}
                    $d="flex"
                    $justifyContent="space-between"
                    $alignItems="center"
                    $h="100%"
                >
                    <Box $d="flex" $h="100%" $alignItems="center">
                        <Box
                            $mr="12"
                            $d={{
                                xs: 'inline-flex',
                                sm: 'inline-flex',
                                md: 'inline-flex',
                                lg: viewer?.role !== USER_TYPE_CUSTOMER && viewer?.role !== USER_TYPE_WORKER ? 'inline-flex' : 'none',
                                xl: 'none',
                                xxl: 'none',
                            }}
                            $colorScheme="white"
                            $alignItems="center"
                            onClick={handleResponsiveMenu}
                        >
                            <IconBurger />
                        </Box>
                        <Box $d="flex" $hasSpace space={['12', '50']} $h="100%">
                            <Box as={Link} to={REQUESTS} $d="inline-flex" $w="120" $h="100%" $alignItems="center">
                                <img src={ASSET_LOGO_SMALL_MP} alt={ASSET_LOGO_SMALL_MP_ALT} />
                            </Box>
                            <Box
                                $d={{
                                    xs: 'none',
                                    sm: 'none',
                                    md: 'none',
                                    lg: viewer?.role !== USER_TYPE_CUSTOMER && viewer?.role !== USER_TYPE_WORKER ? 'none' : 'inline-flex',
                                    xl: 'inline-flex',
                                    xxl: 'inline-flex',
                                }}
                                $hasSpace
                                space="50"
                                $h="100%"
                                $alignItems="center"
                            >
                                {viewer?.role === USER_TYPE_CUSTOMER && navbar}
                                {viewer?.role !== USER_TYPE_CUSTOMER && viewer?.role !== USER_TYPE_WORKER && adminNavbar}
                                {viewer?.role === USER_TYPE_WORKER && workerNavbar}
                            </Box>
                        </Box>
                    </Box>
                    <Box $d="flex" $hasSpace space={['16', '24']} $alignItems="center">
                        {viewer?.role === USER_TYPE_CUSTOMER && viewer?.companyRole === COMPANY_ROLE_ADMIN && (
                            <Box
                                as={Link}
                                $textVariant="white"
                                $colorScheme="white"
                                $d={{ xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block', xxl: 'block' }}
                                to={EDIT_PLAN}
                            >
                                <Button $fontSize="12" $h="34" type="bordered" $radii="8">
                                    UPGRADE
                                </Button>
                            </Box>
                        )}
                        {viewer?.role === USER_TYPE_CUSTOMER && (
                            <Box
                                as={Dropdown}
                                $d={{ xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block', xxl: 'block' }}
                                $cursor="pointer"
                                trigger={['click']}
                                overlay={
                                    <DropdownMenu>
                                        <DropdownMenuItem $p="0">
                                            <Text as="a" href={WEBPAGE_HELP} target="_blank">
                                                <Text as="span" $mr="10">
                                                    Help Center
                                                </Text>{' '}
                                                <IconExternalLink />
                                            </Text>
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                }
                            >
                                <img src={ASSET_QUESTION} alt={ASSET_QUESTION_ALT} />
                            </Box>
                        )}
                        <Route
                            path={REQUESTS}
                            exact
                            render={() => (
                                <Box
                                    $d={{
                                        xs: 'inline-flex',
                                        sm: 'inline-flex',
                                        md: 'inline-flex',
                                        lg: 'none',
                                        xl: 'none',
                                        xxl: 'none',
                                    }}
                                    $colorScheme="white"
                                    $h="100%"
                                    onClick={handleShowSearch}
                                >
                                    <IconSearch />
                                </Box>
                            )}
                        />
                        <Route
                            path={REQUESTS}
                            exact
                            render={() => (
                                <Box
                                    $d={{
                                        xs: 'inline-flex',
                                        sm: 'inline-flex',
                                        md: 'inline-flex',
                                        lg: 'none',
                                        xl: 'none',
                                        xxl: 'none',
                                    }}
                                    $pos="relative"
                                    $colorScheme="white"
                                    $h="100%"
                                    onClick={() => handleSetFilter(true)}
                                    color="white"
                                >
                                    <IconFilterWhite />
                                    {hasActiveFilters && (
                                        <Box
                                            style={{ borderRadius: '100%' }}
                                            $pos="absolute"
                                            $bg="other-pink"
                                            $minW="12"
                                            $minH="12"
                                            $textAlign="center"
                                            $textVariant="SmallNotification"
                                            $right="0"
                                            $top="-3"
                                            $lineH="20"
                                            $px="4"
                                            $py="2"
                                        />
                                    )}
                                </Box>
                            )}
                        />
                        <Route
                            path="/"
                            exact
                            render={() => (
                                <Box
                                    $d={{
                                        xs: 'inline-flex',
                                        sm: 'inline-flex',
                                        md: 'inline-flex',
                                        lg: 'none',
                                        xl: 'none',
                                        xxl: 'none',
                                    }}
                                    $colorScheme="white"
                                    $h="100%"
                                    onClick={handleShowSearch}
                                >
                                    <IconSearch />
                                </Box>
                            )}
                        />
                        <Box
                            $textVariant="H6"
                            $colorScheme="white"
                            $cursor="pointer"
                            onClick={handleNotificationsVisible}
                            $d={{ xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block', xxl: 'block' }}
                            $pos="relative"
                        >
                            <img src={ASSET_NOTIFICATION} alt={ASSET_NOTIFICATION_ALT} />
                            {!loading && allNotificationCount > 0 && (
                                <Box
                                    $pos="absolute"
                                    $bg="other-pink"
                                    $colorScheme="white"
                                    $radii="100%"
                                    $minW="20"
                                    $minH="20"
                                    $textAlign="center"
                                    $textVariant="SmallNotification"
                                    $right="-7"
                                    $top="-5"
                                    $lineH="20"
                                    $px="4"
                                    $py="2"
                                >
                                    {allNotificationCount > 99 ? 99 : allNotificationCount}
                                </Box>
                            )}
                        </Box>
                        <Box
                            as={Link}
                            $textVariant="H6"
                            $colorScheme="white"
                            $cursor="pointer"
                            to={NOTIFICATIONS}
                            $d={{ xs: 'block', sm: 'block', md: 'block', lg: 'none', xl: 'none', xxl: 'none' }}
                            $pos="relative"
                        >
                            <img src={ASSET_NOTIFICATION} alt={ASSET_NOTIFICATION_ALT} />
                            {!loading && allNotificationCount > 0 && (
                                <Box
                                    $pos="absolute"
                                    $bg="other-pink"
                                    $colorScheme="white"
                                    $radii="100%"
                                    $minW="20"
                                    $minH="20"
                                    $textAlign="center"
                                    $textVariant="SmallNotification"
                                    $right="-7"
                                    $top="-5"
                                    $lineH="20"
                                    $px="4"
                                    $py="2"
                                >
                                    {allNotificationCount > 99 ? 99 : allNotificationCount}
                                </Box>
                            )}
                        </Box>
                        <Dropdown overlay={windowWidth > 992 ? menu : menuMobile} placement="bottom" trigger={['click']}>
                            <Box $hasSpace space="8" $cursor="pointer" $spaceCenterChildren>
                                <Image src={viewer?.picture?.url} name={`${viewer.firstname} ${viewer.lastname}`} size={32} $fontSize={14} isRounded />
                                <Box $d={{ xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block', xxl: 'block' }}>
                                    <Box $d="flex" $alignItems="center">
                                        <Text $textVariant="H6" $colorScheme="white" $mr="12">
                                            {viewer.firstname} {viewer.lastname}
                                        </Text>
                                        <Box>
                                            <img src={profileDropdownArrow} alt="Profile Dropdown" />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Dropdown>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default withResponsive(withLoggedUser(Nav));
