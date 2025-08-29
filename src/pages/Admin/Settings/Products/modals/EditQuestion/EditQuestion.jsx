import React, { memo, useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import compact from 'lodash/compact';
import { Form } from '@components/Form';
import { Popup } from '@components/Popup';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import { Select } from '@components/Select';
import { Checkbox } from '@components/Checkbox';
import { Text } from '@components/Text';
import IconAdd from '@components/Svg/IconAdd';
import message from '@components/Message';
import RemoveIcon from '@public/assets/icons/remove-feature.svg';
import { UPDATE_QUESTION } from '@graphql/mutations/question';

const EditQuestion = memo(({ visible, onEdit, isEditProduct, onCancel, selectedQuestion }) => {
    const [form] = Form.useForm();
    const { resetFields, validateFields, setFieldsValue } = form;
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateQuestion] = useMutation(UPDATE_QUESTION);
    const answerType = Form.useWatch('answerType', form);
    const [choiceKeys, setChoiceKeys] = useState([0, 1]);
    const [singleOptionsCount, setSingleOptionsCount] = useState(3);
    const [multipleOptionsCount, setMultipleOptionsCount] = useState(3);
    const choices = Form.useWatch('choices', form);

    useEffect(() => {
        if (selectedQuestion && visible) {
            // Спочатку очищаємо всю форму
            form.resetFields();

            // Потім встановлюємо нові значення
            form.setFieldsValue({
                title: selectedQuestion.title,
                answerType: selectedQuestion.answerType,
                help: selectedQuestion.help,
                required: selectedQuestion.required,
            });

            // Скидаємо стани до дефолтних значень
            setChoiceKeys([0, 1]);
            setSingleOptionsCount(3);
            setMultipleOptionsCount(3);

            // Встановлюємо значення в залежності від типу питання
            if (selectedQuestion.answerType === 'RADIO' && selectedQuestion.choices) {
                setChoiceKeys(selectedQuestion.choices.map((_, index) => index));
                selectedQuestion.choices.forEach((choice, index) => {
                    form.setFields([
                        {
                            name: ['choices', index],
                            value: choice,
                        },
                    ]);
                });
            }

            if (selectedQuestion.answerType === 'SINGLE_TEXT' && selectedQuestion.answers) {
                setSingleOptionsCount(selectedQuestion.answers.length);
                selectedQuestion.answers.forEach((answer, index) => {
                    form.setFields([
                        {
                            name: ['answers', index],
                            value: answer,
                        },
                    ]);
                });
                form.setFieldValue('numberOfOptions', selectedQuestion.answers.length);
            }

            if (selectedQuestion.answerType === 'MULTIPLE_TEXT' && selectedQuestion.multipleAnswers) {
                setMultipleOptionsCount(selectedQuestion.multipleAnswers.length);
                selectedQuestion.multipleAnswers.forEach((answer, index) => {
                    form.setFields([
                        {
                            name: ['multipleAnswers', index],
                            value: answer,
                        },
                    ]);
                });
                form.setFieldValue('numberOfMultipleOptions', selectedQuestion.multipleAnswers.length);
            }
        }
    }, [selectedQuestion, form, visible]);

    const addChoiceField = useCallback(() => {
        const newKey = Math.max(...choiceKeys) + 1;
        setChoiceKeys([...choiceKeys, newKey]);
    }, [choiceKeys]);

    const removeChoiceField = useCallback(
        choiceK => {
            if (choiceKeys.length <= 2) return;
            setChoiceKeys(choiceKeys.filter(key => key !== choiceK));
        },
        [choiceKeys]
    );

    const handleSingleOptionsChange = value => {
        setSingleOptionsCount(value);
        setFieldsValue({
            answers: Array(value).fill(undefined),
        });
    };

    const handleMultipleOptionsChange = value => {
        setMultipleOptionsCount(value);
        setFieldsValue({
            multipleAnswers: Array(value).fill(undefined),
        });
    };

    const onCloseModal = () => {
        form.resetFields();
        setChoiceKeys([0, 1]);
        setSingleOptionsCount(3);
        setMultipleOptionsCount(3);
        onCancel();
    };

    const hasChoices = answerType === 'RADIO' || answerType === 'DROPDOWN';
    const hasSingleText = answerType === 'SINGLE_TEXT';
    const hasMultipleText = answerType === 'MULTIPLE_TEXT';

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isUpdating) {
                const formattedAnswers = {
                    id: selectedQuestion.id,
                    title: values.title,
                    answerType: values.answerType,
                    help: values.help,
                    required: values.required,
                };

                if (values.answerType === 'RADIO') {
                    const choicesArray = choiceKeys.map(key => values.choices?.[key]).filter(Boolean);
                    formattedAnswers.choices = choicesArray;
                    formattedAnswers.choicesIds = selectedQuestion.choicesIds;
                } else if (values.answerType === 'DROPDOWN') {
                    formattedAnswers.choices = compact(values.choices);
                    formattedAnswers.choicesIds = selectedQuestion.choicesIds;
                } else if (values.answerType === 'SINGLE_TEXT') {
                    const answersArray = Array.from({ length: singleOptionsCount })
                        .map((_, index) => values.answers?.[index])
                        .filter(Boolean);
                    formattedAnswers.answers = answersArray;
                    formattedAnswers.numberOfOptions = values.numberOfOptions || singleOptionsCount;
                } else if (values.answerType === 'MULTIPLE_TEXT') {
                    const multipleAnswersArray = Array.from({ length: multipleOptionsCount })
                        .map((_, index) => values.multipleAnswers?.[index])
                        .filter(Boolean);
                    formattedAnswers.multipleAnswers = multipleAnswersArray;
                    formattedAnswers.numberOfMultipleOptions = values.numberOfMultipleOptions || multipleOptionsCount;
                }

                if (isEditProduct) {
                    setIsUpdating(true);
                    message.destroy();
                    message.loading('Updating question...', 50000);
                    await updateQuestion({
                        variables: formattedAnswers,
                    })
                        .then(({ data }) => {
                            const { updateQuestion } = data;
                            setIsUpdating(false);
                            message.destroy();
                            message.success('Question has been updated');
                            onEdit({
                                ...formattedAnswers,
                                choicesIds: formattedAnswers.choices ? updateQuestion.choices.map(c => c.id) : null,
                            });
                            resetFields();
                            onCancel();
                        })
                        .catch(e => {
                            console.log(e);
                            setIsUpdating(false);
                            message.destroy();
                            message.error('Error on updating question');
                        });
                } else {
                    onEdit(formattedAnswers);
                    resetFields();
                    onCancel();
                }
            }
        });
    }, [
        isUpdating,
        validateFields,
        onEdit,
        resetFields,
        onCancel,
        selectedQuestion,
        updateQuestion,
        choiceKeys,
        singleOptionsCount,
        multipleOptionsCount,
        isEditProduct,
    ]);

    const choiceFormItems = (
        <Form.List name="choices">
            {(fields, { add, remove }) => (
                <>
                    {selectedQuestion?.choices.map((choice, index) => (
                        <Box key={index} $mt={index === 0 ? '0' : '16'}>
                            <Form.Item
                                rules={[
                                    {
                                        required: hasChoices ? true : false,
                                        message: 'This field cannot be empty',
                                    },
                                ]}
                                name={index}
                                fieldKey={index}
                                initialValue={choice}
                                label={`Choice #${index + 1}`}
                                colon={false}
                                required={false}
                                style={{ marginBottom: 10 }}
                            >
                                <Box $d="flex" $alignItems="center">
                                    <Input placeholder={`Enter choice #${index + 1}`} defaultValue={choice} />
                                </Box>
                            </Form.Item>
                        </Box>
                    ))}
                </>
            )}
        </Form.List>
    );

    const singleTextFormItems = (
        <Box>
            <Form.Item name="numberOfOptions" label="Choose number of options" colon={false} required={false} style={{ marginBottom: 19 }}>
                <Select placeholder="Select number of options" onChange={handleSingleOptionsChange} defaultValue={selectedQuestion?.answers?.length || 3}>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <Select.Option key={num} value={num}>
                            {num}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {Array.from({ length: singleOptionsCount }).map((_, index) => (
                <Form.Item
                    key={index}
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name={['answers', index]}
                    label={`Answer ${index + 1}`}
                    initialValue={selectedQuestion?.answers?.[index]}
                    colon={false}
                    required={false}
                    style={{ marginBottom: 16 }}
                >
                    <Input placeholder="Enter answer" defaultValue={selectedQuestion?.answers?.[index]} />
                </Form.Item>
            ))}
        </Box>
    );

    const multipleTextFormItems = (
        <Box>
            <Form.Item name="numberOfMultipleOptions" label="Choose number of options" colon={false} required={false} style={{ marginBottom: 19 }}>
                <Select
                    placeholder="Select number of options"
                    onChange={handleMultipleOptionsChange}
                    defaultValue={selectedQuestion?.multipleAnswers?.length || 3}
                >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <Select.Option key={num} value={num}>
                            {num}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {Array.from({ length: multipleOptionsCount }).map((_, index) => (
                <Form.Item
                    key={index}
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name={['multipleAnswers', index]}
                    label={`Answer ${index + 1}`}
                    initialValue={selectedQuestion?.multipleAnswers?.[index]}
                    colon={false}
                    required={false}
                    style={{ marginBottom: 16 }}
                >
                    <Input placeholder="Enter answer" defaultValue={selectedQuestion?.multipleAnswers?.[index]} />
                </Form.Item>
            ))}
        </Box>
    );

    return (
        <Popup $variant="default" width={500} title="Edit question" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
            <Form
                onFinish={handleSubmit}
                name="editQuestionForm"
                form={form}
                initialValues={{
                    title: selectedQuestion?.title,
                    answerType: selectedQuestion?.answerType,
                    help: selectedQuestion?.help,
                    required: selectedQuestion?.required,
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
                    label="Question title"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 19 }}
                >
                    <Input placeholder="Ex: Do you prefer clean and discreet design or strong visualy identity?" />
                </Form.Item>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name="answerType"
                    label="Type of answer"
                    colon={false}
                    required={false}
                    style={{ marginBottom: 19 }}
                >
                    <Select placeholder="Select type of answer">
                        <Select.Option value="TEXT">Text</Select.Option>
                        <Select.Option value="" disabled>
                            Image select (not working)
                        </Select.Option>
                        <Select.Option value="RADIO">Radio</Select.Option>
                        <Select.Option value="" disabled>
                            Upload files (not working)
                        </Select.Option>
                        <Select.Option value="DROPDOWN">Dropdown</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="" colon={false} required={false} style={{ marginBottom: hasChoices ? 10 : 0 }}>
                    {hasChoices && <>{choiceFormItems}</>}
                    {hasSingleText && <>{singleTextFormItems}</>}
                    {hasMultipleText && <>{multipleTextFormItems}</>}
                </Form.Item>
                <Form.Item name="help" label="Help information" colon={false} required={false} style={{ marginBottom: 19 }}>
                    <Input placeholder="Enter help information" />
                </Form.Item>
                <Form.Item valuePropName="checked" name="required" label="" colon={false} required={false}>
                    <Checkbox>
                        <Text $d="inline-block" $textVariant="P4" $colorScheme="headline">
                            Is question required?
                        </Text>
                    </Checkbox>
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isUpdating} type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default EditQuestion;
