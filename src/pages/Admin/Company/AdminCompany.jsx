import React, { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import IconAdd from '@components/Svg/IconAdd';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import MembersTab from './MembersTab';
import TeamsTab from './TeamsTab';

const AdminCompany = () => {
    const [isAddOpen, setAddOpen] = useState();
    const history = useHistory();
    const { section = 'members' } = useParams('/company/:section');

    const onChangePage = useCallback(
        sec => {
            setAddOpen(false);
            history.push(`/company/${sec}`);
        },
        [history]
    );

    const handleClickAdd = () => {
        setAddOpen(true);
    };

    const handleClose = () => {
        setAddOpen(false);
    };

    const isMembersActive = section === 'members';

    return (
        <DocumentTitle title="Company | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1232">
                    <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="30">
                        <Text hide="mobile" $textVariant="H3">
                            Company
                        </Text>
                        <Text hide="desktop" $textVariant="H4">
                            Company
                        </Text>
                        <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />} onClick={handleClickAdd}>
                            ADD {isMembersActive ? 'MEMBER' : 'TEAM'}
                        </Button>
                    </Box>
                    <Box $d="flex" $alignItems="center" $borderW="0" $borderB="1" $borderStyle="solid" $borderColor="element-stroke">
                        <Box $d="flex" $mr="27" $alignItems="flex-start" $cursor="pointer" onClick={() => onChangePage('members')} $mb="-1">
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
                        <Box $d="flex" $alignItems="flex-start" $cursor="pointer" onClick={() => onChangePage('teams')} $mb="-1">
                            <Text $textVariant="H6" $colorScheme={!isMembersActive ? 'cta' : 'primary'} $mr="6" $pb="11" $pos="relative" $overflow="hidden">
                                Teams
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
                    <Box $py="30">
                        {isMembersActive ? (
                            <MembersTab isAddVisible={isAddOpen && section === 'members'} onAddClose={handleClose} />
                        ) : (
                            <TeamsTab isAddVisible={isAddOpen && section === 'teams'} onAddClose={handleClose} />
                        )}
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default AdminCompany;
