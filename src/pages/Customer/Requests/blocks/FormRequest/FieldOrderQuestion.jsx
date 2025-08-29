import React, { memo, useCallback, useEffect } from 'react';
import { Input } from '@components/Input';
import { Radio, RadioGroup } from '@components/Radio';
import { Select } from '@components/Select';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import { Text } from '@components/Text';

const QuestionLabel = ({ title, isRequired }) => (
    <Box $d="flex" $alignItems="center" $gap="8">
        <Text fontFamily="Geomanist" $fontWeight="400">
            {title}{' '}
        </Text>
        {!isRequired && (
            <Text $textVariant="P4" $colorScheme="tertiary" $ml="5">
                (Optional)
            </Text>
        )}
    </Box>
);

const RadioQuestion = ({ question, index, initValue }) => {
    const numberOfQuestions = question.choices?.length;
    const form = Form.useFormInstance();
    useEffect(() => {
        form.setFieldValue(['questions', index], initValue?.answer ?? '');
    }, [initValue, form, index]);
    return (
        <Box $maxW={['100%', numberOfQuestions > 3 ? '80%' : '60%']}>
            <Form.Item
                name={['questions', index]}
                style={{ marginBottom: '0px' }}
                label={<QuestionLabel title={question.title || question.placeholder} isRequired={question.required} />}
                rules={[
                    {
                        required: question.required,
                        message: 'Please choose an aswer',
                    },
                ]}
                initialValue={initValue?.answer ?? ''}
            >
                <RadioGroup $whiteSpace="nowrap" labelFlex="0 1 30%">
                    <Box $d="flex" $flexWrap="wrap">
                        {question.choices.map(choice => (
                            <Radio value={choice.id} key={choice.id} style={{ marginBottom: '0px' }}>
                                {choice.label}
                            </Radio>
                        ))}
                    </Box>
                </RadioGroup>
            </Form.Item>
        </Box>
    );
};

const TextQuestion = ({ question, index, initValue }) => {
    const form = Form.useFormInstance();

    useEffect(() => {
        form.setFieldValue(['questions', index], initValue?.answer ?? '');
    }, [initValue, form, index]);
    return (
        <Form.Item
            name={['questions', index]}
            label={<QuestionLabel title={question.title} isRequired={question.required} />}
            style={{ marginBottom: '20px' }}
            rules={[
                {
                    required: question.required,
                    message: 'This field is required',
                },
            ]}
            initialValue={initValue?.answer ?? ''}
        >
            <Input placeholder={question.placeholder} />
        </Form.Item>
    );
};

const DropdownQuestion = ({ question, index, initValue }) => {
    const form = Form.useFormInstance();
    useEffect(() => {
        form.setFieldValue(['questions', index], initValue?.answer ?? '');
    }, [initValue, form, index]);
    return (
        <Form.Item
            name={['questions', index]}
            label={<QuestionLabel title={question.title} isRequired={question.required} />}
            rules={[
                {
                    required: question.required,
                    message: 'This field cannot be empty',
                },
            ]}
            initialValue={initValue?.answer ?? ''}
        >
            <Select>
                {question.choices.map(choice => {
                    return (
                        <Select.Option key={choice.label} value={choice.id}>
                            {choice.label}
                        </Select.Option>
                    );
                })}
            </Select>
        </Form.Item>
    );
};

const Field = {
    TEXT: TextQuestion,
    IMG_SELECT: null,
    RADIO: RadioQuestion,
    UPLOAD_FILES: null,
    DROPDOWN: DropdownQuestion,
};

export const FieldOrderQuestion = memo(({ questions, brief = [] }) => {
    const toRender = useCallback(() => {
        const arrayComponent = questions.filter(q => !!Field[q.answerType]);
        return arrayComponent.map((q, i) => {
            const Component = Field[q.answerType];
            const initValue = brief.find(b => b.question === q.title && b.answerType === q.answerType);

            return <Component key={q.id} question={q} index={i} initValue={initValue} />;
        });
    }, [questions]);
    return <div>{toRender()}</div>;
});
