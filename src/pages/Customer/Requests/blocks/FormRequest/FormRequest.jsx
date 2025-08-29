import React, { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import find from 'lodash/find';
import { useQuery } from '@apollo/client';
import { Form } from '@components/Form';
import IconAdd from '@components/Svg/IconAdd';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Button } from '@components/Button';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import { Link } from '@components/Link';
import { REQUESTS } from '@constants/routes';
import { Prompt } from '@components/Prompt';
import { Popup } from '@components/Popup';
import { Input } from '@components/Input';
import { ORDER_STATUS_DRAFT } from '@constants/order';
import { ALL_CATEGORIES } from '@graphql/queries/category';
import { withResponsive } from '@components/ResponsiveProvider';
import IconQuestions from '@components/Svg/IconQuestions';
import { Wysiwyg, toWysiwyg } from '@components/Wysiwyg';
import { Uploader } from '@components/Uploader';
import { Skeleton } from '@components/Skeleton/index';
import { FieldBrand } from './FieldBrand';
import { FieldCategoryRequest } from './FieldCategoryRequest';
import { FieldProductRequest } from './FieldProductRequest';
import { FieldDeliverableRequest } from './FieldDeliverableRequest';
import ResponseRequest from './ResponseRequest';
import SideNoteForm from './SideNoteForm';
import { PopupCancelRequest } from './PopupCancelRequest';
import { FieldOrderQuestion } from './FieldOrderQuestion';

const texts = [
    'Clear description of what you want',
    'How/where design will be used',
    '3-4 concepts that you like',
    'What you like from the concepts provided',
    'Dimensions',
    'Color preferences',
    'Design copywriting',
    'Number of design',
];

