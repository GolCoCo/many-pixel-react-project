import React, { forwardRef, useState, useEffect } from 'react';
import { Upload } from 'antd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import Icon, { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const ProductImageUploader = forwardRef(({ previewImageUrl, onChange, isEdit }, ref) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setImageUrl(previewImageUrl || null);
    }, [previewImageUrl]);

    const handleChange = info => {
        setIsLoading(true);
        getBase64(info.file.originFileObj, url => {
            setIsLoading(false);
            setImageUrl(url);
            onChange(info.file.originFileObj);
        });
    };

    const uploadButton = (
        <Box>
            <Icon component={isLoading ? LoadingOutlined : PlusOutlined} style={{ fontSize: 27, color: '#8C8C8C' }} />
            <Text $textVariant="P4" $colorScheme="#595959" $mt="11">
                Upload
            </Text>
        </Box>
    );

    return (
        <Box $d="flex" $alignItems="center" $mb="-8">
            <Box $w="112">
                <Upload listType="picture-card" accept="image/*" showUploadList={false} onChange={handleChange}>
                    {!isLoading && imageUrl ? <Box as="img" src={imageUrl} alt="avatar" $w="100%" $h="auto" /> : uploadButton}
                </Upload>
            </Box>
            {isEdit && (
                <Text $ml="8" $mt="-8" $textVariant="P4" $colorScheme="secondary">
                    Click on the image to change
                </Text>
            )}
        </Box>
    );
});

export default ProductImageUploader;
