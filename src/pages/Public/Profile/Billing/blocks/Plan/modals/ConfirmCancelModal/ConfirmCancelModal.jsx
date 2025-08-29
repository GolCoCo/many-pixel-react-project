import React, { memo, useState, useCallback } from 'react';
import { Radio, RadioGroup } from '@components/Radio';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Input, TextArea } from '@components/Input';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { Form } from '@components/Form';
import bad from '@public/assets/icons/bad.svg';
import neutral from '@public/assets/icons/neutral.svg';
import great from '@public/assets/icons/great.svg';

const tooltipOptions = {
    bad: {
        label:
            'We are always looking to improve our service. It would help a lot if you could explain what went wrong.',
        tooltip:
            'Please be as detailed as possible and mention specific request number(s) or designer(s) that led you to cancel your subscription.',
    },
    neutral: {
        label:
            'We are always looking to improve our service. It would help a lot if you could explain what could have gone better.',
        tooltip:
        'Please be as detailed as possible and mention specific request number(s) or designer(s) that led you to cancel your subscription.',

    },
    great: {
        label:
            'We are glad you enjoyed using ManyPixels. We are always looking to improve our service. Is there anything that we could have done better?',
        tooltip: 'Please be as detailed as possible and mention specific request number(s) or designer(s).',
    },
};

