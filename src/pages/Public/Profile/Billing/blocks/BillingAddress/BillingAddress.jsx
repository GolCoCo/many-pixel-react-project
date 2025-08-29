import React, { useState, useCallback, memo } from 'react';
import { Form } from '@components/Form';
import message from '@components/Message';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Select } from '@components/Select';
import { FormItemFlex } from '@components/FormItemFlex';
import COUNTRIES from '@constants/countries';
import { UPDATE_PAYMENT_METHOD } from '@graphql/mutations/subscription';
import { useMutation } from '@apollo/client';

const countriesOptions = COUNTRIES.map(country => (
    <Select.Option key={country.name} value={country.code}>
        {country.name}
    </Select.Option>
));

const BillingAddress = memo(({ paymentMethod, refetch }) => {
    const [form] = Form.useForm()
    const { validateFields, } = form;
    const [isLoading, setIsLoading] = useState(false);
    const city = Form.useWatch('city', form)
    const billingAddress = Form.useWatch('billingAddress', form)
    const zipCode = Form.useWatch('zipCode', form)
    const country = Form.useWatch('country', form)
    const [updateBillingAddress] = useMutation(UPDATE_PAYMENT_METHOD);
    const handleSubmit = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    message.loading('Updating billing address...');
                    setIsLoading(true);

                    try {
                        await updateBillingAddress({
                            variables: {
                                billingAddress: {
                                    line1: values.billingAddress,
                                    city: values.city,
                                    postal_code: values.zipCode,
                                    state: values?.state,
                                    country: values.country,
                                },
                            },
                        });
                        await refetch();
                        message.destroy();
                        message.success('Billing address has been updated');
                        setIsLoading(false);
                        return true;
                    } catch (e) {
                        setIsLoading(false);
                        console.error(e);
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, updateBillingAddress, refetch]
    );

    const isDisabled = !(billingAddress && city && zipCode && country);

    let countryBilling = paymentMethod?.billingDetails?.address?.country;
    if (countryBilling && countryBilling.length > 2) {
        const findCountry = COUNTRIES.find(value => value.name === 'countryBilling')
        countryBilling = findCountry ? findCountry.code : 'US'
    }

    return (
        <Box $my={['20', '32']}>
            <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                Billing address
            </Text>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="billingAddressForm"
                initialValues={{
                    billingAddress: paymentMethod?.billingDetails?.address?.line1,
                    city: paymentMethod?.billingDetails?.address?.city,
                    zipCode: paymentMethod?.billingDetails?.address?.postalCode,
                    state: paymentMethod?.billingDetails?.address?.state,
                    country: countryBilling,
                }}
            >
                <Box $mb={['16', '30']}>
                    <Form.Item name="billingAddress" label="Address" colon={false} style={{ marginBottom: 0 }}>
                        <Input placeholder="Enter your billing address" />
                    </Form.Item>
                </Box>
                <FormItemFlex $justifyContent="space-between" $itemWidthPct={22} spacing={10}>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="city" label="City" colon={false} style={{ marginBottom: 0 }}>
                            <Input placeholder="Enter your city" />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="zipCode" label="Zip code" colon={false} style={{ marginBottom: 0 }}>
                            <Input placeholder="Enter your zip code" />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="state" label="State" colon={false} style={{ marginBottom: 0 }}>
                            <Input placeholder="Enter your state" />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="country" label="Country" colon={false} style={{ marginBottom: 0 }}>
                            <Select placeholder="Choose your country">{countriesOptions}</Select>
                        </Form.Item>
                    </Box>
                </FormItemFlex>
                <Box $mt={['4', '0']}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            $h="44"
                            $fontSize="12"
                            type="primary"
                            disabled={isDisabled}
                            htmlType="submit"
                            loading={isLoading}
                            $w={['100%', 'auto']}
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Box>
            </Form>
        </Box>
    );
});

export default BillingAddress;
