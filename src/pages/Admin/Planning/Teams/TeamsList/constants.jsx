import React from 'react';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Link } from '@components/Link';
import { ACCOUNT_INFO, MEMBER_INFO } from '@constants/routes';

const renderCompanyCell = company => {
    if (!company) {
        return null;
    }
    return (
        <Box $textAlign="left">
            <Text
                as={Link}
                to={{
                    pathname: `${ACCOUNT_INFO.replace(':id?', company?.id)}`,
                    state: { previousPage: '/planning' },
                }}
                $isTruncate
                $maxW="150"
                $mr="6"
                $textVariant="Badge"
                $colorScheme="cta"
            >
                {company?.name}
            </Text>
            <Text $colorScheme="secondary">
                {company?._ordersCount} active request{company?._ordersCount > 1 && 's'}
            </Text>
        </Box>
    );
};

export const generateColumns = ({ location }) => [
    {
        title: 'Designers',
        dataIndex: 'firstname',
        key: 'designers',
        width: '160px',
        render: (fs, designer) => (
            <Text
                as={Link}
                to={{ pathname: MEMBER_INFO.replace(':id', designer.id), state: { previousPage: location.pathname } }}
                $colorScheme="cta"
                $textVariant="Badge"
            >
                {designer.firstname} {designer?.lastname?.substring(0, 1)}
            </Text>
        ),
    },
    {
        title: 'Accounts',
        children: [
            {
                title: '1',
                dataIndex: 'companies[0]',
                align: 'center',
                key: 'account-1',
                render: renderCompanyCell,
            },
            {
                title: '2',
                dataIndex: 'companies[1]',
                key: 'account-2',
                align: 'center',
                render: renderCompanyCell,
            },
            {
                title: '3',
                dataIndex: 'companies[2]',
                key: 'account-3',
                align: 'center',
                render: renderCompanyCell,
            },
            {
                title: '4',
                dataIndex: 'companies[3]',
                key: 'account-4',
                align: 'center',
                render: renderCompanyCell,
            },
            {
                title: '5',
                dataIndex: 'companies[4]',
                key: 'account-5',
                align: 'center',
                render: renderCompanyCell,
            },
            {
                title: '6',
                dataIndex: 'companies[5]',
                key: 'account-6',
                align: 'center',
                render: renderCompanyCell,
            },
            {
                title: '7',
                dataIndex: 'companies[6]',
                key: 'account-7',
                align: 'center',
                render: renderCompanyCell,
            },
        ],
    },
];
