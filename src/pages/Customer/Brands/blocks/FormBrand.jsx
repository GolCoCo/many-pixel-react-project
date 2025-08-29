import React, { forwardRef, useCallback, useState } from 'react';
import { Form } from '@components/Form';
import { useMutation } from '@apollo/client';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { toHtml, Wysiwyg } from '@components/Wysiwyg';
import { Uploader } from '@components/Uploader';
import { Select } from '@components/Select';
import { Input } from '@components/Input';
import message from '@components/Message';
import { INDUSTRIES } from '@constants/forms';
import { UPDATE_BRAND, CREATE_BRAND, ADD_NEW_COLORS_TO_BRAND } from '@graphql/mutations/brand';
import { UPLOAD_FILES } from '@graphql/mutations/file';
import { USER_TYPE_CUSTOMER } from '@constants/account';
import FieldAddColor from './FieldAddColor';
import PopupCancel from './PopupCancel';

const { Option } = Select;

const FormBrand = forwardRef(({ brandId, initialValues = {}, onSuccessSubmit, onCancel, viewer, showCancel, setShowCancel }, ref) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const name = Form.useWatch('name', form);
    const [updateBrand] = useMutation(UPDATE_BRAND);
    const [createBrand] = useMutation(CREATE_BRAND);
    const [uploadFiles] = useMutation(UPLOAD_FILES);
    const [addNewColorsToBrand] = useMutation(ADD_NEW_COLORS_TO_BRAND);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = useCallback(() => {
        validateFields().then(async values => {
            if (!isLoading) {
                message.destroy();
                message.loading(`${brandId ? 'Updating' : 'Creating'} brand...`, 50000);
                setIsLoading(true);

                try {
                    const description = toHtml(values.description);
                    if (brandId) {
                        await updateBrand({
                            variables: {
                                id: brandId,
                                name: values.name,
                                industry: values.industry,
                                description,
                                website: values.website,
                            },
                        })
                            .then(async () => {
                                await onSuccessSubmit();
                                message.destroy();
                                message.success('Brand has been updated');
                            })
                            .catch(err => {
                                console.log(err);
                                message.destroy();
                                message.error('Error on updating brand');
                            });
                    } else {
                        await createBrand({
                            variables: {
                                name: values.name,
                                industry: values.industry,
                                description,
                                website: values.website,
                            },
                        })
                            .then(async ({ data }) => {
                                const { createBrand: created } = data;
                                let uploadedLogoIds;
                                let uploadedGuideIds;
                                let uploadedFontIds;
                                let uploadedAssetIds;

                                if (values.colors && values.colors.length) {
                                    message.destroy();
                                    message.loading('Adding colors...', 50000);

                                    const colorsToAdd = values.colors.map(color => ({
                                        ...color,
                                        hex: color.colorValue,
                                        brandId: created.id,
                                    }));

                                    await addNewColorsToBrand({
                                        variables: { colors: colorsToAdd },
                                    })
                                        .then(() => {})
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on adding colors');
                                        });
                                }

                                if (values.logos && values.logos.length) {
                                    message.destroy();
                                    message.loading('Uploading logos...', 50000);

                                    await uploadFiles({ variables: { files: values.logos } })
                                        .then(({ data: res }) => {
                                            uploadedLogoIds = res?.uploadFiles.map(uploaded => uploaded.id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on uploading logos');
                                        });
                                }

                                if (values.guides && values.guides.length) {
                                    message.destroy();
                                    message.loading('Uploading brand guides...', 50000);

                                    await uploadFiles({ variables: { files: values.guides } })
                                        .then(({ data: res }) => {
                                            uploadedGuideIds = res?.uploadFiles.map(uploaded => uploaded.id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on uploading brand guides');
                                        });
                                }

                                if (values.fonts && values.fonts.length) {
                                    message.destroy();
                                    message.loading('Uploading fonts...', 50000);

                                    await uploadFiles({ variables: { files: values.fonts } })
                                        .then(({ data: res }) => {
                                            uploadedFontIds = res?.uploadFiles.map(uploaded => uploaded.id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on uploading fonts');
                                        });
                                }

                                if (values.assets && values.assets.length) {
                                    message.destroy();
                                    message.loading('Uploading assets...', 50000);

                                    await uploadFiles({ variables: { files: values.assets } })
                                        .then(({ data: res }) => {
                                            uploadedAssetIds = res?.uploadFiles.map(uploaded => uploaded.id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on uploading assets');
                                        });
                                }

                                if (uploadedLogoIds || uploadedGuideIds || uploadedFontIds || uploadedAssetIds) {
                                    message.destroy();
                                    message.loading('Finalizing...', 50000);

                                    await updateBrand({
                                        variables: {
                                            id: created.id,
                                            name: values.name,
                                            industry: values.industry,
                                            description,
                                            website: values.website,
                                            logosIds: uploadedLogoIds || undefined,
                                            guideIds: uploadedGuideIds || undefined,
                                            fontsIds: uploadedFontIds || undefined,
                                            assetsIds: uploadedAssetIds || undefined,
                                        },
                                    })
                                        .then(async () => {
                                            await onSuccessSubmit(created);
                                            message.destroy();
                                            message.success('Brand added successfully');
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.destroy();
                                            message.error('Error on creating brand');
                                        });
                                } else {
                                    await onSuccessSubmit(created);
                                    message.destroy();
                                    message.success('Brand added successfully');
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                message.destroy();
                                message.error('Error on creating brand');
                            });
                    }

                    setIsLoading(false);
                } catch (e) {
                    setIsLoading(false);
                }
            }
        });
    }, [isLoading, validateFields, brandId, updateBrand, createBrand, onSuccessSubmit, uploadFiles, addNewColorsToBrand]);

    const isEdit = !!brandId;

    return (
        <Box>
            <PopupCancel visible={showCancel} setShowCancel={setShowCancel} onCancel={onCancel} />
            <Text $textVariant="H4" $mb="20" $colorScheme="primary">
                {isEdit ? 'Edit' : 'Create'} Brand
            </Text>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="brandForm"
                initialValues={{
                    name: initialValues.name,
                    industry: initialValues.industry || undefined,
                    description: initialValues.description,
                    website: initialValues.website,
                }}
            >
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Please enter brand name',
                        },
                    ]}
                    name="name"
                    validateTrigger="onBlur"
                    label="Brand name"
                    colon={false}
                    required={false}
                >
                    <Input placeholder="Give your brand a name" />
                </Form.Item>
                <Form.Item validateTrigger="onBlur" name="industry" label="Industry" colon={false} required={false}>
                    <Select style={{}} placeholder="Select industry">
                        {INDUSTRIES.map(({ industry, value }) => (
                            <Option value={value} key={value}>
                                {industry}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Description" colon={false} required={false}>
                    <Text $textVariant="P4" $colorScheme="secondary" $mb="16">
                        Tell us more. What product or service does it provide? Who is the target audience? What is special about it?
                    </Text>
                    <Form.Item name="description" style={{ margin: '0' }}>
                        <Wysiwyg placeholder="Enter your brand description here" $contentMinHeight="199px" disableEnterKey={false} />
                    </Form.Item>
                </Form.Item>
                <Form.Item name="website" label="Website" colon={false} required={false}>
                    <Input placeholder="www.example.com" />
                </Form.Item>
                {!isEdit && (
                    <>
                        <Form.Item name="colors" label="Brand colors" colon={false} required={false}>
                            <FieldAddColor isCustomer={viewer?.role === USER_TYPE_CUSTOMER} />
                        </Form.Item>
                        <Box $mt={['-16', '0']}>
                            <Form.Item name="logos" label="Logos" colon={false} required={false}>
                                <Uploader listType="picture" multiple />
                            </Form.Item>
                        </Box>
                        <Form.Item name="guides" label="Brand guides" colon={false} required={false}>
                            <Uploader listType="picture" multiple />
                        </Form.Item>
                        <Form.Item name="fonts" label="Fonts" colon={false} required={false}>
                            <Text $textVariant="P4" $colorScheme="secondary" $mt="-5" $mb="10">
                                Only files with .zip, .ttf, .otf format are allowed.
                            </Text>
                            <Uploader listType="picture" multiple accept=".zip, .ttf, .otf" />
                        </Form.Item>
                        <Form.Item name="assets" label="Extra assets" colon={false} required={false}>
                            <Uploader listType="picture" multiple />
                        </Form.Item>
                    </>
                )}
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                        <Button type="default" $mr="20" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button disabled={!name} type="primary" htmlType="submit" loading={isLoading}>
                            {isEdit ? 'Update' : 'Create Brand'}
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Box>
    );
});

export default FormBrand;