const FormRequest = memo(
    ({
        isEdit,
        onSubmit,
        paging,
        initialValues = {},
        title,
        submitText,
        breadcrumbLabel,
        refetch,
        viewer,
        windowWidth,
        isDuplicate,
        handleChangeAttachments,
        handleChangeAttachmentsToDisconnect,
        afterSubmit,
    }) => {
        const [form] = Form.useForm();
        const productRef = useRef();
        const otherDeliverablesRef = useRef();
        const [activePopup, showPopup] = useState(false);
        const [hasSubmitted, setHasSubmited] = useState(false);
        const [saveType, setSaveType] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [category, setCategory] = useState();
        const [isFilled, setIsFilled] = useState(false);
        const [hasSelectedOtherDeliverables, setHasSelectedOtherDeliverables] = useState(false);
        const [showUpgrade, setShowUpgrade] = useState(false);
        const { validateFields, setFieldsValue, resetFields } = form;
        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);

        const { data, loading } = useQuery(ALL_CATEGORIES, {
            variables: {
                where: {
                    isActivated: true,
                },
                orderBy: { position: 'Asc' },
            },
            fetchPolicy: 'cache-first',
        });

        const requestName = Form.useWatch('name', form);
        const service = Form.useWatch('serviceId', form);
        const categ = Form.useWatch('categoryId', form);
        const chosenProductId = Form.useWatch('serviceId', form);
        const description = Form.useWatch('description', form);
        const serviceId = Form.useWatch('serviceId', form);
        const categoryId = Form.useWatch('categoryId', form);
        const name = Form.useWatch('name', form);
        const deliverables = Form.useWatch('deliverables', form);
        const otherDeliverables = Form.useWatch('otherDeliverables', form);

        useEffect(() => {
            setIsFilled(!!requestName && !!service && !!categ);
        }, [requestName, service, categ]);

        const handleSetIsFilled = bool => {
            setIsFilled(bool);
        };

        const handleChangeCategory = selectedCategory => {
            setCategory(selectedCategory);

            if (selectedCategory) {
                window.scrollTo({ top: productRef.current.offsetTop, behavior: 'smooth' });
            }
        };

        // Take only the categories that has some product to choose from
        const allCategories = useMemo(() => data?.allCategories?.filter(c => c?.services?.length > 0) ?? [], [data]);

        const questions = useMemo(() => {
            if (!categoryId || !serviceId || !allCategories?.length) {
                return [];
            }

            const foundCategory = allCategories.find(cat => cat.id === categoryId);
            if (!foundCategory) {
                return [];
            }
            const foundService = category.services?.find(v => v.id === serviceId);
            if (!foundService) {
                return [];
            }
            return foundService?.questions ?? [];
        }, [serviceId, categoryId, allCategories]);

        const handleSubmit = useCallback(
            async values => {
                validateFields().then(async ({ questions: answers, ...rest }) => {
                    const orderQuestions = questions
                        .filter(que => que.answerType !== 'UPLOAD_FILES' && que.answerType !== 'IMG_SELECT')
                        .map((qtn, index) => ({
                            type: qtn.answerType,
                            answer: answers?.[index] || '',
                            question: qtn.title,
                        }));

                    const submitValues = {
                        ...rest,
                        orderQuestions,
                    };

                    if (!isSubmitting) {
                        setSaveType(rest.type ?? 'SUBMITTED');
                        setIsSubmitting(true);
                        await onSubmit(submitValues);
                        setIsSubmitting(false);
                        setHasSubmited(true);
                        resetFields();
                        if (afterSubmit) {
                            afterSubmit();
                        }
                    }
                });
            },
            [validateFields, onSubmit, resetFields, afterSubmit, isSubmitting, questions]
        );

        const handleSaveAsDraft = useCallback(() => {
            setFieldsValue({
                type: ORDER_STATUS_DRAFT,
            });
            handleSubmit();
        }, [handleSubmit, setFieldsValue]);

        const handlePromptOkay = useCallback(() => {
            if (!isEdit) {
                handleSaveAsDraft();
            }
        }, [handleSaveAsDraft, isEdit]);

        const handleAfterPromptOkay = useCallback((confirm, closeModal) => {
            confirm();
        }, []);

        const handleAfterPromptCancel = useCallback(
            (confirm, closeModal) => {
                if (isEdit) {
                    closeModal();
                } else {
                    confirm();
                }
            },
            [isEdit]
        );

        const initialCategoryId = useMemo(() => initialValues.categoryId ?? undefined, [initialValues]);
        useEffect(() => {
            if (initialCategoryId) {
                const foundCategory = allCategories.find(item => item.id === initialCategoryId);
                setCategory(foundCategory);
            }
        }, [initialCategoryId, allCategories]);

        const descriptionHasText = description ? description.trim().length > 0 : false;

        const enableNext = name && descriptionHasText && serviceId && categoryId;

        const enableSubmitDeliverables = deliverables && deliverables?.length;
        const hasOtherDeliverables = deliverables && deliverables?.length > 0 && deliverables?.includes('OTHERS');

        const enableSubmit = hasOtherDeliverables ? enableSubmitDeliverables && otherDeliverables : enableSubmitDeliverables;

        useEffect(() => {
            if (hasOtherDeliverables && hasSelectedOtherDeliverables) {
                window.scrollTo({ top: otherDeliverablesRef.current.offsetTop, behavior: 'smooth' });
            }
        }, [hasOtherDeliverables, hasSelectedOtherDeliverables]);

        const handleSelectDeliverable = val => {
            setHasSelectedOtherDeliverables(val?.length > 0 && val?.includes('OTHERS'));
        };

        const chosenProduct = chosenProductId ? find(category?.services, ['id', chosenProductId]) : null;
        const chosenProductDeliverables = chosenProduct?.deliverables ?? null;

        // if (loading) {
        //     return (<Basepage>
        //         <PageContainer $pl="15px" $pr="15px" $maxW="920">
        //             <Box $mb="16">
        //                 <Box $d="flex" $justifyContent="space-between">
        //                     <Box $flex="1" $mr="20">
        //                         <Skeleton $maxW="881" $w="100%" $h="44" $mb="12" />
        //                         <Skeleton $h="20" $w="201" />
        //                     </Box>
        //                     <Skeleton $w="104" $h="32" />
        //                 </Box>
        //             </Box>
        //         </PageContainer>
        //     </Basepage>)
        // }

        return (
            <>
                <Basepage>
                    <PageContainer $pl="15px" $pr="15px" $maxW="920">
                        <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb={windowWidth > 720 ? ['30', '12'] : '24'}>
                            <Box $d="flex" $alignItems="center">
                                {/* {title === 'Create Request' && (
                                    <Box hide ='mobile' $d="inline-flex" $pr="20">
                                        <Button
                                            $w="36"
                                            $h="36"
                                            mobileH="36"
                                            type="default"
                                            className="ant-btn ant-btn-default"
                                            as={Link}
                                            to={REQUESTS}
                                            icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                                        />
                                    </Box>
                                )} */}

                                <Text hide="mobile" $textVariant="H3">
                                    {title}
                                </Text>
                                <Text hide="desktop" $textVariant="H4">
                                    {title}
                                </Text>
                            </Box>
                            {!isEdit && (
                                <>
                                    <Box hide="mobile">
                                        <Button loading={isSubmitting} type="default" disabled={!isFilled} onClick={handleSaveAsDraft}>
                                            Save As Draft
                                        </Button>
                                    </Box>
                                    {/* <Box hide="desktop">
                                        <Button
                                            type="default"
                                            icon={<IconSaveAsDraft />}
                                            disabled={!isFilled}
                                            onClick={handleSaveAsDraft}
                                        />
                                    </Box> */}
                                </>
                            )}
                        </Box>
                        <Box hide="mobile">
                            <Breadcrumb>
                                <BreadcrumbItem isFirst as={Link} to={REQUESTS}>
                                    Requests
                                </BreadcrumbItem>
                                <BreadcrumbItem>{breadcrumbLabel}</BreadcrumbItem>
                            </Breadcrumb>
                        </Box>
                        {loading ? (
                            <MySkeleton />
                        ) : (
                            <Box $mt={['8', '30']}>
                                <Form
                                    onFinish={handleSubmit}
                                    name="requestFormC"
                                    form={form}
                                    initialValues={{
                                        name: initialValues.name,
                                        brandId: initialValues.brandId,
                                        categoryId: initialValues.categoryId,
                                        serviceId: initialValues.serviceId,
                                        description: toWysiwyg(initialValues?.description),
                                        deliverables: initialValues.deliverables,
                                        otherDeliverables: initialValues.otherDeliverables,
                                        // questions: initialValues.questions || [],
                                        type: 'SUBMITTED',
                                    }}
                                >
                                    <Form.Item name="hidden" style={{ marginBottom: '0', height: 0 }}>
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Form.Item name="type" style={{ marginBottom: '0', height: 0 }}>
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Box $h="100%">
                                        <Box>
                                            <Text $textVariant="H5" $mb="16">
                                                Name your request
                                            </Text>
                                            <Form.Item
                                                name="name"
                                                colon={false}
                                                required
                                                validateTrigger={['onChange', 'onBlur', 'onSubmit']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please enter a request name',
                                                    },
                                                ]}
                                                className="form-item-with-error"
                                            >
                                                <Input placeholder="Give your request a name" />
                                            </Form.Item>
                                        </Box>
                                        <Box $d="block" $pos="relative">
                                            <Text style={{ fontSize: '20px' }} $textVariant="H5" $mb="16">
                                                Choose a brand{' '}
                                            </Text>
                                            <Box $d="block" $w="100%" $alignItems={windowWidth < 720 ? 'center' : null} $justifyContent="flex-end">
                                                <Button
                                                    style={
                                                        windowWidth < 720
                                                            ? {
                                                                alignItems: 'center',
                                                                fontSize: '14px',
                                                                position: 'absolute',
                                                                right: '0',
                                                                top: '0',
                                                                height: '26px',
                                                                padding: '0',
                                                                width: 'initial',
                                                            }
                                                            : {
                                                                position: 'absolute',
                                                                right: '0',
                                                                top: '0',
                                                                height: 'initial',
                                                                padding: '0',
                                                                width: 'initial',
                                                            }
                                                    }
                                                    onClick={() => showPopup(true)}
                                                    type="link"
                                                    block
                                                    icon={windowWidth < 720 ? null : <IconAdd style={{ fontSize: 20 }} />}
                                                >
                                                    CREATE Brand
                                                </Button>
                                            </Box>
                                            <Form.Item
                                                colon={false}
                                                required
                                                style={{
                                                    marginBottom: '24px',
                                                }}
                                                name="brandId"
                                            >
                                                <FieldBrand windowWidth={windowWidth} viewer={viewer} activePopup={activePopup} showPopup={showPopup} />
                                            </Form.Item>
                                        </Box>
                                        <Box>
                                            <Text $textVariant="H5" $mb="16">
                                                Choose a category
                                            </Text>
                                            <Form.Item
                                                colon={false}
                                                required
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                                name="categoryId"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'You have to choose a category',
                                                    },
                                                ]}
                                            >
                                                <FieldCategoryRequest
                                                    windowWidth={windowWidth}
                                                    loading={loading}
                                                    categories={allCategories}
                                                    handleChange={handleChangeCategory}
                                                />
                                            </Form.Item>
                                        </Box>
                                        <Box ref={productRef}>
                                            <Text $textVariant="H5" $mb="16">
                                                Choose a product
                                            </Text>
                                            <Form.Item
                                                colon={false}
                                                required
                                                style={{
                                                    marginBottom: 10,
                                                }}
                                                name="serviceId"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'You have to choose a product',
                                                    },
                                                ]}
                                            >
                                                <FieldProductRequest
                                                    windowWidth={windowWidth}
                                                    category={category}
                                                    viewer={viewer}
                                                    showUpgrade={showUpgrade}
                                                    setShowUpgrade={setShowUpgrade}
                                                />
                                            </Form.Item>
                                        </Box>
                                        {questions.length > 0 && (
                                            <Box>
                                                <Text $textVariant="H5" $mb="16">
                                                    Questions
                                                </Text>
                                                <FieldOrderQuestion questions={questions} brief={initialValues.brief} />
                                            </Box>
                                        )}
                                        <Box>
                                            <Text $textVariant="H5" $mb={windowWidth > 720 ? '10' : '24'} $d="flex" $alignItems="center">
                                                Describe your request
                                                {windowWidth >= 1024 && windowWidth <= 1279 && (
                                                    <Tooltip
                                                        color="white"
                                                        title={
                                                            <>
                                                                <Text $textVariant="H6" $mb="14">
                                                                    WHAT TO INCLUDE
                                                                </Text>
                                                                <Box as="ul" $pl="20" $mb="0">
                                                                    {texts.map((text, index) => (
                                                                        <Box as="li" key={text} $mb={index === texts.length - 1 ? '0' : '4'}>
                                                                            {text}
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            </>
                                                        }
                                                        trigger="hover"
                                                    >
                                                        <Box as="span" $d="inline-flex" $alignItems="center" $ml="8" $colorScheme="cta">
                                                            <IconQuestions size="16px" />
                                                        </Box>
                                                    </Tooltip>
                                                )}
                                            </Text>
                                            <Text $textVariant="P4" $colorScheme="secondary" $mb="16">
                                                Format your paragraphs and create checklists to make your description easy to read and follow. Well-written
                                                instructions will result in better designs.
                                            </Text>
                                            <Form.Item
                                                name="description"
                                                colon={false}
                                                required
                                                validateTrigger={['onChange', 'onBlur', 'onSubmit']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        validator: async (_, value) => {
                                                            if (!value || value.trim() === '' || value === '<p></p>' || value === '<p><br></p>') {
                                                                throw new Error('Please provide a description for your request');
                                                            }
                                                        },
                                                    },
                                                ]}
                                                style={{ marginBottom: 16 }}
                                                className="form-item-with-error"
                                            >
                                                <Wysiwyg
                                                    disableEnterKey={false}
                                                    $contentMinHeight="202px"
                                                    placeholder="We are a small B2B/B2C company providing solutions in Digital Marketing and I am looking for a new logo that focuses on:
        • Social Media
        • Young Entrepreneurs
        • Market Leaders"
                                                />
                                            </Form.Item>
                                        </Box>
                                    </Box>
                                    {/* 
                                //pick your preferred designer
                                <Box $alignItems='center' display='flex' $justifyContent='space-between'>
                                        <Text style={{fontSize:'20px'}}  $textVariant="H5" $mb="16">
                                        Pick your preferred designer
                                        </Text>
                                        <Form.Item
                                            colon={false}
                                            required={false}
                                            style={{
                                                marginBottom: 10,
                                            }}
                                            name="brandId"
                                        >
                                            <FieldDesigner  windowWidth={windowWidth} viewer={viewer} />
                                        </Form.Item>
                                    </Box> */}
                                    <Box $h="100%" $overflow="hidden">
                                        <Box>
                                            <Text $textVariant="H5" $mb="10">
                                                Attachments{' '}
                                                <Text as="span" $colorScheme="tertiary">
                                                    (Optional)
                                                </Text>
                                            </Text>
                                            <Text $textVariant="P4" $colorScheme="secondary" $mb="16">
                                                Upload any images, files, or examples that maybe helpful in explaining your request here.
                                            </Text>
                                            <Form.Item name="attachments" colon={false} required>
                                                <Uploader
                                                    listType="picture"
                                                    multiple
                                                    initialValue={initialValues.attachments}
                                                    refetch={refetch}
                                                    isDuplicateEdit={isEdit || isDuplicate}
                                                    handleChangeAttachments={handleChangeAttachments}
                                                    handleChangeAttachmentsToDisconnect={handleChangeAttachmentsToDisconnect}
                                                />
                                            </Form.Item>
                                        </Box>
                                        <Box>
                                            <Text $textVariant="H5" $mb="10">
                                                File deliverables
                                            </Text>
                                            {!loading && chosenProductId ? (
                                                <>
                                                    <Text $textVariant="P4" $colorScheme="secondary" $mb="16">
                                                        Select the file types you need.
                                                    </Text>
                                                    <Form.Item
                                                        name="deliverables"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'You have to choose file deliverables',
                                                            },
                                                        ]}
                                                        colon={false}
                                                        required={false}
                                                    >
                                                        <FieldDeliverableRequest
                                                            chosenProductDeliverables={chosenProductDeliverables}
                                                            onSelect={handleSelectDeliverable}
                                                        />
                                                    </Form.Item>
                                                </>
                                            ) : (
                                                <Text $textVariant="P4" $colorScheme="secondary" $mb="16">
                                                    Please choose a product first.
                                                </Text>
                                            )}
                                            <Box ref={otherDeliverablesRef}>
                                                {hasOtherDeliverables && (
                                                    <Form.Item
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field cannot be empty',
                                                            },
                                                        ]}
                                                        name="otherDeliverables"
                                                        label="Others"
                                                        colon={false}
                                                        required={false}
                                                    >
                                                        <Input placeholder="Svg, ppt, google slides, etc." />
                                                    </Form.Item>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        hide="desktop"
                                        $w="calc(100% + 32px)"
                                        $borderT="1"
                                        $borderTopStyle="solid"
                                        $borderTopColor="outline-gray"
                                        $mb="16"
                                        $mx="-16px"
                                    />
                                    <Box $d="flex" $mx="-5px" $flexWrap="wrap" $alignItems="center">
                                        <Box $px="5px">
                                            <PopupCancelRequest
                                                isFilled={isFilled}
                                                isEdit={isEdit}
                                                form={form}
                                                handleSubmit={handleSubmit}
                                                handleSetIsFilled={handleSetIsFilled}
                                            />
                                        </Box>
                                        <Box $flex={['1', 'unset']} $ml="auto" $px="5px">
                                            <Box $d="flex" $mx="-5px" $alignItems="center" $flexWrap="wrap">
                                                <Box hide="mobile" $px="5px">
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={!enableSubmit}
                                                        $ml={paging ? '0' : '14'}
                                                        loading={isSubmitting}
                                                    >
                                                        {submitText ?? 'Submit'}
                                                    </Button>
                                                </Box>
                                                <Box hide="desktop" $px="5px" style={{ display: 'flex', gap: '10px' }} $flex={1}>
                                                    {breadcrumbLabel !== 'Edit' && (
                                                        <Button
                                                            type="default"
                                                            htmlType="submit"
                                                            block
                                                            disabled={!enableSubmit}
                                                            loading={isSubmitting}
                                                            onClick={handleSaveAsDraft}
                                                            $w="100%"
                                                        >
                                                            Save as draft
                                                        </Button>
                                                    )}
                                                    <Button type="primary" htmlType="submit" block disabled={!enableSubmit} loading={isSubmitting} $w="100%">
                                                        {submitText ?? 'Submit'}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Form>
                            </Box>
                        )}
                    </PageContainer>
                </Basepage>
                <SideNoteForm loading={loading} />
                {!showUpgrade && (
                    <Prompt
                        isBlocked={isFilled && !hasSubmitted}
                        title={isEdit ? 'Are you sure you want to quit?' : 'Unsaved request'}
                        content={
                            isEdit
                                ? 'All changes on this request will be cancelled.'
                                : 'Would you like to save your request as a draft? You will be able to edit the brief later.'
                        }
                        okayText={isEdit ? 'Quit' : 'Save As Draft'}
                        cancelText={isEdit ? 'Cancel' : "Don't save"}
                        onOkay={handlePromptOkay}
                        afterOkay={handleAfterPromptOkay}
                        afterCancel={handleAfterPromptCancel}
                    />
                )}
                <Popup
                    open={hasSubmitted && !isEdit}
                    $variant="default"
                    width={500}
                    closable={false}
                    maskClosable={false}
                    footer={null}
                    centered
                    paddingBody={['20px 16px', '30px 30px']}
                >
                    <ResponseRequest saveType={saveType} />
                </Popup>
            </>
        );
    }
);

