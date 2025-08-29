import React, { useState, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
import { DESIGN_TYPES } from '@graphql/queries/designType';
import { UPLOAD_FILE } from '@graphql/mutations/file';
import DesignTypesField from '../../blocks/DesignTypesField';
import ProductImageUploader from '../../blocks/ProductImageUploader';
import DeliverablesField from '../../blocks/DeliverablesField';
import AddQuestion from '../AddQuestion';
import EditQuestion from '../EditQuestion';

const AddProduct = memo(({ visible, onCancel, onAdd, refetchProducts }) => {
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const { loading, data } = useQuery(DESIGN_TYPES, {
        fetchPolicy: 'network-only',
    });
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowAddQuestion, setIsShowAddQuestion] = useState(false);
    const [isShowEditQuestion, setIsShowEditQuestion] = useState(false);
    const [isShowDeleteQuestion, setIsShowDeleteQuestion] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
    const [questions, setQuestions] = useState(null);

    const showAddQuestion = () => {
        setIsShowAddQuestion(true);
    };

    const showEditQuestion = (q, index) => {
        setSelectedQuestion(q);
        setSelectedQuestionIndex(index);
        setIsShowEditQuestion(true);
    };

    const showDeleteQuestion = index => {
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

    const handleDeleteQuestion = () => {
        pullAt(questions, selectedQuestionIndex);
        setSelectedQuestionIndex(null);
        setIsShowDeleteQuestion(false);
    };

    const onCloseModal = () => {
        resetFields();
        onCancel();
    };

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);

                try {
                    message.destroy();
                    message.loading('Adding product...', 50000);
                    await uploadFile({ variables: { file: values.productImage } })
                        .then(async ({ data }) => {
                            await onAdd({
                                name: values.name,
                                type: values.type,
                                howToFillUpLink: values.howToFillUpLink,
                                deliverables: values.deliverables,
                                productImageId: data.uploadFile.id,
                                position: parseInt(values?.position || 0),
                                questions,
                            });
                            message.destroy();
                            message.success('Product successfully added');
                            await refetchProducts();
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
                } catch (e) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(e);
                    return false;
                }
            }
        });
    }, [isLoading, validateFields, onAdd, onCancel, refetchProducts, uploadFile, resetFields, questions]);

    const isNotEmptyQuestions = questions && questions?.length > 0;

    return (
        <>
            <Popup $variant="default" width={900} title="Add product" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
                <Form onFinish={handleSubmit} name="addProductForm" form={form}>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                        label="Name"
                        colon={false}
                        required
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
                        <Input type="number" placeholder="Enter product position" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Design type"
                        colon={false}
                        required
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <DesignTypesField loading={loading} data={data} />
                    </Form.Item>
                    <Form.Item name="howToFillUpLink" label="How to fill up link" colon={false} required={false}>
                        <Input placeholder="Enter your link" />
                    </Form.Item>
                    <Form.Item
                        name="deliverables"
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                        label="File deliverables"
                        colon={false}
                        required
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
                        required
                    >
                        <ProductImageUploader />
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
                                $radii="10"
                                $textAlign="center"
                                $cursor="pointer"
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
                                    <Box key={index} $borderW="1" $borderStyle="solid" $borderColor="#D9D9D9" $mb="16">
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
                                                    $radii="2"
                                                    $mr="8"
                                                    $w="32"
                                                    $h="32"
                                                    $lineH="36"
                                                    $textAlign="center"
                                                    $cursor="pointer"
                                                    onClick={() => showDeleteQuestion(index)}
                                                >
                                                    <IconDelete width="16px" height="16px" />
                                                </Box>
                                                <Box
                                                    $borderW="1"
                                                    $borderStyle="solid"
                                                    $borderColor="#D9D9D9"
                                                    $radii="2"
                                                    $w="32"
                                                    $h="32"
                                                    $lineH="36"
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
                                Save
                            </Button>
                        </Box>
                    </Form.Item>
                </Form>
            </Popup>
            <AddQuestion visible={isShowAddQuestion} onCancel={hideAddQuestion} onAdd={handleAddQuestion} />
            <EditQuestion visible={isShowEditQuestion} onCancel={hideEditQuestion} onEdit={handleEditQuestion} selectedQuestion={selectedQuestion} />
            <PopupDelete
                $variant="delete"
                open={isShowDeleteQuestion}
                title="Are you sure you want to delete this question?"
                onOk={handleDeleteQuestion}
                onCancel={hideDeleteQuestion}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </>
    );
});

export default AddProduct;
