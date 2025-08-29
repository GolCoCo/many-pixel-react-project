import React, { memo, useCallback, useState } from 'react';
import { Button } from '@components/Button';
import message from '@components/Message';
import { Box } from '@components/Box';
import { Form } from '@components/Form';

import { Input } from '@components/Input';
import { UPDATE_PAYMENT_METHOD } from '@graphql/mutations/subscription';
import { useMutation } from '@apollo/client';
import { stripeStyleObject, StripeElementsContainer, stripeStyleObjectCentered } from '@components/StripeElements';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import styled from 'styled-components';

const WrappedCardExpiryElement = styled(CardExpiryElement)`
    &.ant-input.StripeElement {
        width: 68px;
        padding: 12px 0;
    }
`;
const WrappedCardCvcElement = styled(CardCvcElement)`
    &.ant-input.StripeElement {
        width: 52px;
        padding: 12px 10px;
    }
`;


const _CardForm = ({ onClose, paymentMethod, refetchSubscriptionInvoice }) => {
    const stripe = useStripe()
    if (!stripe) {
        return;
    }
    const [form] = Form.useForm()
    const elements = useElements()
    const { validateFields, getFieldsValue } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [isCardError, setIsCardError] = useState(false);

    const [updatePaymentMethod] = useMutation(UPDATE_PAYMENT_METHOD);
    const cardHolder = Form.useWatch('cardHolder', form)
    const cvc = Form.useWatch('cvc', form)
    const expirydate = Form.useWatch('expirydate', form)
    const cardnumber = Form.useWatch('cardnumber', form)
    const handleSubmit = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    message.destroy();
                    message.loading('Updating card...');
                    setIsLoading(true);

                    try {
                        const { error: pmError, paymentMethod: newPaymentMethod } = await stripe.createPaymentMethod({
                            type: 'card',
                            card: elements.getElement(CardNumberElement),
                            billing_details: {
                                name: values.cardHolder,
                                email: paymentMethod?.billingDetails?.email,
                                address: {
                                    line1: paymentMethod?.billingDetails?.address?.line1,
                                    city: paymentMethod?.billingDetails?.address?.city,
                                    state: paymentMethod?.billingDetails?.address?.state,
                                    country: paymentMethod?.billingDetails?.card?.country,
                                    postal_code: paymentMethod?.billingDetails?.address?.postalCode
                                }
                            },
                        });

                        if (pmError) {
                            setIsCardError(true)
                            throw pmError;
                        }


                        const paymentMethodId = newPaymentMethod.id;
                        const resultUpdatePaymentMethod = await updatePaymentMethod({
                            variables: {
                                card: paymentMethodId,
                            },
                        });

                        if (resultUpdatePaymentMethod.errors?.length > 0) {
                            throw resultUpdatePaymentMethod.errors[0];
                        }

                        await refetchSubscriptionInvoice();

                        message.success('Card updated.');
                        setIsLoading(false);
                        onClose();
                        return true;
                    } catch (e) {
                        setIsLoading(false);
                        console.log(e);
                        message.destroy();
                        message.error('Error while updating card');
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, onClose, stripe, updatePaymentMethod, refetchSubscriptionInvoice, paymentMethod]
    );

    const isDisabled = !(
        cardHolder &&
        cardnumber?.complete &&
        cvc?.complete &&
        expirydate?.complete
    )

    return (
        <Form
            onFinish={handleSubmit}
            name="editCardForm"
            form={form}
            initialValues={{
                cardHolder: ""
            }}
        >
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
                name="cardHolder"
                label="Cardholder name"
                colon={false}
                required
                style={{ marginBottom: 16 }}
            >
                <Input type="text" placeholder="Enter cardholder name" />
            </Form.Item>
            <Box>

                <StripeElementsContainer>
                    <Form.Item
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value.error) {

                                        return Promise.reject(new Error(value.error.message))
                                    }

                                    return Promise.resolve()
                                },
                                message: 'Your card is not valid',
                            },
                        ]}
                        name="cardnumber"
                        label="Card number"
                        colon={false}
                        required style={{ marginBottom: 16 }}
                    >
                        <CardNumberElement id='cardnumber' className='ant-input' options={{ style: stripeStyleObject, showIcon: true, placeholder: '• • • •  • • • •  • • • •  • • • •' }} />
                    </Form.Item>
                    <Box $d="flex">
                        <Box $pr="24">
                            <Form.Item
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value.error) {
                                                return Promise.reject(new Error(value.error.message))
                                            }
                                            return Promise.resolve()
                                        },
                                        message: 'Card expiration date is not valid',
                                    },
                                ]}
                                name="expirydate"
                                label="Expiry date"
                                colon={false}
                                // style={{width: 86}}
                                required
                            >
                                <WrappedCardExpiryElement id="cardexpiry" className="ant-input" options={{ style: stripeStyleObjectCentered }}
                                    placeholder={`${paymentMethod.card ? `${paymentMethod?.card?.expMonth < 10 ? '0' : ''}${paymentMethod?.card.expMonth
                                        }/${paymentMethod?.card.expYear.toString().slice(-2)}` : 'MM/YY'}`} />

                            </Form.Item>
                        </Box>
                        <Box>
                            <Form.Item
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value.error) {
                                                return Promise.reject(new Error(value.error.message))
                                            }
                                            return Promise.resolve()
                                        },
                                        message: 'This field cannot be empty',
                                    },
                                ]}
                                name="cvc"
                                label="CVV"
                                colon={false}
                                required
                            >
                                <WrappedCardCvcElement id="cardcvc" className="ant-input" options={{ style: stripeStyleObjectCentered }} />
                            </Form.Item>
                        </Box>
                    </Box>
                </StripeElementsContainer>
            </Box>
            <Form.Item>
                <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                    <Button type="primary" disabled={isDisabled} htmlType="submit" loading={isLoading} $minW="106" $minH="44">
                        Update
                    </Button>
                </Box>
            </Form.Item>
        </Form>
    );
};


const EditCardForm = props => (
    <Box>
        <_CardForm {...props} />
    </Box>
);

export default memo(EditCardForm);
