import React, { useState } from 'react';
import { Form } from '@components/Form';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Tabs } from '@components/Tabs';
import { TextArea } from '@components/Input';
import { Button } from '@components/Button';
import IconLeftArrow from '@components/Svg/IconLeftArrow';
import FieldFeedbackRate from '../FeedbackRequest/FieldFeedbackRate.jsx';

const helpText = {
    Bad: 'What went wrong? What could have gone better? Please be as detailed as possible, as this will help us improve for your future requests.',
    Neutral: 'What could have gone better? Please be as detailed as possible, as this will help us improve for your future requests.',
    Great: 'Awesome! We are glad you like your designs. Is there anything we could have done better?',
};

const FormRequestComplete = ({ onSuccessSubmit }) => {
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [rate, setRate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangedRate = value => {
        setStep(2);
        setRate(value);
    };

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (isSubmitting) {
                return;
            }

            if (onSuccessSubmit) {
                setIsSubmitting(true);
                await onSuccessSubmit(values);
                setIsSubmitting(false);
            }
        });
    };

    return (
        <Form onFinish={handleSubmit} form={form} name="requestCompleteFormC">
            <Box $overflow="hidden">
                <Tabs activeKey={`step-${step}`} renderTabBar={() => <div />}>
                    <Tabs.TabPane key="step-1" tab="Step 1">
                        <Text $textVariant="H4" $pt="20" $mb="24" $textAlign="center" $colorScheme="primary">
                            How did the request go?
                        </Text>
                        <Text $textVariant="P4" $mb="24" $colorScheme="primary" $textAlign="center">
                            This will help assigning the best designer(s) to your future requests.
                        </Text>
                        <Form.Item name="rate">
                            <FieldFeedbackRate onChange={handleChangedRate} showText={false} $bg="bg-gray" />
                        </Form.Item>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="step-2" tab="Step 2">
                        <Box $pos="absolute" $top="0" $left="-4px">
                            <Button type="ghost" $fontSize="20" $h="20" $w="20" icon={<IconLeftArrow />} onClick={() => setStep(1)} />
                        </Box>
                        <Text $textVariant="H4" $pt="20" $mb="24" $textAlign="center" $colorScheme="primary">
                            Tell us more
                        </Text>
                        <Text $textVariant="P4" $mb="24" $colorScheme="primary" $textAlign="center">
                            {rate ? helpText[rate] : ''}
                        </Text>
                        <Form.Item name="feedback" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <TextArea placeholder="Share your experience" rows={5} />
                        </Form.Item>
                        <Button $mt="20" type="primary" htmlType="submit" block loading={isSubmitting}>
                            Submit Feedback
                        </Button>
                    </Tabs.TabPane>
                </Tabs>
            </Box>
        </Form>
    );
};

export default FormRequestComplete;
