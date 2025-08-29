import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider } from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import IconEdit from '@components/Svg/IconEdit';
import { CATEGORY_DETAILS, PRODUCT_DETAILS } from '@constants/routes';
import { ALL_CATEGORIES } from '@graphql/queries/category';
import { UPDATE_CATEGORY } from '@graphql/mutations/category';
import EditCategory from './modals/EditCategory';
import { EmptyData } from '@components/EmptyData';
import { Image } from '@components/Image';
import defaultImage from '@public/assets/icons/default-image.svg';

const Categories = () => {
    const { loading, data, refetch } = useQuery(ALL_CATEGORIES, {
        variables: {
            orderBy: {
                createdAt: 'Asc',
            },
        },
        fetchPolicy: 'cache-first',
    });
    const [updateCategory] = useMutation(UPDATE_CATEGORY);
    const [dataSource, setDataSource] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditCategory, setIsShowEditCategory] = useState(false);

    useEffect(() => {
        if (!loading) {
            setDataSource(data?.allCategories);
        }
    }, [loading, data]);

    const showCategoryModal = row => {
        setSelectedData(row);
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
            render: (title, row) => (
                <Box $d="flex" $alignItems="center">
                    <Image src={row?.icon?.url} name={title} size={40} isBorderLess fallbackSrc={defaultImage} />
                    <Text as={Link} to={CATEGORY_DETAILS.replace(':id', row.id)} $ml="10" $textVariant="Badge" $colorScheme="cta">
                        {title}
                    </Text>
                </Box>
            ),
        },
        {
            title: 'Products',
            dataIndex: 'services',
            key: 'services',
            width: '729px',
            render: services => (
                <Box>
                    {services?.length > 0 ? (
                        services?.map((service, index) => (
                            <Text key={service.id} $d="inline-block" $colorScheme="primary" $mr={index === services?.length - 1 ? '0' : '4'}>
                                <Text $d="inline-block" $textVariant="Badge" as={Link} to={PRODUCT_DETAILS.replace(':id', service.id)}>
                                    {service.name}
                                </Text>
                                {index === services?.length - 1 ? '' : ','}
                            </Text>
                        ))
                    ) : (
                        <Text $textVariant="P4" $colorScheme="gray">
                            -
                        </Text>
                    )}
                </Box>
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: position => (
                <Box $d="flex" $alignItems="center">
                    <Text $ml="10" $textVariant="Badge" $colorScheme="cta">
                        {position || 0}
                    </Text>
                </Box>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '120px',
            render: (data, row) => (
                <Box onClick={() => showCategoryModal(row)} $cursor="pointer" $d="flex" $alignItems="center">
                    <Text $colorScheme="cta" $mt="4" $mr="8">
                        <IconEdit width="18" height="18" />
                    </Text>
                    <Text $textVariant="Badge" $colorScheme="cta">
                        Edit
                    </Text>
                </Box>
            ),
        },
    ];

    if (loading) {
        return (
            <Box $mt="30">
                <Box $borderW="1" $borderStyle="solid" $borderColor="other-gray">
                    <Box $px="16" $py="16" $bg="#FAFAFA">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                    <Box $px="16" $py="16" $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="other-gray">
                        <Skeleton $w="100%" $h="18" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box $pos="relative" $mt="30">
            <ConfigProvider renderEmpty={EmptyData}>
                <Table
                    columns={columns}
                    bordered
                    dataSource={dataSource}
                    rowKey={row => row.id}
                    isAdminTable
                    paginated
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                    }}
                />
            </ConfigProvider>
            {dataSource?.length > 0 && (
                <Text $pos="absolute" $bottom="30" $left="0" $textVariant="Badge" $colorScheme="primary">
                    Total {dataSource?.length} categories
                </Text>
            )}
            <EditCategory
                visible={isShowEditCategory}
                onCancel={hideCategoryModal}
                onEdit={handleEditCategory}
                refetchCategories={refetch}
                selectedData={selectedData}
            />
        </Box>
    );
};

export default Categories;
