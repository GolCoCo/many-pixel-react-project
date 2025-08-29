import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Link } from '@components/Link';
import { COMPANY_ROLE_ADMIN } from '@constants/account';
import { ACCOUNT_INFO } from '@constants/routes';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import { Tooltip } from 'antd';

const getOwner = users => {
    return users.find(user => user.companyRole === COMPANY_ROLE_ADMIN) || users[0];
};

export const columns = {
    name: teamId => ({
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, row) => (
            <Box $d="flex" $alignItems="center">
                <Text
                    as={Link}
                    to={{
                        pathname: `${ACCOUNT_INFO.replace(':id?', row.id)}`,
                        state: { previousPage: `/company/teams/${teamId}?tab=accounts` },
                    }}
                    $isTruncate
                    $maxW="150"
                    $mr="6"
                    $textVariant="Badge"
                    $colorScheme="cta"
                >
                    {name}
                </Text>
            </Box>
        ),
    }),
    email: () => ({
        title: 'Email',
        dataIndex: 'users',
        key: 'companyEmail',
        render: users => {
            const owner = getOwner(users);
            return (
                <Text $textVariant="P4" $colorScheme="primary">
                    {owner.email}
                </Text>
            );
        },
    }),
    creationDate: () => ({
        title: 'Creation Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => {
            const formattedDate = moment(createdAt).format('D MMM YYYY');
            return (
                <Text $textVariant="P4" $colorScheme="gray">
                    {formattedDate}
                </Text>
            );
        },
    }),
    plan: () => ({
        title: 'Plan',
        dataIndex: 'subscription',
        key: 'subscriptionPlan',
        render: subscription => {
            if (subscription) {
                return (
                    <Box>
                        <Text $textVariant="P4" $colorScheme="gray">
                            {subscription.plan.name}
                        </Text>
                        <Text $textVariant="P5" $colorScheme="secondary">
                            {_.upperFirst(_.toLower(subscription.plan.interval))}
                        </Text>
                    </Box>
                );
            }
        },
    }),
    designers: () => ({
        title: 'Designer(s)',
        dataIndex: 'assignedDesigners',
        key: 'assignedDesigners',
        render: assignedDesigners =>
            assignedDesigners?.length > 0
                ? assignedDesigners.map(({ designer }, key) => (
                      <Box $d="flex" $alignItems="center" key={key}>
                          <Text $textVariant="P4" $colorScheme="gray">
                              {`${designer.firstname} ${designer.lastname}`}
                          </Text>
                      </Box>
                  ))
                : '-',
    }),
    status: () => ({
        title: 'Subscription',
        dataIndex: 'subscription',
        key: 'subscriptionStatus',
        render: subscription => {
            const planStatus = subscription?.status;
            return (
                <Box>
                    {planStatus === 'active' && <Badge $variant="BillingActive">Active</Badge>}
                    {planStatus === 'paused' && <Badge $variant="BillingPaused">Paused</Badge>}
                    {(planStatus === 'cancelled' || planStatus === 'canceled' || planStatus === 'inactive') && (
                        <Badge $variant="SubscriptionInactive">Inactive</Badge>
                    )}
                </Box>
            );
        },
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
