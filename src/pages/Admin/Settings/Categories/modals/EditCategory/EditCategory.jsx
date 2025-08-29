import React, { useState, memo, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import indexOf from 'lodash/indexOf';
import remove from 'lodash/remove';
import compact from 'lodash/compact';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';
import ProductsField from '@pages/Admin/Settings/Plans/blocks/ProductsField';
import { ALL_ACTIVATED_SERVICES } from '@graphql/queries/service';
import { UPLOAD_FILE, DELETE_FILE } from '@graphql/mutations/file';
import CategoryImageUploader from '../../blocks/CategoryImageUploader';
import isEmpty from 'lodash/isEmpty';

const EditCategory = memo(({ visible, onCancel, onEdit, refetchCategories, selectedData }) => {
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [servicesIdsToDisconnect, setServicesIdsToDisconnect] = useState([]);
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const [deleteFile] = useMutation(DELETE_FILE);

    useEffect(() => {
        // Reset form values when selectedData changes
        if (selectedData) {
            const servicesIdsData = selectedData?.services?.map(service => service.id);
            form.setFieldsValue({
                title: selectedData?.title,
                services: servicesIdsData,
                position: selectedData?.position !== null ? selectedData?.position : 0,
                categoryImage: 'notchanged',
            });
        }
    }, [selectedData, form]);

    const { loading, data } = useQuery(ALL_ACTIVATED_SERVICES, {
        fetchPolicy: 'network-only',
    });

    const onCloseModal = () => {
        resetFields();
        onCancel();
    };

    const handleRemoveProduct = val => {
        if (indexOf(servicesIdsData, val) > -1) {
            setServicesIdsToDisconnect([...servicesIdsToDisconnect, val]);
        }
    };

    const handleUnremoveProduct = val => {
        if (indexOf(servicesIdsToDisconnect, val) > -1) {
            remove(servicesIdsToDisconnect, n => n === val);
        }
    };

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                try {
                    if (!isEmpty(values.categoryImage) && values.categoryImage !== 'notchanged') {
                        message.destroy();
                        message.loading('Updating category...', 50000);
                        await uploadFile({ variables: { file: values.categoryImage } })
                            .then(async ({ data }) => {
                                await deleteFile({ variables: { id: selectedData?.icon?.id } });
                                await onEdit({
                                    title: values.title,
                                    servicesIds: values.services,
                                    servicesIdsToDisconnect: servicesIdsToDisconnect?.length ? servicesIdsToDisconnect : null,
                                    categoryImageId: data.uploadFile.id,
                                    position: parseInt(values?.position || 0),
                                });
                                message.destroy();
                                message.success('Category has been updated');
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
                    } else {
                        message.destroy();
                        message.loading('Updating category...', 50000);

                        await onEdit({
                            title: values.title,
                            servicesIds: values.services,
                            servicesIdsToDisconnect,
                            categoryImageId: null,
                            position: parseInt(values?.position || 0),
                        });
                        message.destroy();
                        message.success('Category has been updated');
                        await refetchCategories();
                        resetFields();
                        setIsLoading(false);
                        onCancel();
                        return true;
                    }
                } catch (e) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(e);
                    return false;
                }
            }
        });
    }, [isLoading, validateFields, onEdit, onCancel, refetchCategories, resetFields, servicesIdsToDisconnect, uploadFile, deleteFile, selectedData]);

    const servicesIdsData = compact(selectedData?.services && selectedData?.services?.length > 0 && selectedData?.services.map(service => service.id));

    return (
        <Popup $variant="default" width={900} title="Edit category" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="editCategoryForm"
                initialValues={{
                    title: selectedData?.title,
                    services: servicesIdsData,
                    position: selectedData?.position !== null ? selectedData?.position : 0,
                    categoryImage: 'notchanged',
                }}
            >
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
                    required={true}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>
                <Form.Item name="services" label="Associated products" colon={false} required={false}>
                    <ProductsField loading={loading} data={data} onRemoveProduct={handleRemoveProduct} onUnremoveProduct={handleUnremoveProduct} />
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
                    rules={[
                        {
                            required: true,
                            message: 'Please upload an image',
                        },
                    ]}
                    name="categoryImage"
                    label="Category image"
                    colon={false}
                    required={false}
                >
                    <CategoryImageUploader isEdit previewImageUrl={selectedData?.icon?.url} />
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default EditCategory;
