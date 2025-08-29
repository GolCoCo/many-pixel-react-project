import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { UPDATE_PAYMENT_METHOD } from '@graphql/mutations/subscription';
import COUNTRIES from '@constants/countries';
import { MANYPIXELS_TERMS_OF_SERVICE_PAGE, MANYPIXELS_PRIVACY_POLICY } from '@constants/general';
import message from '@components/Message';
import { BUY_PLAN } from '@graphql/mutations/plan';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from '@stripe/react-stripe-js';
import { CardInformationError, StripeElementsContainer, stripeStyleObject } from '@components/StripeElements';

import cardIcon from '@public/assets/icons/paymentCard.svg';
import styled from 'styled-components';

const CardInputWrapper = styled.div`
    position: relative;
    width: 100%;
    .card-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        z-index: 1;
    }
    
    .stripe-input {
        padding-left: 40px !important;
        
    }
    .CardBrandIcon-inner{
        height: 24px !important;
    }
`;

const countriesOptions = COUNTRIES.map(country => (
    <Select.Option key={country.name} value={country.code} label={country.name}>
        {country.name}
    </Select.Option>
));

// const statesOptions = STATES.map(state => (
//     <Select.Option key={state.name} value={state.name}>
//         {state.name}
//     </Select.Option>
// ));

