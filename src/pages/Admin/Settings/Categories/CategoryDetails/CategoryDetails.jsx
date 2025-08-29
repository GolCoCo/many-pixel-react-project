import React, { memo, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ADMIN_CATEGORY_SETTING, SETTINGS } from '@constants/routes';
import DocumentTitle from '@components/DocumentTitle';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Button } from '@components/Button';
import { Link } from '@components/Link';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import { Skeleton } from '@components/Skeleton';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import IconEdit from '@components/Svg/IconEdit';
import { CATEGORY } from '@graphql/queries/category';
import { UPDATE_CATEGORY } from '@graphql/mutations/category';
import EditCategory from '../modals/EditCategory';
import { Image } from '@components/Image';
import defaultImage from '@public/assets/icons/default-image.svg';

const CategoryDetails = memo(({ match }) => {
    const { params } = match;
    const { loading, data, refetch } = useQuery(CATEGORY, {
        variables: {
            id: params?.id,
        },
        fetchPolicy: 'network-only',
    });
    const [updateCategory] = useMutation(UPDATE_CATEGORY);

    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditCategory, setIsShowEditCategory] = useState(false);

    const category = {
        ...data?.Category,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showCategoryModal = () => {
        setSelectedData(category);
        setIsShowEditCategory(true);
    };

    const hideCategoryModal = () => {
        setSelectedData(null);
        setIsShowEditCategory(false);
    };

    const handleEditCategory = useCallback(
        async values => {
            await updateCategory({ variables: { ...values, id: selectedData.id } });
        },
        [updateCategory, selectedData]
    );

    return (
        <DocumentTitle title={`${!loading ? `${category?.title} | ` : ''}ManyPixels`}>
            <Basepage>
                <PageContainer $maxW="1288">
                    <Box $d="flex">
                        <Box $pt="4" $mr="20">
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                as={Link}
                                to={ADMIN_CATEGORY_SETTING}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        </Box>
                        <Box $flex="1">
                            <Box $d="flex" $justifyContent="space-between" $mb="29">
                                <Box>
                                    {loading ? (
                                        <Skeleton $w="150" $h="44" $mb="12" />
                                    ) : (
                                        <Text $textVariant="H3" $colorScheme="Headline" $mb="12">
                                            {category.title}
                                        </Text>
                                    )}
                                    <Breadcrumb>
                                        <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                            Settings
                                        </BreadcrumbItem>
                                        <BreadcrumbItem as={Link} to={ADMIN_CATEGORY_SETTING}>
                                            Categories
                                        </BreadcrumbItem>
                                        <BreadcrumbItem>Details</BreadcrumbItem>
                                    </Breadcrumb>
                                </Box>
                                {loading ? (
                                    <Skeleton $w="100" $h="40" />
                                ) : (
                                    <Button onClick={showCategoryModal} type="default" icon={<IconEdit style={{ fontSize: 18 }} />}>
                                        EDIT
                                    </Button>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Category image
                                </Text>
                                {loading ? (
                                    <Skeleton $w="80" $h="88" />
                                ) : (
                                    <Image
                                        size={100}
                                        name={category?.title}
                                        fallbackSrc={defaultImage}
                                        src={category?.icon?.url}
                                        isBorderLess
                                        imageProps={{ h: 'auto', $w: '100%', $maxW: '100' }}
                                    />
                                )}
                            </Box>
                            <Box>
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Associated products
                                </Text>
                                {loading ? (
                                    <Box $d="flex">
                                        <Skeleton $w="164" $h="34" $mr="8" />
                                        <Skeleton $w="133" $h="34" $mr="8" />
                                        <Skeleton $w="142" $h="34" $mr="8" />
                                        <Skeleton $w="95" $h="34" />
                                    </Box>
                                ) : (
                                    <Box $d="flex" $alignItems="center" $flexWrap="wrap" $mx="-8">
                                        {category?.services?.length > 0 &&
                                            category?.services?.map(service => (
                                                <Text
                                                    key={service.id}
                                                    $bg="rgba(0, 153, 246, 0.1)"
                                                    $textVariant="P2"
                                                    $colorScheme="cta"
                                                    $px="16"
                                                    $py="4"
                                                    $mx="4"
                                                    $mb="10"
                                                    $radii="10"
                                                >
                                                    {service.name}
                                                </Text>
                                            ))}
                                    </Box>
                                )}
                            </Box>
                            <EditCategory
                                visible={isShowEditCategory}
                                onCancel={hideCategoryModal}
                                onEdit={handleEditCategory}
                                refetchCategories={refetch}
                                selectedData={selectedData}
                            />
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default CategoryDetails;
