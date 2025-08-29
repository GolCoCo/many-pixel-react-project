import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Badge } from '@components/Badge';
import { Popup } from '@components/Popup';
import withLoggedUser from '@components/WithLoggedUser';
import IconAdd from '@components/Svg/IconAdd';
import { Skeleton } from '@components/Skeleton';
import DocumentTitle from '@components/DocumentTitle';
import { ALL_USERS } from '@graphql/queries/user';
import { USER_TYPE_OWNER, COMPANY_ROLE_ADMIN } from '@constants/account';
import { CardTeam } from './blocks/CardTeam';
import FormTeam from './blocks/FormTeam';

const Team = ({ viewer }) => {
    const [showInvite, setShowInvite] = useState(false);
    const companyId = viewer.company?.id;
    const { role, companyRole, email: viewerEmail } = viewer;
    const { loading, data, refetch } = useQuery(ALL_USERS, {
        variables: {
            where: {
                companyId,
            },
        },
        fetchPolicy: 'network-only',
    });
    const canUpdateDelete = role === USER_TYPE_OWNER || companyRole === COMPANY_ROLE_ADMIN;
    const team = data?.allUsers || [];
    const adminCount = team.filter(({ companyRole }) => companyRole === COMPANY_ROLE_ADMIN).length;

    return (
        <DocumentTitle title="Team | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1234">
                    <Box $d="flex" $justifyContent="space-between" $alignItems="center">
                        <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                            Team
                        </Text>
                        <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                            Team
                        </Text>
                        {loading ? (
                            <Skeleton $w="225" $h="40" />
                        ) : (
                            <Button className={``} type="primary" icon={<IconAdd style={{ fontSize: 20 }} />} onClick={() => setShowInvite(true)}>
                                INVITE TEAM MEMBER
                            </Button>
                        )}
                    </Box>
                    <Box $mt="10" hide="mobile">
                        <Text $textVariant="P4" $colorScheme="secondary">
                            Invite your collegues and collaborate together on your requests.
                            <br />
                            All members can submit requests.
                        </Text>
                    </Box>
                    <Box $mt="40">
                        {loading ? (
                            <Skeleton $w="102" $h="20" />
                        ) : (
                            <>
                                <Text as="span" $textVariant="H6" $colorScheme="primary" $pr="6">
                                    Members
                                </Text>
                                <Badge $variant="Primary" $isEllipse>
                                    <Text $textVariant="SmallTitle">{team?.length || 0}</Text>
                                </Badge>
                            </>
                        )}
                    </Box>
                    <Box $mt="10">
                        <Box $d="flex" $flexWrap="wrap" $gap="20px" $spaceRight={['0', '20']}>
                            {loading ? (
                                <>
                                    <Skeleton $w={['100%', '260']} $h="170" />
                                    <Skeleton $w={['100%', '260']} $h="170" />
                                    <Skeleton $w={['100%', '260']} $h="170" />
                                    <Skeleton $w={['100%', '260']} $h="170" />
                                    <Skeleton $w={['100%', '260']} $h="170" />
                                </>
                            ) : (
                                team.map((person, index) => (
                                    <CardTeam
                                        key={`team-${person.firstname}-${index}`}
                                        {...person}
                                        refetchMembers={refetch}
                                        canUpdateDelete={person.id === viewer.id ? false : canUpdateDelete}
                                        users={team}
                                        adminCount={adminCount}
                                        viewerEmail={viewerEmail}
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                </PageContainer>
                <Popup
                    open={showInvite}
                    onOk={() => setShowInvite(true)}
                    onCancel={() => setShowInvite(false)}
                    $variant="default"
                    centered
                    width={500}
                    footer={null}
                    destroyOnClose
                >
                    <FormTeam onClose={() => setShowInvite(false)} companyId={companyId} />
                </Popup>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(Team);
