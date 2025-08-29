import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { NEW_ORDER } from '@graphql/mutations/order';
import { ORDER } from '@graphql/queries/order';
import withLoggedUser from '@components/WithLoggedUser';
import { UPLOAD_FILES } from '@graphql/mutations/file';
import message from '@components/Message';
import { parseLinks, toHtml } from '@components/Wysiwyg';
import { withResponsive } from '@components/ResponsiveProvider';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Link } from '@components/Link';
import { REQUESTS } from '@constants/routes';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import DocumentTitle from '@components/DocumentTitle';
import FormRequest from '../blocks/FormRequest/FormRequest';

const DuplicateRequest = ({ match, location, viewer, windowWidth }) => {
    const { id } = match.params;
    const [initialAttachments, setInitialAttachments] = useState([]);
    const { data, loading, refetch } = useQuery(ORDER, {
        variables: {
            id: +id,
        },
    });

    useEffect(() => {
        if (!loading) {
            setInitialAttachments(data?.Order?.briefAttachments);
        }
    }, [loading, data]);

    const [uploadFiles] = useMutation(UPLOAD_FILES);
    const [newOrder] = useMutation(NEW_ORDER);
    const handleSubmit = useCallback(
        async ({ attachments, ...values }) => {
            message.destroy();
            message.loading('Creating request...', 50000);

            let initialAttachmentIds = [];
            if (initialAttachments && initialAttachments?.length > 0) {
                initialAttachmentIds = await Promise.all(initialAttachments.map(item => item.id));
            }

            if (attachments && attachments?.length > 0) {
                await uploadFiles({ variables: { files: attachments } })
                    .then(async ({ data: uploadData }) => {
                        const uploadedAttachmentIds = uploadData?.uploadFiles.map(uploaded => uploaded.id);
                        await newOrder({
                            variables: {
                                input: {
                                    ...values,
                                    description: toHtml(parseLinks(values?.description)),
                                    attachmentIds: [...uploadedAttachmentIds, ...initialAttachmentIds],
                                },
                            },
                        })
                            .then(() => {
                                message.destroy();
                                message.success('Request has been created.');
                            })
                            .catch(err => {
                                console.log(err);
                                message.destroy();
                                message.error('Error on creating request');
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        message.destroy();
                        message.error('Error on uploading attachments');
                    });
            } else {
                await newOrder({
                    variables: {
                        input: {
                            ...values,
                            description: toHtml(parseLinks(values?.description)),
                            attachmentIds: initialAttachmentIds.length > 0 ? initialAttachmentIds : null,
                        },
                    },
                })
                    .then(() => {
                        message.destroy();
                        message.success('Request has been created.');
                    })
                    .catch(err => {
                        console.log(err);
                        message.destroy();
                        message.error('Error on creating request');
                    });
            }
        },
        [newOrder, uploadFiles, initialAttachments]
    );

    const handleChangeAttachments = updatedAttachments => {
        setInitialAttachments(updatedAttachments);
    };

    if (loading) {
        return (
            <Box>
                <Basepage>
                    <PageContainer $maxW="952">
                        <Box $mb="12">
                            <Text hide="mobile" $textVariant="H3">
                                Duplicate Request
                            </Text>
                            <Text hide="desktop" $textVariant="H4">
                                Duplicate Request
                            </Text>
                        </Box>
                        <Box hide="mobile">
                            <Breadcrumb>
                                <BreadcrumbItem isFirst as={Link} to={REQUESTS}>
                                    Requests
                                </BreadcrumbItem>
                                <BreadcrumbItem>Duplicate</BreadcrumbItem>
                            </Breadcrumb>
                        </Box>
                        <Box $mt="25" $mb="36">
                            <Skeleton $w="175" $h="20" $mb="20" />
                            <Skeleton $w="100%" $h="40" />
                        </Box>
                        <Box $mb="10">
                            <Skeleton $w="175" $h="20" $mb="16" />
                            <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-11']}>
                                <Skeleton
                                    $h="80"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 292px',
                                        xl: '0 1 292px',
                                        xxl: '0 1 292px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '292', xl: '292', xxl: '292' }}
                                    $mx={['0', '11']}
                                    $mb="20"
                                />
                                <Skeleton
                                    $h="80"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 292px',
                                        xl: '0 1 292px',
                                        xxl: '0 1 292px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '292', xl: '292', xxl: '292' }}
                                    $mx={['0', '11']}
                                    $mb="20"
                                />
                                <Skeleton
                                    $h="80"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 292px',
                                        xl: '0 1 292px',
                                        xxl: '0 1 292px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '292', xl: '292', xxl: '292' }}
                                    $mx={['0', '11']}
                                    $mb="20"
                                />
                                <Skeleton
                                    $h="80"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 292px',
                                        xl: '0 1 292px',
                                        xxl: '0 1 292px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '292', xl: '292', xxl: '292' }}
                                    $mx={['0', '11']}
                                    $mb="20"
                                />
                            </Box>
                        </Box>
                        <Box $mb="14">
                            <Skeleton $w="144" $h="20" $mb="22" />
                            <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                                <Skeleton
                                    $h="140"
                                    $flex={{
                                        xs: '1 1 0%',
                                        sm: '1 1 0%',
                                        md: '0 1 47%',
                                        lg: '0 1 215px',
                                        xl: '0 1 215px',
                                        xxl: '0 1 215px',
                                    }}
                                    $w={{ xs: '100%', sm: '100%', md: '47%', lg: '215', xl: '215', xxl: '215' }}
                                    $mx={['0', '10']}
                                    $mb="22"
                                />
                            </Box>
                        </Box>
                        <Box $mb="36">
                            <Skeleton $w="180" $h="20" $mb="16" />
                            <Skeleton $w="180" $h="16" />
                        </Box>
                        <Box $mb="18">
                            <Skeleton $w="114" $h="20" $mb="16" />
                            <Skeleton $w="100%" $h="16" />
                        </Box>
                        <Box $w="100%" $h="250" $borderW="1" $borderColor="outline-gray" $borderStyle="solid" $mb="30">
                            <Box
                                $d="flex"
                                $alignItems="center"
                                $px="16"
                                $py="14"
                                $borderW="0"
                                $borderStyle="solid"
                                $borderColor="outline-gray"
                                $borderB="1"
                            >
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" $mr="16" />
                                <Skeleton $w="20" $h="20" />
                            </Box>
                            <Box $px="16" $py="14">
                                <Skeleton $w="100%" $maxW="578" $h="16" $mb="10" />
                                <Skeleton $w="51" $h="16" $mb="4" />
                                <Skeleton $w="91" $h="16" $mb="4" />
                                <Skeleton $w="59" $h="16" $mb="4" />
                                <Skeleton $w="81" $h="16" />
                            </Box>
                        </Box>
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center">
                            <Skeleton $w={['100%', '156']} $h={['36', '40']} />
                            <Box $d={['none', 'flex']} $alignItems="center">
                                <Skeleton $w="98" $h="40" $mr="20" />
                                <Skeleton $w="78" $h="40" />
                            </Box>
                        </Box>
                    </PageContainer>
                </Basepage>
                {windowWidth > 1278 && (
                    <Box
                        $pos="fixed"
                        hide="mobile"
                        $top="50%"
                        $left="0"
                        $transform="translateY(-50%)"
                        $userSelect="none"
                    >
                        <Skeleton $w={windowWidth < 1367 ? '200' : '220'} $h="293" />
                    </Box>
                )}
            </Box>
        );
    }

    const initialValues = {
        ...data.Order,
        serviceId: data?.Order?.service?.id,
        categoryId: data?.Order.category?.id,
        brandId: data?.Order.brand?.id,
        attachments: initialAttachments,
    };

    return (
        <DocumentTitle title="Duplicate Request | ManyPixels">
            <FormRequest
                onSubmit={handleSubmit}
                paging={false}
                initialValues={initialValues}
                title="Duplicate Request"
                submitText="Submit"
                breadcrumbLabel="Duplicate"
                originPath={location.pathname}
                viewer={viewer}
                refetch={refetch}
                isDuplicate
                handleChangeAttachments={handleChangeAttachments}
            />
        </DocumentTitle>
    );
};

export default withLoggedUser(withResponsive(DuplicateRequest));
