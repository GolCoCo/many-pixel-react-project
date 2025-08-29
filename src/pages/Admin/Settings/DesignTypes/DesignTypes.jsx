import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ConfigProvider } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import IconEdit from '@components/Svg/IconEdit';
import { DESIGN_TYPES } from '@graphql/queries/designType';
import { EDIT_DESIGN_TYPE } from '@graphql/mutations/designType';
import EditDesignType from './modals/EditDesignType';
import { EmptyData } from '@components/EmptyData';

const DesignTypes = () => {
    const { loading, data, refetch } = useQuery(DESIGN_TYPES, {
        fetchPolicy: 'network-only',
    });
    const [dataSource, setDataSource] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditDesignType, setIsShowEditDesignType] = useState(false);
    const [updateDesignType] = useMutation(EDIT_DESIGN_TYPE);

    useEffect(() => {
        if (!loading) {
            setDataSource(data?.allDesignTypes);
        }
    }, [loading, data]);

    const showDesignTypeModal = row => {
        setSelectedData(row);
        setIsShowEditDesignType(true);
    };

    const hideDesignTypeModal = () => {
        setSelectedData(null);
        setIsShowEditDesignType(false);
    };

    const handleEditDesignType = useCallback(
        async values => {
            await updateDesignType({ variables: { id: selectedData.id, name: values.name } });
        },
        [updateDesignType, selectedData]
    );

    const columns = [
        {
            title: 'Design types',
            dataIndex: 'name',
            key: 'name',
            render: name => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {name}
                </Text>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '120px',
            render: (data, row) => (
                <Box onClick={() => showDesignTypeModal(row)} $cursor="pointer" $d="flex" $alignItems="center">
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
        <Box $mt="30">
            <ConfigProvider renderEmpty={EmptyData}>
                <Table
                    isAdminTable
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
            <EditDesignType
                visible={isShowEditDesignType}
                onCancel={hideDesignTypeModal}
                onEdit={handleEditDesignType}
                refetchDesignTypes={refetch}
                selectedData={selectedData}
            />
        </Box>
    );
};

export default DesignTypes;
