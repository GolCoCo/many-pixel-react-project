import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ConfigProvider } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Table } from '@components/Table';
import { Skeleton } from '@components/Skeleton';
import IconEdit from '@components/Svg/IconEdit';
import { SNIPPETS } from '@graphql/queries/snippet';
import { CREATE_SNIPPET, UPDATE_SNIPPET } from '@graphql/mutations/snippet';

import IconNoData from '@components/Svg/IconNoData';
import AddSnippet from './modals/AddSnippet/AddSnippet.jsx';
import { toHtml } from '@components/Wysiwyg';
import withLoggedUser from '@components/WithLoggedUser/WithLoggedUser';
import moment from 'moment';
import EditSnippet from './modals/EditSnippet';
import { Link } from '@components/Link';
import { SNIPPET_DETAILS } from '@constants/routes';
import { ALL_TEAM } from '@graphql/queries/user';

const EmptyData = () => {
    return (
        <Box $textAlign="center" $my="auto">
            <Box $lineH="1" $fontSize="121" $mb="10">
                <IconNoData />
            </Box>
            <Text $textVariant="H5" $colorScheme="primary" $mb="2">
                No data found
            </Text>
        </Box>
    );
};

const Snippets = ({ isShowAddSnippet, setIsShowAddSnippet, viewer }) => {
    const { loading: l, data: teamData } = useQuery(ALL_TEAM);

    const mentions = useMemo(() => {
        if (!l && teamData) {
            return teamData.allUsers.map(user => ({
                text: `${user.firstname} ${user.lastname[0]}`,
                value: `${user.firstname} ${user.lastname[0]}`,
                url: user.id,
            }));
        }
        return [];
    }, [l, teamData]);
    const { loading, data, refetch } = useQuery(SNIPPETS, {
        fetchPolicy: 'network-only',
    });

    const [createSnippet] = useMutation(CREATE_SNIPPET);
    const [updateSnippet] = useMutation(UPDATE_SNIPPET);
    const [selectedData, setSelectedData] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    const onAdd = useCallback(
        async values => {
            const data = {
                ...values,
                text: toHtml(values.text),
                userId: viewer.id,
            };

            await createSnippet({ variables: { data } });
        },
        [createSnippet, viewer]
    );

    const onEdit = useCallback(
        async values => {
            const data = {
                ...values,
                text: toHtml(values.text),
            };

            const where = {
                id: selectedData.id,
            };

            await updateSnippet({ variables: { data, where } });
        },
        [updateSnippet, selectedData]
    );

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, row) => (
                <Text as={Link} to={SNIPPET_DETAILS.replace(':id', row.id)} $ml="10" $textVariant="Badge" $colorScheme="cta">
                    {name}
                </Text>
            ),
        },
        {
            title: 'Created by',
            dataIndex: 'user',
            key: 'user',
            render: user => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {user.firstname} {user.lastname}
                </Text>
            ),
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {moment(createdAt).format('DD MMM YYYY')}
                </Text>
            ),
        },
        {
            title: 'Date Modified',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: updatedAt => (
                <Text $textVariant="P4" $colorScheme="primary">
                    {moment(updatedAt).format('DD MMM YYYY')}
                </Text>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '120px',
            render: (_, row) => (
                <Box
                    onClick={() => {
                        setShowEdit(true);
                        setSelectedData(row);
                    }}
                    $cursor="pointer"
                    $d="flex"
                    $alignItems="center"
                >
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
                    dataSource={data?.allSnippets}
                    rowKey={row => row.id}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                    }}
                />
            </ConfigProvider>
            <EditSnippet
                visible={showEdit}
                onCancel={() => setShowEdit(false)}
                onEdit={onEdit}
                refetch={refetch}
                mentions={mentions}
                selectedData={selectedData}
            />
            <AddSnippet visible={isShowAddSnippet} onCancel={() => setIsShowAddSnippet(false)} onAdd={onAdd} refetch={refetch} mentions={mentions} />
        </Box>
    );
};

export default withLoggedUser(Snippets);
