import React, { useState, useEffect, memo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ConfigProvider } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Table } from '@components/Table';
import IconEdit from '@components/Svg/IconEdit';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { PRODUCT_DETAILS } from '@constants/routes';
import { ALL_SERVICES } from '@graphql/queries/service';
import { UPDATE_SERVICE } from '@graphql/mutations/service';
import EditProduct from './modals/EditProduct';
import { EmptyData } from '@components/EmptyData';
import { Image } from '@components/Image';
import defaultImage from '@public/assets/icons/default-image.svg';

function stringEquals(a, b) {
    return a === b;
}

const Products = memo(({ isProductAdded, handleAfterProductAdded }) => {
    const {
        loading: activatedServicesLoading,
        data: activatedServices,
        refetch: refetchActivated,
    } = useQuery(ALL_SERVICES, {
        variables: {
            activated: true,
            orderBy: { createdAt: 'Desc' },
        },
        fetchPolicy: 'network-only',
    });
    const {
        loading: deactivatedServicesLoading,
        data: deactivatedServices,
        refetch: refetchDeactivated,
    } = useQuery(ALL_SERVICES, {
        variables: {
            activated: false,
            orderBy: { createdAt: 'Asc' },
        },
        fetchPolicy: 'network-only',
    });
    const [updateService] = useMutation(UPDATE_SERVICE);
    const [activeFilter, setActiveFilter] = useState('ACTIVE');
    const [dataSource, setDataSource] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditProduct, setIsShowEditProduct] = useState(false);
    const loading = activeFilter === 'ACTIVE' ? activatedServicesLoading : deactivatedServicesLoading;
    const data = activeFilter === 'ACTIVE' ? activatedServices : deactivatedServices;

    useEffect(() => {
        if (!loading) {
            setDataSource(data?.allServices);
        }
    }, [loading, data]);

    useEffect(() => {
        if (isProductAdded) {
            refetchActivated();
            refetchDeactivated();
            handleAfterProductAdded();
        }
    }, [isProductAdded, refetchActivated, refetchDeactivated, handleAfterProductAdded]);

    if (loading) {
        return (
            <Box>
                <Box $d="flex" $alignItems="center" $my="30">
                    <Skeleton $w="45" $h="20" $mr="20" />
                    <Box $d="flex" $alignItems="center">
                        <Skeleton $w="88" $h="34" $mr="10" />
                        <Skeleton $w="88" $h="34" />
                    </Box>
                </Box>
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

    const handleChangeStatus = async selectedStatus => {
        setActiveFilter(selectedStatus);
        setDataSource(data?.allServices);
    };

    const showProductModal = row => {
        setSelectedData(row);
        setIsShowEditProduct(true);
    };

    const hideProductModal = () => {
        setSelectedData(null);
        setIsShowEditProduct(false);
    };

    const handleEditProduct = async values => {
        await updateService({ variables: { ...values, id: selectedData.id } });
        await refetchActivated();
        await refetchDeactivated();
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, row) => (
                <Box $d="flex" $alignItems="center">
                    <Image src={row?.icon?.url} name={name} size={40} isBorderLess fallbackSrc={defaultImage} />
                    <Text as={Link} to={PRODUCT_DETAILS.replace(':id', row.id)} $ml="10" $textVariant="Badge" $colorScheme="cta">
                        {name}
                    </Text>
                </Box>
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: '120px',
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
                <Box onClick={() => showProductModal(row)} $cursor="pointer" $d="flex" $alignItems="center">
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

    return (
        <Box>
            <Box $d="flex" $alignItems="center" $my="30">
                <Text $textVariant="H6" $colorScheme="primary" $mr="20">
                    Status
                </Text>
                <Box $d="flex" $alignItems="center">
                    <Button
                        style={{ padding: '6px 24px' }}
                        $mr="10"
                        noColorTransitions
                        type={stringEquals(activeFilter, 'ACTIVE') ? 'primary' : 'default'}
                        isBadge={true}
                        iscapitalized="true"
                        onClick={() => handleChangeStatus('ACTIVE')}
                    >
                        Active
                    </Button>
                    <Button
                        $mr="10"
                        style={{ padding: '6px 24px' }}
                        noColorTransitions
                        type={stringEquals(activeFilter, 'INACTIVE') ? 'primary' : 'default'}
                        isBadge={true}
                        iscapitalized="true"
                        onClick={() => handleChangeStatus('INACTIVE')}
                    >
                        Inactive
                    </Button>
                </Box>
            </Box>
            <Box $pos="relative">
                <ConfigProvider renderEmpty={EmptyData}>
                    <Table
                        bordered
                        isAdminTable
                        paginated
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={row => row.id}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                        }}
                    />
                </ConfigProvider>
                {dataSource?.length > 0 && (
                    <Text $pos="absolute" $bottom="30" $left="0" $textVariant="Badge" $colorScheme="primary">
                        Total {dataSource?.length} products
                    </Text>
                )}
            </Box>
            <EditProduct visible={isShowEditProduct} onCancel={hideProductModal} onEdit={handleEditProduct} selectedData={selectedData} />
        </Box>
    );
});

export default Products;
