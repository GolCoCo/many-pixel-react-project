import React, { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ADMIN_SNIPPETS_SETTING, SETTINGS } from '@constants/routes';
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
import EditSnippet from '../modals/EditSnippet';
import { SNIPPET } from '@graphql/queries/snippet';
import { UPDATE_SNIPPET } from '@graphql/mutations/snippet';
import { WysiwygRenderer, toHtml } from '@components/Wysiwyg';
import moment from 'moment';
import { ALL_TEAM } from '@graphql/queries/user';

const wrapDangerous = text => {
    return { __html: text };
};

const SnippetDetails = memo(({ match }) => {
    const { params } = match;
    const { loading, data, refetch } = useQuery(SNIPPET, {
        variables: {
            id: params?.id,
        },
        fetchPolicy: 'network-only',
    });

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
    const [updateSnippet] = useMutation(UPDATE_SNIPPET);

    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditSnippet, setIsShowEditSnippet] = useState(false);

    const snippet = {
        ...data?.Snippet,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showSnippetModal = useCallback(() => {
        setSelectedData(snippet);
        setIsShowEditSnippet(true);
    }, [snippet]);

    const hideSnippetModal = () => {
        setSelectedData(null);
        setIsShowEditSnippet(false);
    };

    const handleEditSnippet = useCallback(
        async values => {
            const data = {
                ...values,
                text: toHtml(values.text),
            };
            await updateSnippet({ variables: { data, where: { id: selectedData.id } } });
        },
        [updateSnippet, selectedData]
    );

    return (
        <DocumentTitle title={`${!loading ? `${snippet?.name} | ` : ''}ManyPixels`}>
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
                                to={ADMIN_SNIPPETS_SETTING}
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
                                            {snippet.name}
                                        </Text>
                                    )}
                                    <Breadcrumb>
                                        <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                            Settings
                                        </BreadcrumbItem>
                                        <BreadcrumbItem as={Link} to={ADMIN_SNIPPETS_SETTING}>
                                            Snippets
                                        </BreadcrumbItem>
                                        <BreadcrumbItem>Details</BreadcrumbItem>
                                    </Breadcrumb>
                                </Box>
                                {loading ? (
                                    <Skeleton $w="100" $h="40" />
                                ) : (
                                    <Button onClick={showSnippetModal} type="default" icon={<IconEdit style={{ fontSize: 18 }} />}>
                                        EDIT
                                    </Button>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Name
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {snippet.name}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Snippet text
                                </Text>
                                {loading ? <Skeleton $w="87" $h="22" /> : <WysiwygRenderer content={snippet.text}  />}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Created by
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {snippet.user.firstname} {snippet.user.lastname}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Date Created
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {moment(snippet.createdAt).format('DD MMMM YYYY')}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Date Modified
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {moment(snippet.updatedAt).format('DD MMMM YYYY')}
                                    </Text>
                                )}
                            </Box>
                        </Box>
                        <EditSnippet
                            visible={isShowEditSnippet}
                            onCancel={hideSnippetModal}
                            onEdit={handleEditSnippet}
                            selectedData={selectedData}
                            refetch={refetch}
                            mentions={mentions}
                        />
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default SnippetDetails;
