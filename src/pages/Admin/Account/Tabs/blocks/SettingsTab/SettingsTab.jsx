import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import DesignersForm from './DesignersForm';
import TeamForm from './TeamForm';

const SettingsTab = memo(props => {
    return (
        <Box $my={['20', '30']}>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="20">
                <Text $textVariant="H5" $colorScheme="primary">
                    Settings
                </Text>
            </Box>
            <TeamForm {...props} />
            <DesignersForm {...props} />
        </Box>
    );
});

export default SettingsTab;
