import React, { memo, useState } from 'react';
import { Form } from '@components/Form';
import { TextArea } from '@components/Input';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import FieldFeedbackRate from './FieldFeedbackRate.jsx';

const FormFeedbackRequest = memo(({ onSubmit }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        form.validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                await onSubmit(values);
                setIsLoading(false);
            }
        });
    };

    return (
        <Form onFinish={handleSubmit} name="feedbackRequestFormC" form={form}>
            <Text $textVariant="H6" $colorScheme="primary" $mb="20">
                How would you rate your experience?
            </Text>
            <Form.Item name="rate" colon={false} required={false} style={{ marginBottom: 0 }}>
                <FieldFeedbackRate />
            </Form.Item>
            <Form.Item name="comment" colon={false} required={false} style={{ marginBottom: 0 }}>
                <TextArea placeholder="Please share your feedback" rows={5} />
            </Form.Item>
            <Button $mt="10" type="primary" htmlType="submit" block loading={isLoading}>
                Submit Feedback
            </Button>
        </Form>
    );
});

export default FormFeedbackRequest;
