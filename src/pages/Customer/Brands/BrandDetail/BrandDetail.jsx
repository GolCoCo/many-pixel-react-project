import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Dropdown } from 'antd';
import { Link } from '@components/Link';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import IconOptions from '@components/Svg/IconOptions';
import IconOptionsSmall from '@components/Svg/IconOptionsSmall';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import IconDownload from '@components/Svg/IconDownload';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import { Popup, PopupDelete } from '@components/Popup';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import message from '@components/Message';
import { Skeleton } from '@components/Skeleton';
import { toWysiwyg } from '@components/Wysiwyg';
import DocumentTitle from '@components/DocumentTitle';
import withLoggedUser from '@components/WithLoggedUser';
import downloadIcon from '@public/assets/icons/download-primary.svg';
import downloadBrandAsZip from '@utils/downloadBrandAsZip';
import { BRANDS, ACCOUNT_INFO } from '@constants/routes';
import history from '@constants/history';
import { USER_TYPE_CUSTOMER } from '@constants/account';
import { GET_BRAND } from '@graphql/queries/brand';
import { DELETE_BRAND, ADD_NEW_COLOR_TO_BRAND } from '@graphql/mutations/brand';
import FieldAddColor from '../blocks/FieldAddColor.jsx';
import { FieldDetailUpload } from '../blocks/FieldDetailUpload.jsx';
import FormBrand from '../blocks/FormBrand.jsx';

const wrapDangerous = str => ({
    __html: str,
});

