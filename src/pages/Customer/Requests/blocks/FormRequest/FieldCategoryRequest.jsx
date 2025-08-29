import React, { forwardRef } from 'react';
import { Col, Row } from 'antd';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Image } from '@components/Image';
import defaultImage from '@public/assets/icons/default-image.svg';

export const FieldCategoryRequest = forwardRef(({ windowWidth, value, categories = [], onChange, handleChange, loading }, ref) => {
    const handleChangeCategory = category => {
        onChange(value !== category.id ? category.id : undefined);
        handleChange(value !== category.id ? category : undefined);
    };

    return windowWidth > 720 ? (
        <Row gutter={20}>
            {loading && (
                <>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                </>
            )}
            {!loading &&
                Array.isArray(categories) &&
                categories.length > 0 &&
                categories.map(category => (
                    <Col key={category.id} lg={4}>
                        <Card
                            $h="140"
                            $alignItems="center"
                            $hoverable
                            $flexDir="column"
                            $mb="20"
                            $maxW="140"
                            $justifyContent="center"
                            $isActive={value === category.id}
                            onClick={() => handleChangeCategory(category)}
                        >
                            <Image
                                src={category.icon?.url}
                                name={category.title}
                                size={60}
                                isBorderLess
                                imageProps={{ $objectFit: 'contain' }}
                                fallbackSrc={defaultImage}
                            />
                            <Text $textVariant="Badge" $pt="8" $colorScheme="primary" $textAlign="center" $maxW="110">
                                {category.title}
                            </Text>
                        </Card>
                    </Col>
                ))}
        </Row>
    ) : (
        <Col gutter={20}>
            {loading && (
                <>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                    <Col lg={4}>
                        <Skeleton $w="100%" $h="140" $px="26" $mb="20" />
                    </Col>
                </>
            )}
            {!loading &&
                Array.isArray(categories) &&
                categories.length > 0 &&
                categories.map(category => (
                    <Col key={category.id} lg={4}>
                        <Card
                            $h="140"
                            $alignItems="center"
                            $hoverable
                            $flexDir="column"
                            $mb="20"
                            $maxW="100%"
                            $justifyContent="center"
                            $isActive={value === category.id}
                            onClick={() => handleChangeCategory(category)}
                        >
                            <Image
                                src={category.icon.url}
                                name={category.title}
                                size={60}
                                isBorderLess
                                imageProps={{ $objectFit: 'contain' }}
                                fallbackSrc={defaultImage}
                            />
                            <Text $textVariant="Badge" $pt="8" $colorScheme="primary" $textAlign="center" $maxW="110">
                                {category.title}
                            </Text>
                        </Card>
                    </Col>
                ))}
        </Col>
    );
});
