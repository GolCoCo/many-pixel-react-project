import React, { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import withLoggedUser from '@components/WithLoggedUser';
import { WEBPAGE_HOME } from '@constants/routes';
import { ASSET_LOGO_MP_BLUE, ASSET_LOGO_MP_BLUE_ALT } from '@constants/assets';

const OnboardingNav = memo(({ viewer, message, btnText, link, refetchViewer }) => {
    useEffect(() => {
        if (refetchViewer) {
            refetchViewer();
        }
    }, [refetchViewer]);

    return (
        !viewer.connected && (
            <Box $d="flex" $alignItems="center" $justifyContent={['space-between', 'flex-end']}>
                <Box hide="desktop" $w="120">
                    <a href={WEBPAGE_HOME}>
                        <img src={ASSET_LOGO_MP_BLUE} alt={ASSET_LOGO_MP_BLUE_ALT} />
                    </a>
                </Box>
                <Text hide="mobile" $textVariant="P4" $colorScheme="primary" $mr="24">
                    {message}
                </Text>
                <Box>
                    <Link to={link}>
                        <Button type="default">{btnText}</Button>
                    </Link>
                </Box>
            </Box>
        )
    );
});

export default withLoggedUser(OnboardingNav);
