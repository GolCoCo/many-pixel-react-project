import React from 'react';
import { Badge } from '@components/Badge';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import moment from 'moment';
import { Link } from '@components/Link';
import { Tooltip } from 'antd';
import { companyRoles } from '@constants/enums';
import { MEMBER_INFO, REQUESTS } from '@constants/routes';

export const memberColumns = {
    name: locationPathname => ({
        title: 'Name',
        dataIndex: 'firstname',
        key: 'firstname',
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: (firstname, user) => (
            <Box $d="flex" $alignItems="center">
                <Text
                    as={Link}
                    to={{
                        pathname: MEMBER_INFO.replace(':id', user.id),
                        state: { previousPage: locationPathname ?? REQUESTS },
                    }}
                    $isTruncate
                    $maxW="150"
                    $mr="6"
                    $textVariant="Badge"
                    $colorScheme="cta"
                >
                    {user.firstname} {user.lastname}
                </Text>
            </Box>
        ),
    }),
    email: () => ({
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: email => (
            <Text $textVariant="P4" $colorScheme="primary">
                {email}
            </Text>
        ),
    }),
    lastLogin: () => ({
        title: 'Last login',
        dataIndex: 'lastLogin',
        key: 'lastLoginDateTime',
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: login => {
            if (!login) {
                return;
            }
            const dateNow = moment().startOf('day');
            const lastlogin = moment(login).startOf('day');
            const dateDiff = dateNow.diff(lastlogin, 'days');

            let formattedLastLogin;
            switch (dateDiff) {
                case 0:
                    formattedLastLogin = 'Today';
                    break;
                case 1:
                    formattedLastLogin = 'Yesterday';
                    break;
                default:
                    formattedLastLogin = moment(login).format('D MMM');
                    break;
            }

            const formattedTime = moment(login).format('H: mm');

            return (
                <Text $textVariant="P4" $colorScheme="gray">
                    {formattedLastLogin}, {formattedTime}
                </Text>
            );
        },
    }),
    team: () => ({
        title: 'Team',
        dataIndex: 'id',
        key: 'team',
        render: (id, record) =>
            record.role === 'owner'
                ? '-'
                : [...record.teamLeadersTeams, ...record.designerTeams]
                      .reduce(
                          (acc, item) =>
                              acc.filter(accItem => accItem.id === item.id).length > 0 ? acc : [...acc, item],
                          []
                      )
                      .map((team, idx) => (
                          <span key={team.id}>
                              {idx !== 0 ? ', ' : null}
                              <Text as={Link} to={`/company/teams/${team.id}`} $textVariant="Badge" $colorScheme="cta">
                                  {team.name}
                              </Text>
                          </span>
                      )),
    }),
    role: () => ({
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: role => (
            <Text $textVariant="P4" $colorScheme="gray">
                {companyRoles[role]}
            </Text>
        ),
    }),
    specialities: () => ({
        title: 'Design Type',
        dataIndex: 'specialities',
        key: 'specialities',
        render: specialities => {
            if (!specialities.length) {
                return '-';
            }
            const joinedSpecialities = specialities.map(sp => sp.name).join(', ');
            return (
                <Text $textVariant="P4" $colorScheme="gray">
                    {joinedSpecialities}
                </Text>
            );
        },
    }),
    status: () => ({
        title: 'Status',
        dataIndex: 'archived',
        key: 'isArchived',
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        render: archived => (
            <Badge $variant={archived ? 'Inactive' : 'Active'}>{archived ? 'Inactive' : 'Active'}</Badge>
        ),
    }),
    actions: actions => ({
        title: 'Action',
        dataIndex: 'id',
        key: 'action',
        render: (_, record) => (
            <Box $alignSelf="center" $h="20" $pl="8">
                {actions.map(action => (
                    <Tooltip color="white" key={action.label} title={action.label} trigger="hover">
                        <Button
                            type="link"
                            $w={['18', '20']}
                            $h="20"
                            mobileH="18"
                            $fontSize={['18', '20']}
                            $p="0"
                            $lineH="1"
                            icon={action.icon}
                            onClick={() => action.handleClick(record)}
                        />
                    </Tooltip>
                ))}
            </Box>
        ),
    }),
};
