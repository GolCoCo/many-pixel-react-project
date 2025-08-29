import React, { forwardRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Row } from 'antd';
import { Select } from '@components/Select';
import { Text } from '@components/Text';
import { Popup } from '@components/Popup';
import FormBrand from '@pages/Customer/Brands/blocks/FormBrand';
import { CUSTOMER_BRANDS } from '@graphql/queries/user';
import { Box } from '@components/Box';
import Avatar from '@components/Avatar';
import nb from '@public/assets/icons/brokenImage.svg';

export const FieldBrand = forwardRef(({ value, onChange, viewer, windowWidth, activePopup, showPopup }, ref) => {
    const { data, loading, refetch } = useQuery(CUSTOMER_BRANDS, {
        variables: { id: viewer.id },
    });
    const [showCancel, setShowCancel] = useState(false);
    const brands = data?.User?.company?.brands || [];

    const handleSuccessCreate = async newBrand => {
        await refetch();
        showPopup(false);
        if (newBrand?.id && onChange) {
            onChange(newBrand.id);
        }
    };

    return (
        <>
            <Row>
                {!loading && Array.isArray(brands) && brands.length > 0 && (
                    <Select style={{ fontWeight: '300', width: '100%' }} placeholder="Select brand" value={value || null} onChange={onChange}>
                        <Select.Option key={'noBrand'} value={null}>
                            <Box $d="flex" $alignItems="center" $px="0" $minH="35px">
                                <Avatar
                                    src={nb}
                                    name="No brand"
                                    size={24}
                                    style={{
                                        marginRight: '16px',
                                        padding: '3px',
                                    }}
                                    $fontSize={14}
                                />
                                <Text $textVariant="Badge" $maxW="180" $isTruncate>
                                    No brand
                                </Text>
                            </Box>
                        </Select.Option>
                        {brands.map(brand => (
                            <Select.Option key={brand.id} value={brand.id}>
                                <Box $d="flex" $alignItems="center" $px="0">
                                    <Avatar
                                        src={brand.logos && brand.logos[0]?.url ? brand.logos[0].url : nb}
                                        name={brand.name}
                                        size={24}
                                        $fontSize={14}
                                        style={{ marginRight: '16px', padding: brand.logos && brand.logos[0]?.url ? 'initial' : '3px' }}
                                    />
                                    <Text $textVariant="Badge" $maxW="180" $isTruncate>
                                        {brand.name}
                                    </Text>
                                </Box>
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Row>
            <Popup
                open={activePopup}
                onCancel={() => setShowCancel(true)}
                $variant="default"
                footer={null}
                centered
                width={windowWidth > 768 ? 900 : '100%'}
                destroyOnClose
            >
                <FormBrand
                    viewer={viewer}
                    onSuccessSubmit={handleSuccessCreate}
                    onCancel={() => showPopup(false)}
                    showCancel={showCancel}
                    setShowCancel={setShowCancel}
                />
            </Popup>
        </>
    );
});
