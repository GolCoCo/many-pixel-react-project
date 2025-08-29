import React, { memo, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import startCase from 'lodash/startCase';
import { ADMIN_PRODUCT_SETTING, SETTINGS } from '@constants/routes';
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
import { SERVICE_BY_ID } from '@graphql/queries/service';
import { UPDATE_SERVICE } from '@graphql/mutations/service';
import EditProduct from '../modals/EditProduct';
import { Image } from '@components/Image';
import defaultImage from '@public/assets/icons/default-image.svg';

const ProductDetails = memo(({ match }) => {
    const { params } = match;
    const { loading, data, refetch } = useQuery(SERVICE_BY_ID, {
        variables: {
            id: params?.id,
        },
        fetchPolicy: 'network-only',
    });
    const [updateService] = useMutation(UPDATE_SERVICE);

    const [selectedData, setSelectedData] = useState(null);
    const [isShowEditProduct, setIsShowEditProduct] = useState(false);

    const product = {
        ...data?.Service,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showProductModal = () => {
        setSelectedData(product);
        setIsShowEditProduct(true);
    };

    const hideProductModal = () => {
        setSelectedData(null);
        setIsShowEditProduct(false);
    };

    const handleEditProduct = useCallback(
        async values => {
            await updateService({ variables: { ...values, id: selectedData.id } });
            await refetch();
        },
        [updateService, selectedData, refetch]
    );

    return (
        <DocumentTitle title={`${!loading ? `${product?.name} | ` : ''}ManyPixels`}>
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
                                to={ADMIN_PRODUCT_SETTING}
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
                                            {product.name}
                                        </Text>
                                    )}
                                    <Breadcrumb>
                                        <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                            Settings
                                        </BreadcrumbItem>
                                        <BreadcrumbItem as={Link} to={ADMIN_PRODUCT_SETTING}>
                                            Products
                                        </BreadcrumbItem>
                                        <BreadcrumbItem>Details</BreadcrumbItem>
                                    </Breadcrumb>
                                </Box>
                                {loading ? (
                                    <Skeleton $w="100" $h="40" />
                                ) : (
                                    <Button onClick={showProductModal} type="default" icon={<IconEdit style={{ fontSize: 18 }} />}>
                                        EDIT
                                    </Button>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Product image
                                </Text>
                                {loading ? (
                                    <Skeleton $w="80" $h="88" />
                                ) : (
                                    <Image
                                        size={100}
                                        src={product?.icon?.url}
                                        fallbackSrc={defaultImage}
                                        name={product?.name}
                                        isBorderLess
                                        imageProps={{ h: 'auto', $w: '100%', $maxW: '100' }}
                                    />
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Design type
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {product?.type?.name ?? 'None'}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Status
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {product?.isActivated ? 'Active' : 'Inactive'}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    File deliverables
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {product?.deliverables?.map(
                                            (deliverable, index) => `${startCase(deliverable)}${index === product?.deliverables?.length - 1 ? '' : ','} `
                                        )}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="6">
                                    Questions
                                </Text>
                                {loading ? (
                                    <Skeleton $w="100%" $h="117" />
                                ) : (
                                    <Box>
                                        {product?.questions && product?.questions?.length > 0 ? (
                                            product?.questions?.map(question => {
                                                let typeOfAnswer;
                                                switch (question.answerType) {
                                                    case 'TEXT':
                                                        typeOfAnswer = 'Text';
                                                        break;
                                                    case 'IMG_SELECT':
                                                        typeOfAnswer = 'Image select';
                                                        break;
                                                    case 'RADIO':
                                                        typeOfAnswer = 'Radio';
                                                        break;
                                                    case 'UPLOAD_FILES':
                                                        typeOfAnswer = 'Upload files';
                                                        break;
                                                    case 'DROPDOWN':
                                                        typeOfAnswer = 'Dropdown';
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                return (
                                                    <Box key={question.index} $borderW="1" $borderStyle="solid" $borderColor="#D9D9D9" $mb="16">
                                                        <Box
                                                            $borderW="0"
                                                            $borderB="1"
                                                            $borderStyle="solid"
                                                            $borderColor="#D9D9D9"
                                                            $px="24"
                                                            $py="20"
                                                            $d="flex"
                                                            $alignItems="center"
                                                            $justifyContent="space-between"
                                                        >
                                                            <Text $textVariant="P3" $fontWeight="400" $lineH="24" $colorScheme="gray">
                                                                Question #{question.index}: {question.title}
                                                            </Text>
                                                        </Box>
                                                        <Box $px="24" $py="16">
                                                            <Text $textVariant="P4" $colorScheme="secondary">
                                                                Type of answer : {typeOfAnswer}
                                                            </Text>
                                                            {question?.choices && question?.choices?.length > 0 && (
                                                                <Box $mt="8">
                                                                    <Text $textVariant="Badge" $colorScheme="secondary" $mb="8">
                                                                        Choices
                                                                    </Text>
                                                                    <Box $d="flex" $flexWrap="wrap" $mx="-10">
                                                                        {question.choices &&
                                                                            question?.choices?.length > 0 &&
                                                                            question.choices?.map(choice => (
                                                                                <Text
                                                                                    key={choice.index}
                                                                                    $textVariant="P4"
                                                                                    $colorScheme="primary"
                                                                                    $mb="6"
                                                                                    $mx="10"
                                                                                    $w="47%"
                                                                                >
                                                                                    {choice.index}. {choice.label}
                                                                                </Text>
                                                                            ))}
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                );
                                            })
                                        ) : (
                                            <Text $textVariant="H6" $colorScheme="tertiary">
                                                There are no questions.
                                            </Text>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <EditProduct visible={isShowEditProduct} onCancel={hideProductModal} onEdit={handleEditProduct} selectedData={selectedData} />
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default ProductDetails;
