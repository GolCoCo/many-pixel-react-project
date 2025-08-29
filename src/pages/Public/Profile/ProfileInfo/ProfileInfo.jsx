import React, { memo } from 'react';
import ProfileInfoForm from './ProfileInfoForm';
import ChangePasswordForm from './ChangePasswordForm';
import { Box } from '@components/Box';
import { Skeleton } from '@components/Skeleton';

const ProfileInfo = memo(({ user }) => {

    if (!user) {
        return <Box $mt="34">
            <Skeleton $w="184" $h="20" />
            <Skeleton $w="80" $h="80" $mt="20" $variant="avatar" avatarSize="80" />
            <Skeleton $w="116" $h="20" $mt="10" />
            <Box $d="flex" $gap="30px" $flexWrap="wrap" $mt="26px">
                {Array.from({ length: 5 }, (_, i) => (
                    <Box>
                        <Skeleton $w="116" $h="16" />
                        <Skeleton $w="380" $h="40" $mt="11" />
                    </Box>
                ))}
            </Box>
            <Skeleton $w="100" $h="40" $mt="32" />
            <Box $d="flex" $flexDir="column" $mt="30px" style={{borderTop:'1px solid #D5D6DD'}}>
                <Skeleton $w="158" $h="20" $mt="30" />
            </Box>
            <Box $d="flex" $gap="30px" $flexWrap="wrap" $mt="27px">
                {Array.from({ length: 3 }, (_, i) => (
                    <Box>
                        <Skeleton $w="116" $h="16" />
                        <Skeleton $w="380" $h="40" $mt="11" />
                    </Box>
                ))}
            </Box>
            <Skeleton $w="100" $h="40" $mt="30" />
        </Box>
    }

    return (
        <>
            <ProfileInfoForm user={user} />
            <hr />
            <ChangePasswordForm user={user} />
        </>
    );
});

export default ProfileInfo;
