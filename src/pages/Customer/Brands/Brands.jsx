import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import IconAdd from '@components/Svg/IconAdd';
import withLoggedUser from '@components/WithLoggedUser';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Badge } from '@components/Badge';
import { Popup, PopupDelete } from '@components/Popup';
import message from '@components/Message';
import { withResponsive } from '@components/ResponsiveProvider';
import { Skeleton } from '@components/Skeleton';
import { toWysiwyg } from '@components/Wysiwyg';
import DocumentTitle from '@components/DocumentTitle';
import { CUSTOMER_BRANDS } from '@graphql/queries/user';
import { DELETE_BRAND } from '@graphql/mutations/brand';
import downloadBrandAsZip from '@utils/downloadBrandAsZip';
import { CardBrand } from './blocks/CardBrand.jsx';
import FormBrand from './blocks/FormBrand.jsx';

const Brands = ({ viewer, windowWidth }) => {
    const { loading, data, refetch } = useQuery(CUSTOMER_BRANDS, {
        variables: { id: viewer.id },
        fetchPolicy: 'network-only',
    });
    const [deleteBrand] = useMutation(DELETE_BRAND);
    const [showCreate, setShowCreate] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [editable, setEditable] = useState(null);
    const [deletable, setDeletable] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const brands = data?.User?.company?.brands || [];

    const handleDelete = useCallback(
        async brand => {
            message.destroy();
            message.loading('Deleting brand...', 20000);
            setConfirmLoading(true);
            try {
                deleteBrand({ variables: { id: brand.id } });
                await refetch();
                setConfirmLoading(false);
                message.destroy();
                message.success('Brand has been deleted');
                setDeletable(null);
            } catch (error) {
                console.log(error);
                setConfirmLoading(false);
                message.destroy();
                message.error('Error on deleting brand');
            }
        },
        [deleteBrand, refetch]
    );

    const handleSuccessCreate = async () => {
        await refetch();
        setShowCreate(false);
    };

    const handleSuccessEdit = () => {
        setEditable(null);
    };

    const handleZippingFiles = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            message.destroy();
        }
    };

    const handleDownloadAssets = brandData => {
        const { assets, brandGuides, fonts, logos, name } = brandData;

        if ([...assets, ...brandGuides, ...fonts, ...logos].length) {
            message.destroy();
            message.loading(`Downloading ${name} assets...`, 50000);
            downloadBrandAsZip(logos, brandGuides, fonts, assets, name, handleZippingFiles);
        } else {
            message.destroy();
            message.error(`${name} has no available assets to download`);
        }
    };

    return (
        <DocumentTitle title="Brands | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1234">
                    <Box>
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center">
                            <Text hide="mobile" $textVariant="H3" $colorScheme="headline">
                                Brands
                            </Text>
                            <Text hide="desktop" $textVariant="H4" $colorScheme="headline">
                                Brands
                            </Text>
                            {loading ? (
                                <Skeleton $w="179" $h="40" />
                            ) : (
                                <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />} onClick={() => setShowCreate(true)} $mt={['2px', '0']}>
                                    CREATE BRAND
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Box $mt="10" hide="mobile">
                        <Text $textVariant="P4" $colorScheme="secondary">
                            Store all your brand assets in one place.
                        </Text>
                        <Text $textVariant="P4" $colorScheme="secondary">
                            This will help you save time when submitting new requests.
                        </Text>
                    </Box>
                    <Box $mt="40">
                        {loading ? (
                            <Skeleton $w="102" $h="20" />
                        ) : (
                            <>
                                <Text as="span" $textVariant="H6" $pr="6">
                                    Brands
                                </Text>
                                <Badge $variant="Primary" $isEllipse>
                                    <Text $textVariant="SmallTitle">{brands.length}</Text>
                                </Badge>
                            </>
                        )}
                    </Box>
                    <Box $mt="10">
                        <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                            {loading ? (
                                <>
                                    <Skeleton
                                        $h="80"
                                        $flex={{
                                            xs: '1 1 0%',
                                            sm: '1 1 0%',
                                            md: '0 1 47%',
                                            lg: '0 1 307px',
                                            xl: '0 1 340px',
                                            xxl: '0 1 340px',
                                        }}
                                        $w={{ xs: '100%', sm: '100%', md: '47%', lg: '307', xl: '340', xxl: '340' }}
                                        $mx={['0', '10']}
                                        $mb="20"
                                    />
                                    <Skeleton
                                        $h="80"
                                        $flex={{
                                            xs: '1 1 0%',
                                            sm: '1 1 0%',
                                            md: '0 1 47%',
                                            lg: '0 1 307px',
                                            xl: '0 1 340px',
                                            xxl: '0 1 340px',
                                        }}
                                        $w={{ xs: '100%', sm: '100%', md: '47%', lg: '307', xl: '340', xxl: '340' }}
                                        $mx={['0', '10']}
                                        $mb="20"
                                    />
                                    <Skeleton
                                        $h="80"
                                        $flex={{
                                            xs: '1 1 0%',
                                            sm: '1 1 0%',
                                            md: '0 1 47%',
                                            lg: '0 1 307px',
                                            xl: '0 1 340px',
                                            xxl: '0 1 340px',
                                        }}
                                        $w={{ xs: '100%', sm: '100%', md: '47%', lg: '307', xl: '340', xxl: '340' }}
                                        $mx={['0', '10']}
                                        $mb="20"
                                    />
                                    <Skeleton
                                        $h="80"
                                        $flex={{
                                            xs: '1 1 0%',
                                            sm: '1 1 0%',
                                            md: '0 1 47%',
                                            lg: '0 1 307px',
                                            xl: '0 1 340px',
                                            xxl: '0 1 340px',
                                        }}
                                        $w={{ xs: '100%', sm: '100%', md: '47%', lg: '307', xl: '340', xxl: '340' }}
                                        $mx={['0', '10']}
                                        $mb="20"
                                    />
                                </>
                            ) : (
                                brands?.map(brand => (
                                    <CardBrand
                                        {...brand}
                                        key={brand.id}
                                        refetchBrands={refetch}
                                        onClickEdit={() => setEditable(brand)}
                                        onClickDelete={() => setDeletable(brand)}
                                        onClickDownload={() => {
                                            handleDownloadAssets(brand);
                                        }}
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                </PageContainer>
                <Popup
                    open={showCreate}
                    onCancel={() => {
                        setShowCancel(true);
                    }}
                    $variant="default"
                    footer={null}
                    centered
                    width={windowWidth > 768 ? 900 : '100%'}
                    destroyOnClose
                >
                    <FormBrand
                        viewer={viewer}
                        onSuccessSubmit={handleSuccessCreate}
                        onCancel={() => setShowCreate(false)}
                        showCancel={showCancel}
                        setShowCancel={setShowCancel}
                    />
                </Popup>
                <PopupDelete
                    title="Are you sure you want to delete this brand?"
                    $variant="delete"
                    open={deletable !== null}
                    onOk={() => handleDelete(deletable)}
                    onCancel={() => setDeletable(null)}
                    confirmLoading={confirmLoading}
                >
                    <Text $textVariant="P4" $colorScheme="secondary">
                        This action cannot be undone
                    </Text>
                </PopupDelete>
                <Popup
                    open={editable !== null}
                    onCancel={() => setEditable(null)}
                    $variant="default"
                    footer={null}
                    centered
                    width={windowWidth > 768 ? 900 : '100%'}
                    destroyOnClose
                >
                    <FormBrand
                        viewer={viewer}
                        brandId={editable?.id}
                        initialValues={{
                            name: editable?.name,
                            description: toWysiwyg(editable?.description),
                            industry: editable?.industry,
                            website: editable?.website,
                        }}
                        onSuccessSubmit={handleSuccessEdit}
                        onCancel={() => setEditable(null)}
                    />
                </Popup>
            </Basepage>
        </DocumentTitle>
    );
};

export default withResponsive(withLoggedUser(Brands));