const ConfirmCancelModal = memo(({ visible, onCancel, onConfirmCancel, isCancelling = true, refetch }) => {
    const [form] = Form.useForm()
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [rateExp, setRateExp] = useState(null);
    const [cancelReason, setCancelReason] = useState(null);
    const feedback = Form.useWatch('feedback', form);
    const specifyAnotherService = Form.useWatch('specifyAnotherService', form);
    const otherReason = Form.useWatch('otherReason', form);
    const handleExperienceRate = rate => {
        setRateExp(rate);
    };

    const handleChangeReason = e => {
        setCancelReason(e.target.value);
    };

    const onClose = () => {
        setRateExp(null);
        setCancelReason(null);
        onCancel();
    };

    const isDisabled =
        !cancelReason ||
        !feedback ||
        !rateExp ||
        (cancelReason === 'SERVICE_SWITCH' && !specifyAnotherService) ||
        (cancelReason === 'OTHER' && !otherReason);

    const handleSubmit = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    setIsLoading(true);

                    try {
                        // mutation for cancelling here
                        await onConfirmCancel({
                            reason: values.reason,
                            feedback: {
                                description: values.feedback,
                                rating: rateExp,
                            },
                            additionalReason:
                                values.reason === 'SERVICE_SWITCH'
                                    ? values.specifyAnotherService
                                    : values.reason === 'OTHER'
                                    ? values.otherReason
                                    : undefined,
                        });
                        setIsLoading(false);
                        if (refetch) {
                            await refetch()
                        }
                        return true;
                    } catch (e) {
                        setIsLoading(false);
                        console.error(e);
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, onConfirmCancel, rateExp, refetch]
    );

    return (
        <Popup
            $variant="default"
            width={500}
            title={`Why do you wish to ${isCancelling ? 'cancel' : 'pause'} your subscription?`}
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
        >
            <Text $textVariant="P4" $colorScheme="secondary" $mb="20">
                {isCancelling ? 'Note that by cancelling your account you will lose access to your requests and files.' : 'Note that by pausing your subscription you won’t be able to submit a request.'}
            </Text>
            <Form
                onFinish={handleSubmit}
                name="confirmCancelModalForm"
                form={form}
                initialValues={{
                    reason: null,
                    specifyAnotherService: '',
                    otherReason: '',
                    feedback: ''
                }}
            >
                <Box $pb="24" $mb="16" $borderB="1" $borderBottomColor="outline-gray" $borderBottomStyle="solid">
                    <Form.Item name="reason" style={{ marginBottom: 0 }}>
                        <RadioGroup onChange={handleChangeReason}>
                            <Radio value="NO_NEED_DESIGN">{isCancelling ? 'I no longer need design services' : 'I don’t need design services for now'}</Radio>
                            <Radio value="NOT_HAPPY_DESIGN">I'm not happy with the quality</Radio>
                            <Radio value="NOT_HAPPY_TURNAROUND">I'm not happy with the turnaround time</Radio>
                            <Radio value="SERVICE_SWITCH">I'm switching to another service</Radio>
                            {cancelReason === 'SERVICE_SWITCH' && (
                                <Box $mt="-1">
                                    <Form.Item
                                        name="specifyAnotherService"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field cannot be empty',
                                            },
                                        ]}
                                        label="Please specify"
                                        colon={false}
                                        required={false}
                                    >
                                        <Input placeholder="Please specify" />
                                    </Form.Item>
                                </Box>
                            )}
                            <Radio value="FREELANCE_HIRE">I'm hiring a freelancer or in-house designer</Radio>
                            <Radio value="OTHER">Other</Radio>
                            {cancelReason === 'OTHER' && (
                                <Box $mt="-1">
                                    <Form.Item
                                        label="Please specify"
                                        colon={false}
                                        required={false}
                                        style={{ marginBottom: 6 }}
                                        name="otherReason"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field cannot be empty',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Write your reason" />
                                    </Form.Item>
                                </Box>
                            )}
                        </RadioGroup>
                    </Form.Item>
                </Box>

                <Box $mt="-9" $mb={cancelReason === 'OTHER' ? '34' : '20'} />
                <Text $textVariant="H6" $colorScheme="primary" $mb="20">
                    How would you rate your experience?
                </Text>
                <Form.Item>
                    <Box $d="flex" $justifyContent="center" $alignItems="center">
                        <Box $mx="14" $textAlign="center" onClick={() => handleExperienceRate('bad')}>
                            <Box
                                $w="50"
                                $mb="4"
                                $bg={rateExp === 'bad' ? 'badge-red' : 'bg-gray'}
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor={rateExp === 'bad' ? 'other-red' : 'transparent'}
                                $radii="4"
                                $px="8.14"
                                $py="8.14"
                                $cursor="pointer"
                            >
                                <img src={bad} alt="Bad" />
                            </Box>
                            <Text $textVariant="H6" $colorScheme="primary">
                                Bad
                            </Text>
                        </Box>
                        <Box $mx="14" $textAlign="center" onClick={() => handleExperienceRate('neutral')}>
                            <Box
                                $w="50"
                                $mb="4"
                                $bg={rateExp === 'neutral' ? 'badge-yellow' : 'bg-gray'}
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor={rateExp === 'neutral' ? 'other-yellow' : 'transparent'}
                                $radii="4"
                                $px="8.14"
                                $py="8.14"
                                $cursor="pointer"
                            >
                                <img src={neutral} alt="Neutral" />
                            </Box>
                            <Text $textVariant="H6" $colorScheme="primary">
                                Neutral
                            </Text>
                        </Box>
                        <Box $mx="14" $textAlign="center" onClick={() => handleExperienceRate('great')}>
                            <Box
                                $w="50"
                                $mb="4"
                                $bg={rateExp === 'great' ? 'badge-green' : 'bg-gray'}
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor={rateExp === 'great' ? 'other-green' : 'transparent'}
                                $radii="4"
                                $px="8.14"
                                $py="8.14"
                                $cursor="pointer"
                            >
                                <img src={great} alt="Great" />
                            </Box>
                            <Text $textVariant="H6" $colorScheme="primary">
                                Great
                            </Text>
                        </Box>
                    </Box>
                </Form.Item>
                {rateExp && (
                    <Box $mt="-13">
                        <Box $mb="9" hide="mobile">
                            <TooltipIconBlock
                                $textVariant="P4"
                                $colorScheme="primary"
                                label={tooltipOptions[rateExp].label}
                                tooltip={tooltipOptions[rateExp].tooltip}
                                isInlineBlock
                            />
                        </Box>
                        <Text hide="desktop" $mb="9" $textVariant="P4" $colorScheme="primary">
                            {tooltipOptions[rateExp].label}
                        </Text>
                        <Form.Item
                            name="feedback"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field cannot be empty',
                                },
                            ]}
                        >
                            <TextArea rows={5} placeholder="Please share your feedback" />
                        </Form.Item>
                    </Box>
                )}
                <Form.Item>
                    <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                        <Box $mr={['0', '14']} $mb={['16', '0']}>
                            <Button
                                type={isCancelling ? (isDisabled ? 'primary' : 'danger') : 'default'}
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isDisabled}
                                $w={['100%', 'auto']}
                            >
                                {isCancelling ? 'Confirm cancellation' : 'Pause Subscription'}
                            </Button>
                        </Box>
                        <Button type="primary" onClick={onClose} $w={['100%', 'auto']}>
                            Keep me subscribed
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default ConfirmCancelModal;
