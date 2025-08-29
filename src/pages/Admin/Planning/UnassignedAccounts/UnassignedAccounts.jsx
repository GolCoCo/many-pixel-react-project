import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { useQuery } from '@apollo/client';
import { ALL_COMPANIES_UNASSIGNED_DESIGNER, ALL_COMPANIES_UNASSIGNED_TEAM } from '@graphql/queries/company';
import { CompanyCardList } from './CompanyCard';

const UnassignedAccounts = () => {
    const unassignedTeam = useQuery(ALL_COMPANIES_UNASSIGNED_TEAM, {
        fetchPolicy: 'network-only',
    });

    const unassignedDesigner = useQuery(ALL_COMPANIES_UNASSIGNED_DESIGNER, {
        fetchPolicy: 'network-only',
    });

    return (
        <>
            <Text $textVariant="H5" $mb="20">
                Unassigned Accounts
            </Text>
            <Box $mb="5">
                <Text $textVariant="H6" $mb="10" $colorScheme="secondary">
                    No assigned Team
                </Text>
                <CompanyCardList companies={unassignedTeam?.data?.allCompanies ?? []} loading={unassignedTeam?.loading} />
            </Box>
            <Box $mb="5">
                <Text $textVariant="H6" $mb="10" $colorScheme="secondary">
                    No assigned designer
                </Text>
                <CompanyCardList companies={unassignedDesigner?.data?.allCompanies ?? []} loading={unassignedDesigner?.loading} />
            </Box>
        </>
    );
};

export default UnassignedAccounts;
