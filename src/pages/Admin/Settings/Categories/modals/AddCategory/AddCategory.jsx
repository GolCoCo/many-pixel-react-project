import React, { useState, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';
import ProductsField from '@pages/Admin/Settings/Plans/blocks/ProductsField';
import { ALL_ACTIVATED_SERVICES } from '@graphql/queries/service';
import { UPLOAD_FILE } from '@graphql/mutations/file';
import CategoryImageUploader from '../../blocks/CategoryImageUploader';
import { isEmpty } from 'lodash';

const AddCategory = memo(({ visible, onCancel, onAdd, refetchCategories }) => {
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const { loading, data } = useQuery(ALL_ACTIVATED_SERVICES, {
        fetchPolicy: 'network-only',
    });
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const [isLoading, setIsLoading] = useState(false);

    const onCloseModal = () => {
        resetFields();
        onCancel();
    };

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                try {
                    if (!isEmpty(values.categoryImage) && values.categoryImage !== 'notchanged') {
                        message.destroy();
                        message.loading('Adding category...', 50000);
                        await uploadFile({ variables: { file: values.categoryImage } })
                            .then(async ({ data }) => {
                                await onAdd({
                                    title: values.title,
                                    servicesIds: values.services,
                                    categoryImageId: data.uploadFile.id,
                                    position: parseInt(values?.position || 0),
                                });
                                message.destroy();
                                message.success('Category successfully added');
                                await refetchCategories();
                                resetFields();
                                setIsLoading(false);
                                onCancel();
                                return true;
                            })
                            .catch(err => {
                                console.log(err);
                                setIsLoading(false);
                                message.destroy();
                                message.error('Error on uploading your image');
                                return false;
                            });
                    }
                } catch (e) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(e);
                    return false;
                }
            }
        });
    }, [isLoading, validateFields, onAdd, onCancel, refetchCategories, uploadFile, resetFields]);

    return (
        <Popup $variant="default" width={900} title="Add category" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
            <Form onFinish={handleSubmit} name="addCategoryForm" form={form}>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name="title"
                    label="Name"
                    colon={false}
                    form={form}
                    required={true}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>
                <Form.Item
                    name="services"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    label="Associated products"
                    colon={false}
                    required={true}
                >
                    <ProductsField loading={loading} data={data} />
                </Form.Item>
                <Form.Item
                    name="position"
                    label="Position"
                    colon={false}
                    required
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input type="number" placeholder="Enter category position" />
                </Form.Item>
                <Form.Item
                    name="categoryImage"
                    rules={[
                        {
                            required: true,
                            message: 'Please upload an image',
                        },
                    ]}
                    label="Category image"
                    colon={false}
                    required={true}
                >
                    <CategoryImageUploader />
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default AddCategory;
