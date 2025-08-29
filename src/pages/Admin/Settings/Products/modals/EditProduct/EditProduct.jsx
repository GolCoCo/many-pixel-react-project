import React, { useState, useEffect, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Switch } from 'antd';
import pullAt from 'lodash/pullAt';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup, PopupDelete } from '@components/Popup';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import message from '@components/Message';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import { UPLOAD_FILE, DELETE_FILE } from '@graphql/mutations/file';
import { DELETE_QUESTION } from '@graphql/mutations/question';
import { DESIGN_TYPES } from '@graphql/queries/designType';
import ProductImageUploader from '../../blocks/ProductImageUploader';
import DesignTypesField from '../../blocks/DesignTypesField';
import DeliverablesField from '../../blocks/DeliverablesField';
import AddQuestion from '../AddQuestion';
import EditQuestion from '../EditQuestion';
import isEmpty from 'lodash/isEmpty';

const EditProduct = memo(({ visible, onCancel, onEdit, selectedData }) => {
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [isShowAddQuestion, setIsShowAddQuestion] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
    const [isShowEditQuestion, setIsShowEditQuestion] = useState(false);
    const [isShowDeleteQuestion, setIsShowDeleteQuestion] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { loading, data } = useQuery(DESIGN_TYPES, {
        fetchPolicy: 'network-only',
    });
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const [deleteFile] = useMutation(DELETE_FILE);
    const [deleteQuestion] = useMutation(DELETE_QUESTION);
    const isActivated = Form.useWatch('isActivated', form);
    const statusTextFromField = isActivated === true ? 'Active' : 'Inactive';
    const statusTextFromData = selectedData?.isActivated ? 'Active' : 'Inactive';
    const statusText = isActivated !== undefined ? statusTextFromField : statusTextFromData;

    useEffect(() => {
        if (selectedData?.questions && selectedData?.questions?.length > 0) {
            const questionsData = selectedData?.questions?.map(question => ({
                id: question.id,
                title: question.title,
                answerType: question.answerType,
                choices: question?.choices && question?.choices?.length > 0 ? question?.choices?.map(choice => choice.label) : null,
                choicesIds: question?.choices && question?.choices?.length > 0 ? question?.choices?.map(choice => choice.id) : null,
                placeholder: question.placeholder,
                help: question.help,
                required: question.required,
            }));

            setQuestions(questionsData);
        } else {
            setQuestions(null);
        }

        // If I have data
        if (selectedData) {
            form.setFieldsValue({
                name: selectedData?.name,
                type: selectedData?.type?.id,
                howToFillUpLink: selectedData?.howToFillUpLink,
                deliverables: selectedData?.deliverables,
                productImage: 'notchanged',
                isActivated: selectedData?.isActivated,
                position: selectedData?.position !== null ? selectedData?.position : 0,
            });
        }
    }, [selectedData]);

    const onCloseModal = () => {
        resetFields();
        onCancel();
    };

    const showAddQuestion = () => {
        setIsShowAddQuestion(true);
    };

    const showEditQuestion = (q, index) => {
        setSelectedQuestion(q);
        setSelectedQuestionIndex(index);
        setIsShowEditQuestion(true);
    };

    const showDeleteQuestion = (q, index) => {
        setSelectedQuestion(q);
        setSelectedQuestionIndex(index);
        setIsShowDeleteQuestion(true);
    };

    const hideAddQuestion = () => {
        setIsShowAddQuestion(false);
    };

    const hideEditQuestion = () => {
        setSelectedQuestion(null);
        setSelectedQuestionIndex(null);
        setIsShowEditQuestion(false);
    };

    const hideDeleteQuestion = () => {
        setSelectedQuestion(null);
        setSelectedQuestionIndex(null);
        setIsShowDeleteQuestion(false);
    };

    const handleAddQuestion = val => {
        const newQuestionArr = questions ? [...questions, val] : [val];
        setQuestions(newQuestionArr);
    };

    const handleEditQuestion = val => {
        questions.splice(selectedQuestionIndex, 1, val);
        setSelectedQuestion(null);
        setSelectedQuestionIndex(null);
    };

    const handleDeleteQuestion = async () => {
        message.destroy();
        message.loading('Deleting question...', 50000);
        setIsDeleting(true);
        await deleteQuestion({
            variables: {
                id: selectedQuestion.id,
                serviceId: selectedData.id,
                choicesIds: questions[selectedQuestionIndex].choicesIds,
            },
        })
            .then(() => {
                message.destroy();
                message.success('Question successfully removed');
                pullAt(questions, selectedQuestionIndex);
                setSelectedQuestion(null);
                setSelectedQuestionIndex(null);
                setIsShowDeleteQuestion(false);
                setIsDeleting(false);
            })
            .catch(e => {
                console.log(e);
                message.destroy();
                message.error('Error on deleting question');
                setIsDeleting(false);
            });
    };

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                try {
                    if (!isEmpty(values.productImage)) {
                        message.destroy();
                        message.loading('Updating product...', 50000);
                        await uploadFile({ variables: { file: values.productImage } })
                            .then(async ({ data }) => {
                                await deleteFile({ variables: { id: selectedData?.icon?.id } });
                                await onEdit({
                                    name: values.name,
                                    type: values.type,
                                    howToFillUpLink: values.howToFillUpLink,
                                    deliverables: values.deliverables,
                                    productImageId: data.uploadFile.id,
                                    isActivated: values.isActivated,
                                    position: parseInt(values?.position || 0),
                                });
                                message.destroy();
                                message.success('Product has been updated');
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
                        message.loading('Updating product...', 50000);

                        await onEdit({
                            name: values.name,
                            type: values.type,
                            howToFillUpLink: values.howToFillUpLink,
                            deliverables: values.deliverables,
                            productImageId: null,
                            isActivated: values.isActivated,
                            position: parseInt(values?.position || 0),
                        });
                        message.destroy();
                        message.success('Product has been updated');
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
    }, [isLoading, validateFields, onEdit, onCancel, resetFields, uploadFile, deleteFile, selectedData]);

    const isNotEmptyQuestions = questions && questions?.length > 0;

    return (
        <>
            <Popup $variant="default" width={900} title="Edit product" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
                <Form
                    onFinish={handleSubmit}
                    name="editProductForm"
                    form={form}
                    initialValues={{
                        name: selectedData?.name,
                        type: selectedData?.type?.id,
                        howToFillUpLink: selectedData?.howToFillUpLink,
                        deliverables: selectedData?.deliverables,
                        productImage: 'notchanged',
                        isActivated: selectedData?.isActivated,
                        position: selectedData?.position !== null ? selectedData?.position : 0,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        colon={false}
                        required={false}
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input placeholder="Enter product name" />
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
                                message: 'This field cannot be empty',
                            },
                        ]}
                        name="type"
                        label="Design type"
                        colon={false}
                        required={false}
                    >
                        <DesignTypesField loading={loading} data={data} />
                    </Form.Item>
                    <Form.Item name="howToFillUpLink" label="How to fill up link" colon={false} required={false}>
                        <Input placeholder="Enter your link" />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                        name="deliverables"
                        label="File deliverables"
                        colon={false}
                        required={false}
                    >
                        <DeliverablesField />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please upload an image',
                            },
                        ]}
                        name="productImage"
                        label="Product image"
                        colon={false}
                        required={false}
                    >
                        <ProductImageUploader isEdit previewImageUrl={selectedData?.icon?.url} />
                    </Form.Item>
                    <Form.Item valuePropName="checked" label="Status" colon={false} required={false}>
                        <Box $mt="11" $d="flex" $alignItems="center">
                            <Box $mr="10">
                                <Form.Item name="isActivated" style={{ margin: '0', padding: '0' }}>
                                    <Switch checked={isActivated} />
                                </Form.Item>
                            </Box>

                            <Text $textVariant="P4" $colorScheme="primary">
                                {statusText}
                            </Text>
                        </Box>
                    </Form.Item>
                    <Box $borderW="0" $borderT="1" $borderStyle="solid" $borderColor="outline-gray" $pt="30" $mb="30">
                        <Box $d="flex" $justifyContent="space-between" $mb={isNotEmptyQuestions ? '20' : '14'}>
                            <Box>
                                <Text $textVariant="H5" $colorScheme="primary" $mb="6">
                                    Questions
                                </Text>
                            </Box>
                            <Text
                                $textVariant="H6"
                                $colorScheme="cta"
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor="cta"
                                $w="150"
                                $h="40"
                                $lineH="38"
                                $textAlign="center"
                                $cursor="pointer"
                                $radii="10"
                                onClick={showAddQuestion}
                            >
                                ADD QUESTION
                            </Text>
                        </Box>
                        {isNotEmptyQuestions ? (
                            questions?.map((question, index) => {
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
                                    <Box key={index} $borderW="1" $borderStyle="solid" $borderColor="#D9D9D9" $mb="16" $radii="10">
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
                                                Question #{index + 1}: {question.title}
                                            </Text>
                                            <Box $d="flex" $alignItems="center">
                                                <Box
                                                    $borderW="1"
                                                    $borderStyle="solid"
                                                    $borderColor="#FF4D4F"
                                                    $colorScheme="#FF4D4F"
                                                    $radii="10"
                                                    $mr="8"
                                                    $w="32"
                                                    $h="32"
                                                    $lineH="40"
                                                    $textAlign="center"
                                                    $cursor="pointer"
                                                    onClick={() => showDeleteQuestion(question, index)}
                                                >
                                                    <IconDelete width="16px" height="16px" />
                                                </Box>
                                                <Box
                                                    $borderW="1"
                                                    $borderStyle="solid"
                                                    $borderColor="#D9D9D9"
                                                    $radii="10"
                                                    $w="32"
                                                    $h="32"
                                                    $lineH="40"
                                                    $textAlign="center"
                                                    $colorScheme="#262626"
                                                    $ml="8"
                                                    $cursor="pointer"
                                                    onClick={() => showEditQuestion(question, index)}
                                                >
                                                    <IconEdit width="16px" height="16px" />
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box $px="24" $py="16">
                                            <Text $textVariant="P4" $colorScheme="secondary">
                                                Type of answer : {typeOfAnswer}
                                            </Text>
                                            {question.choices && (
                                                <Box $mt="8">
                                                    <Text $textVariant="Badge" $colorScheme="secondary" $mb="8">
                                                        Choices
                                                    </Text>
                                                    <Box $d="flex" $flexWrap="wrap" $mx="-10">
                                                        {question.choices &&
                                                            question.choices?.map((choice, index) => (
                                                                <Text key={index} $textVariant="P4" $colorScheme="primary" $mb="6" $mx="10" $w="47%">
                                                                    {index + 1}. {choice}
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
                                You have no any question
                            </Text>
                        )}
                    </Box>
                    <Form.Item>
                        <Box $d="flex" $justifyContent="flex-end">
                            <Button loading={isLoading} type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Box>
                    </Form.Item>
                </Form>
            </Popup>
            <AddQuestion isEditProduct visible={isShowAddQuestion} onCancel={hideAddQuestion} onAdd={handleAddQuestion} serviceId={selectedData?.id} />
            <EditQuestion
                isEditProduct
                visible={isShowEditQuestion}
                onCancel={hideEditQuestion}
                onEdit={handleEditQuestion}
                selectedQuestion={selectedQuestion}
            />
            <PopupDelete $variant="delete" open={isShowDeleteQuestion} title="Are you sure you want to delete this question?" footer={null}>
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
                <Box $mt="30" $d="flex" $alignItems="center" $justifyContent="flex-end">
                    <Button onClick={hideDeleteQuestion} type="default" $h="34" $fontSize="12">
                        CANCEL
                    </Button>
                    <Button onClick={handleDeleteQuestion} loading={isDeleting} type="danger" $ml="10" $h="34" $fontSize="12">
                        DELETE
                    </Button>
                </Box>
            </PopupDelete>
        </>
    );
});

export default EditProduct;
