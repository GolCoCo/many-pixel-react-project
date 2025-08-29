import React from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { CardBrand } from '@pages/Customer/Brands/blocks/CardBrand';
import { EmptyData } from '@components/EmptyData';

const BrandsTab = ({ company }) => {
    return (
        <Box $mt="30">
            <Text $textVariant="H5" $mb="20">
                Brands
            </Text>
            {company?.brands?.length > 0 ? (
                <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-10']}>
                    {company?.brands?.map(brand => (
                        <CardBrand {...brand} key={brand.id} canEdit={false} />
                    ))}
                </Box>
            ) : (
                <EmptyData />
            )}
        </Box>
    );
};

export default BrandsTab;