const _CardForm = ({ viewer, selectedPlan, selectedPromotion, referrer, onCheckout }) => {
    const stripe = useStripe()

    const [form] = Form.useForm();
    const elements = useElements();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState();
    const [isCardError, setIsCardError] = useState(false);
    const [buyPlan, { error }] = useMutation(BUY_PLAN);
    const [updateBillingAddress] = useMutation(UPDATE_PAYMENT_METHOD);
    const [hasCardValue, setHasCardValue] = useState(false);

    const cardHolderRef = useRef();
    const line1Ref = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const countryRef = useRef('US');
    const zipRef = useRef();
    useEffect(() => {
        if (error?.graphQLErrors && error.graphQLErrors[0]) {
            message.destroy();
            message.error(error.graphQLErrors[0].message);
            setIsLoading(false)
            setTimeout(() => window.location.reload(), 1500)
        }
    }, [error])

    const handleSubmit = useCallback(
        async () => {
            if (stripe && !isLoading) {
                try {
                    setIsLoading(true);
                    message.destroy();
                    message.loading('Validating checkout details...', 50000);

                    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                        type: 'card',
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: cardHolderRef.current.input.value,
                            email: viewer.email,
                            address: {
                                line1: line1Ref.current.input.value,
                                city: cityRef.current.input.value,
                                state: stateRef.current.input.value,
                                country: countryRef.current,
                                postal_code: zipRef.current.input.value,
                            },
                        },
                    });

                    validateFields().then(async (values) => {
                        if (pmError) {
                            message.destroy();
                            setIsLoading(false);
                            setIsCardError(pmError);
                            return false;
                        }

                        const referralDiscountType = referrer?.id ? 'referral' : null;
                        const couponDiscountType = selectedPromotion?.couponType ?? null;

                        await buyPlan({
                            variables: {
                                card: paymentMethod.id,
                                plan: selectedPlan && selectedPlan.id,
                                discount: selectedPromotion?.id,
                                discountType: selectedPromotion ? couponDiscountType : referralDiscountType,
                                referrerId: referrer?.id ?? null,
                            },
                        });
                        await updateBillingAddress({
                            variables: {
                                billingAddress: {
                                    line1: line1Ref.current.input.value,
                                    city: cityRef.current.input.value,
                                    state: stateRef.current.input.value,
                                    country: countryRef.current,
                                    postal_code: zipRef.current.input.value,
                                },
                                card: paymentMethod.id
                            },
                          });
                        message.destroy();
                        message.success('Checkout successful!');
                        onCheckout();
                    });
                } catch (e) {
                    console.log(e)
                    setIsLoading(false);
                    message.destroy();
                }
            } else {
                console.log("Stripe.js hasn't loaded yet.");
            }

            return true;
        },
        [isLoading, viewer, stripe, buyPlan, updateBillingAddress, selectedPlan, selectedPromotion, referrer, validateFields, onCheckout]
    );

    const handleCardChange = (target) => {
        console.log(target)
        setHasCardValue(!target.empty);
        
        // if (target.type === 'error') {
        //     form.setFields([
        //         {
        //             name: 'cardnumber',
        //             errors: [target.message || 'Card number is invalid'],
        //         },
        //     ]);
        // }
    };
    if (!stripe) {
        return <></>
    }
    return (
        <Form
            onFinish={handleSubmit}
            form={form}
            onFinishFailed={({ errorFields, ...rest }) => { console.log({ errorFields, ...rest }); }}
            name="checkoutForm"
            initialValues={{
                country: 'United States',
                
            }}
        >
            <StripeElementsContainer>
            <Box $d="flex" $flexDir="row" $mx="-10px">
                <Box $w="calc(100% - 240px)" $px="10px">
                    <Form.Item
                        label="Card number"
                        colon={false}
                        required
                        style={{ marginBottom: 20 }}
                        // rules={[
                        //     {
                        //         validator: (_, value) => {
                        //                     if (value.type === 'error') {
                        //                 return Promise.reject(new Error(value.message))
                        //             }
                        //             return Promise.resolve()
                        //         },
                        //         message: 'Your card is not valid',
                        //     },
                        // ]}
                        name="cardnumber"
                    >
                        <CardInputWrapper>
                        {!hasCardValue && <img src={cardIcon} alt="Card" className="card-icon" />}
                                <CardNumberElement id='cardnumber' className={`ant-input ${!hasCardValue ? 'stripe-input' : ''}`} options={{ style: stripeStyleObject,  showIcon: hasCardValue, placeholder: 'Enter card number' }} 
                                 onChange={e => handleCardChange(e)}/>
                            </CardInputWrapper>
                    </Form.Item>
                </Box>
                <Box $w="120" $px="10px">
                    <Form.Item
                        name="expirydate"
                        label="Expiry date"
                        colon={false}
                        required
                                rules={[
                            {
                                validator: (_, value) => {
                                            if (value.type === 'error') {
                                        return Promise.reject(new Error(value.message))
                                    }
                                    return Promise.resolve()
                                },
                                message: 'Card expiration date is not valid',
                            },
                        ]}
                    >
                      
                                <CardExpiryElement id="cardexpiry" className="ant-input" options={{ style: stripeStyleObject }} />
                                {/* <StripeCardExpiry id="cardexpiry" className="ant-input" $w="100" style={stripeStyleObject} /> */}
                    </Form.Item>
                </Box>
                <Box $w="120" $px="10px">
                    <Form.Item
                        label="CVV"
                        colon={false}
                        required
                        name="cvv"
                        rules={[
                            {
                                validator: (_, value) => {
                                            if (value.type === 'error') {
                                        return Promise.reject(new Error(value.message))
                                    }
                                    return Promise.resolve()
                                },
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                                <CardCvcElement id="cardcvc" className="ant-input" options={{ style: stripeStyleObject, placeholder: '021' }} />
                    </Form.Item>
                </Box>
            </Box>
            </StripeElementsContainer>
            {isCardError && (
                <Box $mb="30">
                    <CardInformationError>Your card is invalid</CardInformationError>
                </Box>
            )}
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
            >
               <Input ref={cardHolderRef} type="text" placeholder="Enter cardholder name" />
            </Form.Item>
            <Form.Item
                name="billingAddress"
                label="Billing address"
                colon={false}
                required
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
            >
                <Input ref={line1Ref} type="text" placeholder="Enter your billing address" />
            </Form.Item>
            <Form.Item
                name="city"
                label="City"
                colon={false}
                required
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
            >
                <Input ref={cityRef} type="text" placeholder="Enter your city" />
            </Form.Item>
            <Box $d={['block', 'flex']}>
                <Box $flex="1 1 0%" $mr={['0', '17']}>
                    <Form.Item
                        label="State"
                        colon={false}
                        name="state"
                        rules={[
                        {
                            required: false,
                        },
                    ]}>
                        <Input ref={stateRef} type="text" placeholder="Enter your state" />
                    </Form.Item>
                </Box>
                <Box $w={['auto', '142']}>
                    <Form.Item
                        name="zipCode"
                        label="Zip code"
                        colon={false}
                        required
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                    >
                        <Input ref={zipRef} type="text" placeholder="Zip Code" />
                    </Form.Item>
                </Box>
            </Box>
            <Form.Item
                label="Country"
                colon={false}
                required
                name="country"
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
            >
                <Select
                    placeholder="Choose your country"
                    onChange={e => {

                        countryRef.current = e;
                    }}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                >
                    {countriesOptions}
                </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" $w="100%" loading={isLoading}>
                Subscribe
            </Button>
            <Text $textVariant="P4" $colorScheme="secondary" $mt="10">
                By clicking Subscribe you agree to ManyPixels{' '}
                <a href={MANYPIXELS_TERMS_OF_SERVICE_PAGE} target="_blank" rel="noopener noreferrer">
                    Terms Of Service
                </a>{' '}
                and{' '}
                <a href={MANYPIXELS_PRIVACY_POLICY} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </a>
                .
            </Text>
        </Form>
    );
};


const CheckoutForm = memo(props => (
    <Box>
        <_CardForm {...props} />
    </Box>
));

export default CheckoutForm;
