import React, { memo, useCallback, useState } from 'react';
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
import { ADD_QUESTION } from '@graphql/mutations/question';

let choiceKeyId = 1;

const AddQuestion = memo(({ visible, onAdd, onCancel, isEditProduct, serviceId }) => {
    const [form] = Form.useForm();
    const { resetFields, validateFields, setFieldsValue } = form;
    const [createQuestion] = useMutation(ADD_QUESTION);
    const answerType = Form.useWatch('answerType', form);
    const [isAdding, setIsAdding] = useState(false);
    const choices = Form.useWatch('choices', form);
    const addChoiceField = useCallback(() => {
        const nextKeys = choices.concat(choiceKeyId++);
        setFieldsValue({
            choices: nextKeys,
        });
    }, [choices]);

    const removeChoiceField = useCallback(
        choiceK => {
            if (choices.length === 1) {
                return;
            }

            setFieldsValue({
                choices: choices.filter(key => key !== choiceK),
            });
        },
        [choices]
    );

    const onCloseModal = () => {
        resetFields();
        onCancel();
    };

    const hasChoices = answerType === 'RADIO' || answerType === 'DROPDOWN';

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isAdding) {
                if (isEditProduct) {
                    setIsAdding(true);
                    message.destroy();
                    message.loading('Adding question...', 50000);
                    await createQuestion({
                        variables: {
                            title: values.title,
                            answerType: values.answerType,
                            choices: hasChoices ? compact(values.choices) : null,
                            placeholder: values.placeholder,
                            help: values.help,
                            required: values.required,
                            serviceId,
                        },
                    })
                        .then(({ data }) => {
                            const { createQuestion } = data;
                            setIsAdding(false);
                            message.destroy();
                            message.success('Question successfully added');
                            onAdd({
                                id: createQuestion.id,
                                title: values.title,
                                answerType: values.answerType,
                                choices: hasChoices ? compact(values.choices) : null,
                                choicesIds: hasChoices ? createQuestion.choices.map(c => c.id) : null,
                                placeholder: values.placeholder,
                                help: values.help,
                                required: values.required,
                            });
                            resetFields();
                            onCancel();
                        })
                        .catch(e => {
                            console.log(e);
                            setIsAdding(false);
                            message.destroy();
                            message.error('Error on adding question');
                        });
                } else {
                    onAdd({
                        title: values.title,
                        answerType: values.answerType,
                        choices: hasChoices ? compact(values.choices) : null,
                        placeholder: values.placeholder,
                        help: values.help,
                        required: values.required,
                    });
                    resetFields();
                    onCancel();
                }
            }
        });
    }, [isAdding, validateFields, onAdd, resetFields, onCancel, hasChoices, isEditProduct, createQuestion, serviceId]);
    const choiceFormItems = (
        <Form.List name="choices">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey }, index) => (
                        <Box key={key} $mt={index === 0 ? '0' : '16'}>
                            <Form.Item
                                rules={[
                                    {
                                        required: hasChoices ? true : false,
                                        message: 'This field cannot be empty',
                                    },
                                ]}
                                name={name} // Corrected from index to name (since it's dynamic)
                                fieldKey={fieldKey}
                                initialValue=""
                                label={`Choice #${index + 1}`}
                                colon={false}
                                required={false}
                                style={{ marginBottom: 10 }}
                            >
                                <Box $d="flex" $alignItems="center">
                                    <Input placeholder={`Enter choice #${index + 1}`} />
                                    {fields.length > 1 && ( // Use fields.length instead of choices
                                        <Box
                                            $ml="18"
                                            $w="40"
                                            $h="40"
                                            $lineH="38"
                                            $borderW="1"
                                            $borderStyle="solid"
                                            $borderColor="outline-gray"
                                            $cursor="pointer"
                                            $textAlign="center"
                                            onClick={() => remove(name)} // Corrected remove function
                                        >
                                            <img src={RemoveIcon} alt="Remove Choice" />
                                        </Box>
                                    )}
                                </Box>
                            </Form.Item>
                        </Box>
                    ))}
                    {/* Add button should use `add` instead of a separate function */}
                    <Box
                        $mt="18"
                        $mb="9"
                        $d="flex"
                        $alignItems="center"
                        $colorScheme="cta"
                        $cursor="pointer"
                        onClick={() => add()} // Corrected to use `add`
                        $w="103"
                    >
                        <IconAdd />
                        <Text $ml="8" $textVariant="H6">
                            Add choice
                        </Text>
                    </Box>
                </>
            )}
        </Form.List>
    );

    return (
        <Popup $variant="default" width={500} title="Add question" open={visible} onCancel={onCloseModal} footer={null} centered destroyOnClose>
            <Form onFinish={handleSubmit} name="addQuestionForm" form={form} initialValues={{ choices: [''] }}>
                <Form.Item
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
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
                </Form.Item>
                <Form.Item name="placeholder" label="Placeholder" colon={false} required={false} style={{ marginBottom: 19 }}>
                    <Input placeholder="Enter placeholder" />
                </Form.Item>
                <Form.Item name="help" label="Help information" colon={false} required={false} style={{ marginBottom: 19 }}>
                    <Input placeholder="Enter help information" />
                </Form.Item>
                <Form.Item valuePropName="checked" initialValue={false} name="required" label="" colon={false} required={false}>
                    <Checkbox>
                        <Text $d="inline-block" $textVariant="P4" $colorScheme="headline">
                            Is question required?
                        </Text>
                    </Checkbox>
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isAdding} type="primary" htmlType="submit">
                            Add Question
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default AddQuestion;
