import React, { useCallback, useState, memo } from 'react';
import { useMutation } from '@apollo/client';
import { COMPANY_ROLE_ADMIN } from '@constants/account';
import { capitalize } from '@constants/utils';
import { Box } from '@components/Box';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { PopupDelete } from '@components/Popup';
import message from '@components/Message';
import { Drawer } from '@components/Drawer';
import { withResponsive } from '@components/ResponsiveProvider';
import { DELETE_USER_FROM_TEAM } from '@graphql/mutations/user';
import changeRoleIcon from '@public/assets/icons/change_role.svg';
import removeUserIcon from '@public/assets/icons/remove_user.svg';
import Avatar from '@components/Avatar';
import FormNewOwner from './FormNewOwner';

export const CardTeam = withResponsive(
    memo(
        ({
            id,
            firstname,
            lastname,
            companyRole,
            email,
            refetchMembers,
            users,
            canUpdateDelete,
            adminCount,
            viewerEmail,
            picture,
            windowWidth,
            requestsOwned,
            orders,
            fontSize = 20,
        }) => {
            const [hovered, setHovered] = useState(false);
            const [showDelete, setShowDelete] = useState(false);
            const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
            const [deleteUser] = useMutation(DELETE_USER_FROM_TEAM);

            const handleMouseEnter = () => setHovered(true);
            const handleMouseLeave = () => setHovered(false);

            const handleDelete = useCallback(async () => {
                message.destroy();
                message.loading('Deleting user...', 50000);

                try {
                    await deleteUser({ variables: { email } });

                    message.destroy();
                    message.success(
                        <>
                            <Text $d="inline-block" $fontWeight="400">
                                {firstname} {lastname}
                            </Text>{' '}
                            has been deleted from your team
                        </>
                    );

                    if (viewerEmail === email) {
                        window.location = '/signin';
                    } else {
                        await refetchMembers();
                    }

                    return true;
                } catch (err) {
                    message.destroy();
                    message.error('Error on removing user');
                    console.error(err);
                    return false;
                }
            }, [deleteUser, firstname, lastname, email, refetchMembers, viewerEmail]);

            const isOnlyAdmin = companyRole === COMPANY_ROLE_ADMIN && adminCount === 1;

            const handleShowOptions = () => {
                if (windowWidth <= 768 && !showDelete) {
                    setShowOptionsDrawer(true);
                }
            };

            const handleCloseOptions = () => {
                setShowOptionsDrawer(false);
            };

            const requestIds = requestsOwned?.map(item => item.id) ?? [];
            const customerRequestIds = orders?.map(item => item.id) ?? [];
            const name = `${firstname} ${lastname}`;

            return (
                <>
                    <Drawer
                        title={
                            <Text $textVariant="H5" $colorScheme="primary">
                                Select an option
                            </Text>
                        }
                        closable={false}
                        placement="bottom"
                        onClose={handleCloseOptions}
                        open={showOptionsDrawer}
                        height="auto"
                        paddingHeader="16px 16px 11px 16px"
                        noHeaderBorder
                    >
                        <Box $mb="9">
                            <Box $px="16" $py="11" $d="flex" $alignItems="center">
                                <Box as="img" src={changeRoleIcon} alt="Change Role" $w="20" $h="20" $mr="10.76" />
                                <Text
                                    $textVariant="P4"
                                    $colorScheme="primary"
                                    onClick={() => {
                                        setShowOptionsDrawer(false);
                                    }}
                                >
                                    Change role
                                </Text>
                            </Box>

                            {!isOnlyAdmin && (
                                <Box $px="16" $py="11" $d="flex" $alignItems="center">
                                    <Box as="img" src={removeUserIcon} alt="Change Role" $w="20" $h="20" $mr="10.76" />
                                    <Text
                                        $textVariant="P4"
                                        $colorScheme="primary"
                                        onClick={() => {
                                            setShowDelete(true);
                                            setShowOptionsDrawer(false);
                                        }}
                                    >
                                        Remove
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Drawer>
                    <Box $w={['100%', '260']} $mb={['16', '20']} onClick={handleShowOptions}>
                        <Card $pos="relative" $hoverable $h="170" $centered onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave} $py="14">
                            <Box $mb="10">
                                <Avatar src={picture?.url} name={name} size={60} $fontSize={20} />
                            </Box>
                            <Box $textAlign="center">
                                <Text $textVariant="Badge" $colorScheme="headline">
                                    {name}
                                </Text>
                                <Text hide="desktop" $textVariant="P5" $colorScheme="secondary">
                                    {companyRole === 'MEMBER' ? 'Regular User' : capitalize(companyRole || '', true)}
                                </Text>
                                <Text
                                    hide="mobile"
                                    $h={hovered && canUpdateDelete ? '0' : '18px'}
                                    $overflow="hidden"
                                    $trans="height 0.3s ease"
                                    $textVariant="P5"
                                    $colorScheme="secondary"
                                >
                                    {companyRole === 'MEMBER' ? 'Regular User' : capitalize(companyRole || '', true)}
                                </Text>
                                <Box
                                    hide="mobile"
                                    $h={hovered && canUpdateDelete ? '34px' : '0'}
                                    $overflow="hidden"
                                    $trans="height 0.3s ease"
                                    $mt="10"
                                    $hasSpace
                                    space="13"
                                >
                                    {!isOnlyAdmin && (
                                        <Box>
                                            <Button $w="86" $h="34" $textVariant="SmallTitle" type="danger" onClick={() => setShowDelete(true)} $fontSize="12">
                                                Remove
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Card>
                        <PopupDelete
                            $variant="delete"
                            open={showDelete}
                            title={
                                <Box $textAlign={requestIds.length ? 'left' : 'center'} $mt={requestIds.length ? '-10' : '0'} $mb={requestIds.length ? '4' : '0'}>
                                    Are you sure you want to remove this member?
                                </Box>
                            }
                            onOk={handleDelete}
                            onCancel={() => setShowDelete(false)}
                            okText="REMOVE"
                            footer={requestIds.length ? null : undefined}
                            width={requestIds.length ? 500 : 436}
                        >
                            <Box>
                                {requestIds.length ? (
                                    <>
                                        <Text $textVariant="P4" $colorScheme="secondary" $textAlign="left">
                                            This member is the owner of some of your requests. Please choose a new owner for these requests.
                                        </Text>
                                        <FormNewOwner
                                            requestIds={requestIds}
                                            customerRequestIds={customerRequestIds}
                                            deleteUser={handleDelete}
                                            idToDelete={id}
                                            users={users}
                                            onClose={() => setShowDelete(false)}
                                        />
                                    </>
                                ) : (
                                    <Text $textVariant="P4" $colorScheme="secondary">
                                        This action cannot be undone
                                    </Text>
                                )}
                            </Box>
                        </PopupDelete>
                    </Box>
                </>
            );
        }
    )
);
