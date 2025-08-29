import React, { memo, useCallback, useState, useEffect } from 'react';
import { Radio, RadioGroup } from '@components/Radio';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Form } from '@components/Form';
import message from '@components/Message';

const CancelSubsModal = memo(({ dataPlans, visible, onCancel, currentPlan, onAcceptOffer, onCancelAnyway }) => {
    const [form] = Form.useForm()
    const { validateFields, setFieldsValue } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const pickedPlan = Form.useWatch('plan', form);

    const handleSubmit = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    setIsLoading(true);
                    try {
                        await onAcceptOffer(values.plan);
                        setIsLoading(false);
                        return true;
                    } catch (e) {
                        setIsLoading(false);
                        if (e.message.includes('once!')) {
                            message.destroy();
                            message.error(e.message.replace('GraphQL error:', ''));
                        }
                        console.error(e);
                    }
                }
            });
        },
        [isLoading, validateFields, onAcceptOffer]
    );
    
    useEffect(() => {
        if (error) {
            message.destroy();
            message.error(error.message.replace('GraphQL error:', ''));
            setError(false);
        }
    }, [error])

    if (!dataPlans) {
        return null;
    }

    const isAcceptDisabled = !pickedPlan;

    return (
        <Popup
            $variant="default"
            width={503}
            title="Stay with us and get 30% off on your next 2 months"
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            destroyOnClose
        >
            <Text $textVariant="P4" $colorScheme="primary" $mb="20">
                Would you like to give our service another go? If so, enjoy your next 2 months at 30% off.
            </Text>
            <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                Pick your plan
            </Text>
            <Form 
                name="cancelSubsModalForm"
                onFinish={handleSubmit}
                form={form}
                initialValues={{
                    plan: currentPlan?.id,
                }}
            >
                <Form.Item name="plan">
                    <RadioGroup>
                        {dataPlans.allPlans
                            ?.filter(plan => plan.name !== 'DAILY_OUTPUT')
                            .map(plan => (
                                <Box
                                    key={plan.id}
                                    $d="flex"
                                    $justifyContent="space-between"
                                    $alignItems="center"
                                    $pl="16"
                                    $pr="8"
                                    $py="20"
                                    $borderW="1"
                                    $borderStyle="solid"
                                    $borderColor={pickedPlan === plan.id ? 'cta' : 'outline-gray'}
                                    $bg={pickedPlan === plan.id ? 'bg-light-blue' : 'white'}
                                    $mb="14"
                                    $radii="10"
                                    $cursor="pointer"
                                    onClick={() => setFieldsValue({ plan: plan.id })}
                                >
                                    <Box $flex="1 1 0%">
                                        <Text $d="inline" $textVariant="H6" $colorScheme={pickedPlan === plan.id ? 'cta' : 'primary'}>
                                            {plan.name} -{' '}
                                        </Text>
                                        <Text $d="inline" $textVariant="H6" $colorScheme="cta">
                                            ${(plan.price - plan.price * 0.3).toFixed(2)}/mo
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Radio value={plan.id} />
                                    </Box>
                                </Box>
                            ))}
                    </RadioGroup>
                </Form.Item>
                <Form.Item>
                    <Text $textVariant="P4" $colorScheme="primary" fontStyle="italic" $mt="-20">
                        Note that this offer is only applicable to standard monthly plans, cannot be combined with other promotions and can only be redeemed once. This offer
                        will start as soon as your current subscription expires, i.e. at the end of your current billing
                        cycle.
                    </Text>
                </Form.Item>
                <Form.Item>
                    <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                        <Box $mr={['0', '14']} $mb={['16', '0']}>
                            <Button type="danger" onClick={onCancelAnyway} $w={['100%', 'auto']}>
                                Cancel anyway
                            </Button>
                        </Box>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isAcceptDisabled}
                            loading={isLoading}
                            $w={['100%', 'auto']}
                        >
                            Accept this offer
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default CancelSubsModal;