const BrandDetail = ({ viewer, match }) => {
    const { loading, data, refetch } = useQuery(GET_BRAND, { variables: { id: match.params.brandId } });
    const [deleteBrand] = useMutation(DELETE_BRAND);
    const [addNewColorToBrand] = useMutation(ADD_NEW_COLOR_TO_BRAND);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleShowEdit = () => {
        setShowEdit(true);
    };

    const handleShowDelete = () => {
        setShowDelete(true);
    };

    const handleChangeColors = async color => {
        const { name, colorValue, type } = color;
        message.destroy();
        message.loading('Adding color...', 50000);

        await addNewColorToBrand({ variables: { name, colorValue, type, brandId: data?.Brand?.id } })
            .then(() => {
                message.destroy();
                message.success('Color has been added');
            })
            .catch(err => {
                console.log(err);
                message.destroy();
                message.error('Error on adding color');
            });
    };

    const handleZippingFiles = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            message.destroy();
        }
    };

    const handleDownloadAssets = () => {
        const { assets, brandGuides, fonts, logos, name } = data?.Brand;

        if ([...assets, ...brandGuides, ...fonts, ...logos].length) {
            message.destroy();
            message.loading(`Downloading all assets...`, 50000);
            downloadBrandAsZip(logos, brandGuides, fonts, assets, name, handleZippingFiles);
        } else {
            message.destroy();
            message.error('No available assets to download');
        }
    };

    const handleSuccessCreate = () => {
        setShowEdit(false);
    };

    const handleDelete = useCallback(async () => {
        message.destroy();
        message.loading('Deleting brand...', 20000);
        setConfirmLoading(true);
        try {
            await deleteBrand({ variables: { id: data.Brand.id } });
            setConfirmLoading(false);
            setShowDelete(false);
            message.destroy();
            message.success('Brand has been deleted.');
            window.location = '/brands';
        } catch (error) {
            console.log(error);
            setConfirmLoading(false);
            message.destroy();
            message.error('Error on deleting brand');
        }
    }, [deleteBrand, data]);

    const displayDescription = () => {
        if (data?.Brand?.description) {
            const nonHTMLmsg = data?.Brand?.description.replace(/(<([^>]+)>)/gi, '');
            if (nonHTMLmsg && nonHTMLmsg.trim()) {
                return data?.Brand?.description;
            }
        }

        return 'N/A';
    };

    const isCustomer = viewer?.role === USER_TYPE_CUSTOMER;

    return (
        <DocumentTitle title={`${data?.Brand ? `${data?.Brand?.name} | ` : ''}ManyPixels`}>
            <Basepage>
                <PageContainer $maxW="1290" style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box $pt="4" hide="mobile">
                        <Button
                            $w="36"
                            $h="36"
                            mobileH="36"
                            type="default"
                            className="ant-btn ant-btn-default"
                            icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            onClick={() => history.goBack()}
                        />
                    </Box>
                    <Box $pl={['0', '20']} $flex={1}>
                        <Box $d="flex" $mb={['30', '0']}>
                            <Box $d="flex" $alignItems="center">
                                <Box $mr="16" hide="desktop">
                                    <Button
                                        $w="36"
                                        $h="36"
                                        mobileH="36"
                                        type="default"
                                        className="ant-btn ant-btn-default"
                                        as={Link}
                                        to={BRANDS}
                                        icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                    />
                                </Box>
                                {loading ? (
                                    <Skeleton $w="239" $h="44" $mb="12" />
                                ) : (
                                    <>
                                        <Text $textVariant="H3" $colorScheme="headline" $mb="12" hide="mobile">
                                            {data?.Brand?.name}
                                        </Text>
                                        <Text $textVariant="H4" $colorScheme="headline" hide="desktop">
                                            {data?.Brand?.name}
                                        </Text>
                                    </>
                                )}
                            </Box>
                            {loading ? (
                                <Skeleton $ml="auto" $w="40" $h="40" />
                            ) : viewer?.role === USER_TYPE_CUSTOMER ? (
                                <>
                                    <Box $ml="auto" hide="mobile">
                                        <Dropdown
                                            trigger={['click']}
                                            overlay={
                                                <DropdownMenu $mt="2">
                                                    <DropdownMenuItem key="edit" onClick={handleShowEdit}>
                                                        <DropdownMenuItemContent icon={<IconEdit />}>Edit</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem key="delete" onClick={handleShowDelete}>
                                                        <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem key="download" onClick={handleDownloadAssets}>
                                                        <DropdownMenuItemContent icon={<IconDownload />}>Download all brand assets</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                </DropdownMenu>
                                            }
                                        >
                                            <Button hasDropDown type="default" icon={<IconOptions style={{ fontSize: 20 }} />} $w="40" />
                                        </Dropdown>
                                    </Box>
                                    <Box $ml="auto" hide="desktop">
                                        <Dropdown
                                            trigger={['click']}
                                            overlay={
                                                <DropdownMenu $mt="2">
                                                    <DropdownMenuItem key="edit" onClick={handleShowEdit}>
                                                        <DropdownMenuItemContent icon={<IconEdit />}>Edit</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem key="delete" onClick={handleShowDelete}>
                                                        <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem key="download" onClick={handleDownloadAssets}>
                                                        <DropdownMenuItemContent icon={<IconDownload />}>Download all brand assets</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                </DropdownMenu>
                                            }
                                        >
                                            <Button hasDropDown type="default" icon={<IconOptionsSmall />} $w="34" />
                                        </Dropdown>
                                    </Box>
                                </>
                            ) : (
                                <Box $ml="auto" $d="flex" $alignItems="center" $cursor="pointer" onClick={handleDownloadAssets}>
                                    <img src={downloadIcon} alt="download icon" />
                                    <Text $textVariant="H6" $colorScheme="cta" $ml="8">
                                        Download all brand assets
                                    </Text>
                                </Box>
                            )}
                        </Box>
                        {loading ? (
                            <Skeleton $w="172" $h="16" $mb="30" />
                        ) : (
                            <Box hide="mobile">
                                <Breadcrumb $mb="30">
                                    <BreadcrumbItem
                                        isFirst
                                        as={Link}
                                        to={
                                            viewer?.role === USER_TYPE_CUSTOMER
                                                ? BRANDS
                                                : {
                                                      pathname: `${ACCOUNT_INFO.replace(':id?', data?.Brand?.company?.id)}`,
                                                      search: '?tab=brands',
                                                  }
                                        }
                                    >
                                        Brands
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>{data?.Brand?.name}</BreadcrumbItem>
                                </Breadcrumb>
                            </Box>
                        )}
                        <Box $mb="30">
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Skeleton $w="172" $h="16" />
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                        Industry
                                    </Text>
                                    <Text $textVariant="P3">{data?.Brand?.industry ?? 'N/A'}</Text>
                                </>
                            )}
                        </Box>
                        <Box $mb="30">
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Skeleton $w="100%" $h="16" $mb="4" />
                                    <Skeleton $w="260" $h="16" />
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                        Description
                                    </Text>
                                    <Text $textVariant="P3" dangerouslySetInnerHTML={wrapDangerous(displayDescription())} />
                                </>
                            )}
                        </Box>
                        <Box $mb="30">
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Skeleton $w="172" $h="16" />
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                        Website
                                    </Text>
                                    {data?.Brand?.website ? (
                                        <Text as="a" href={data?.Brand?.website} target="_blank" $textVariant="P3" rel="noopener noreferrer">
                                            {data?.Brand?.website}
                                        </Text>
                                    ) : (
                                        <Text $textVariant="P3">N/A</Text>
                                    )}
                                </>
                            )}
                        </Box>
                        <Box $mb={['14', '10']}>
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Box $d="flex" $flexWrap="wrap" $mx="-10">
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="60" $mx="10" $mb={['16', '20']} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                        Colors
                                    </Text>
                                    <FieldAddColor
                                        brandData={data?.Brand}
                                        value={data?.Brand?.colors}
                                        onBrandDetailChange={handleChangeColors}
                                        cardWidth="224"
                                        isCustomer={isCustomer}
                                        refetch={refetch}
                                    />
                                </>
                            )}
                        </Box>
                        <Box $mb={['14', '10']}>
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Box $spaceRight={['0', '20']} $d="flex" $gap="20px" $flexWrap="wrap">
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '24']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '24']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '24']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '24']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '24']} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="9">
                                        Logos
                                    </Text>
                                    <FieldDetailUpload
                                        brandData={data?.Brand}
                                        value={data?.Brand?.logos ?? []}
                                        label="Add logo"
                                        fileCategory="logo"
                                        isCustomer={isCustomer}
                                    />
                                </>
                            )}
                        </Box>
                        <Box $mb={['14', '10']}>
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="10" />
                                    <Box $spaceRight={['0', '20']} $d="flex" $gap="20px" $flexWrap="wrap">
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '26']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '26']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '26']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '26']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '26']} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="9">
                                        Brand guides
                                    </Text>
                                    <FieldDetailUpload
                                        brandData={data?.Brand}
                                        value={data?.Brand?.brandGuides ?? []}
                                        label="Add brand guide"
                                        fileCategory="guide"
                                        isCustomer={isCustomer}
                                    />
                                </>
                            )}
                        </Box>
                        <Box $mb={['14', '10']}>
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="5" />
                                    <Box $spaceRight={['0', '20']} $d="flex" $gap="20px" $flexWrap="wrap">
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '21']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '21']} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="5">
                                        Fonts
                                    </Text>
                                    <Text $textVariant="P4" $colorScheme="secondary" $mb="10">
                                        Only files with .zip, .ttf, .otf format are allowed.
                                    </Text>
                                    <FieldDetailUpload
                                        brandData={data?.Brand}
                                        value={data?.Brand?.fonts ?? []}
                                        label="Add font"
                                        accept=".zip, .ttf, .otf"
                                        fileCategory="font"
                                        isCustomer={isCustomer}
                                    />
                                </>
                            )}
                        </Box>
                        <Box $mb={['14', '10']}>
                            {loading ? (
                                <>
                                    <Skeleton $w="83" $h="20" $mb="5" />
                                    <Skeleton $w="100%" $maxW="722" $h="16" $mb="10" />
                                    <Box $spaceRight={['0', '20']} $d="flex" $gap="20px" $flexWrap="wrap">
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '20']} />
                                        <Skeleton $w={['100%', '224']} $h="164" $mb={['16', '20']} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Text $textVariant="H5" $colorScheme="primary" $mb="5">
                                        Extra assets
                                    </Text>
                                    <Text $textVariant="P4" $colorScheme="secondary" $mb="10">
                                        Upload any assets that might be revelant to your brand. This could include other type of graphics, templates, documents,
                                        etc.
                                    </Text>
                                    <FieldDetailUpload
                                        brandData={data?.Brand}
                                        value={data?.Brand?.assets ?? []}
                                        label="Add extra asset"
                                        fileCategory="asset"
                                        isCustomer={isCustomer}
                                    />
                                </>
                            )}
                        </Box>
                    </Box>
                </PageContainer>
                <Popup open={showEdit} onCancel={() => setShowEdit(false)} $variant="default" footer={null} centered width={900} destroyOnClose>
                    <FormBrand
                        viewer={viewer}
                        brandId={data?.Brand?.id}
                        initialValues={{
                            name: data?.Brand?.name,
                            industry: data?.Brand?.industry,
                            description: toWysiwyg(data?.Brand?.description),
                            website: data?.Brand?.website,
                        }}
                        onCancel={() => setShowEdit(false)}
                        onSuccessSubmit={handleSuccessCreate}
                    />
                </Popup>
                <PopupDelete
                    title="Are you sure you want to delete this brand?"
                    $variant="delete"
                    open={showDelete}
                    onOk={handleDelete}
                    onCancel={() => setShowDelete(false)}
                    confirmLoading={confirmLoading}
                >
                    <Text $textVariant="P4" $colorScheme="secondary">
                        This action cannot be undone
                    </Text>
                </PopupDelete>
            </Basepage>
        </DocumentTitle>
    );
};

export default withLoggedUser(BrandDetail);
