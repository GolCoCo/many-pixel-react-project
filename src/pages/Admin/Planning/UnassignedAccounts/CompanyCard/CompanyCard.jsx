import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Row, Col } from 'antd';
import { Card } from '@components/Card';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { ACCOUNT_INFO } from '@constants/routes';
import { Image } from '@components/Image';

const getLogo = company => {
    const brand = company?.brands?.length > 0 ? company?.brands[0] : undefined;
    const logo = brand?.logos?.length > 0 ? brand.logos[0] : undefined;
    return logo;
};

export const CompanyCard = ({ company }) => {
    return (
        <Card
            as={Link}
            to={{
                pathname: `${ACCOUNT_INFO.replace(':id?', company?.id)}`,
                state: { previousPage: '/planning' },
            }}
            $h="54"
            $px="16"
            $hoverable
            $flexDir="row"
            $mb="20"
        >
            <Box $mr="8">
                <Image src={getLogo(company)} size={33} isRounded $fontSize={13} name={company.name} />
            </Box>
            <Box $d="flex" $flexDir="column">
                <Text $textVariant="Badge" $colorScheme="primary">
                    {company.name}
                </Text>
                <Text $textVariant="P5" $colorScheme="secondary">
                    {company?._ordersCount || 0} active request
                    {company?._ordersCount > 0 && 's'}
                </Text>
            </Box>
        </Card>
    );
};

export const CompanyCardList = ({ companies, loading }) => {
    if (loading) {
        return (
            <Box $d="flex" $flexDir="row" $mx="-10px">
                <Skeleton $w="270" $h="54" $mx="10" $mb="20" />
                <Skeleton $w="270" $h="54" $mx="10" $mb="20" />
                <Skeleton $w="270" $h="54" $mx="10" $mb="20" />
                <Skeleton $w="270" $h="54" $mx="10" $mb="20" />
            </Box>
        );
    }
    return (
        <Box>
            {!companies.length && <Box $mb="20">--</Box>}
            {!!companies.length && (
                <Row gutter={{ sm: 12, md: 20 }}>
                    {companies.map(company => {
                        return (
                            <Col key={company.id} span={6}>
                                <CompanyCard company={company} />
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Box>
    );
};
