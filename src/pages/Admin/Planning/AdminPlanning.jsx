import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import UnassignedAccounts from './UnassignedAccounts';
import Teams from './Teams';

const AdminPlanning = () => {
    return (
        <DocumentTitle title="Planning | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1232">
                    <Box $mb="30">
                        <Text hide="mobile" $textVariant="H3">
                            Planning
                        </Text>
                        <Text hide="desktop" $textVariant="H4">
                            Planning
                        </Text>
                    </Box>
                    <Box>
                        <UnassignedAccounts />
                        <Box as="hr" $mb="20" />
                        <Teams />
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default AdminPlanning;