function MySkeleton() {
    return (
        <Box $mt="36px">
            <Skeleton $w="175" $h="20" />
            <Skeleton $w="499" $h="16" $mt="10px" style={window.innerWidth < 500 ? { display: 'none' } : {}} />
            <Skeleton $w="100%" $h="124" $mt="20px" />
            <Skeleton $w="158px" $h="20" $mt="36px" />
            <Skeleton $w="248px" $h="16" $mt="10px" />
            <Box $d="flex" $gap="22px" $mt="20px" $mb="30px" $flexWrap="wrap">
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
                <Skeleton $w="166" $h="166" />
            </Box>
            <Box $d="flex" $justifyContent="space-between">
                <Skeleton $w="156" $h="40" />
                <Box $d="flex" $gap="20px">
                    <Skeleton $w="98" $h="40" />
                    <Skeleton $w="166" $h="40" />
                </Box>
            </Box>
            <Skeleton $w="180" $h="20" $mt="15px" />
            <Skeleton $w="180" $h="16" $mt="16px" />
            <Skeleton $w="114" $h="20" $mt="36px" />
            <Skeleton $w="100%" $h="16" $mt="16px" />
            <Box $w="100%" $h="250" $mt="18px" $mb="30px" $border="1px solid #D5D6DD" style={{ borderRadius: '10px' }}>
                <Box $d="flex" $gap="16px" $pl="16px" $alignItems="center" $w="100%" $h="48" style={{ borderBottom: '1px solid #D5D6DD' }}>
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                    <Skeleton $w="20" $h="20" />
                </Box>
                <Box $mt="14px" $pl="16px">
                    <Skeleton $w="576" $h="16" style={window.innerWidth < 600 ? { display: 'none' } : {}} />
                    <Box $d="flex" $mt="10px" $gap="4px" $flexDir="column">
                        <Skeleton $w="51" $h="16" />
                        <Skeleton $w="91" $h="16" />
                        <Skeleton $w="59" $h="16" />
                        <Skeleton $w="81" $h="16" />
                    </Box>
                </Box>
            </Box>
            <Box $d="flex" $justifyContent="space-between">
                <Skeleton $w="156" $h="40" />
                <Box $d="flex" $gap="20px">
                    <Skeleton $w="98" $h="40" />
                    <Skeleton $w="166" $h="40" />
                </Box>
            </Box>
        </Box>
    );
}

export default withResponsive(FormRequest);
