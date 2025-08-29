import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import { Text } from '@components/Text';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import STATES from '@constants/states';
import COUNTRIES from '@constants/countries';
import { NUMBER_OF_EMPLOYEES } from '@constants/forms';
import { FormItemFlex } from '@components/FormItemFlex';

const countriesOptions = COUNTRIES.map(country => (
    <Select.Option key={country.name} value={country.name}>
        {country.name}
    </Select.Option>
));

const numberOfEmployeesOptions = NUMBER_OF_EMPLOYEES.map(numberOfEmployees => (
    <Select.Option key={numberOfEmployees.value} value={numberOfEmployees.value}>
        {numberOfEmployees.text}
    </Select.Option>
));

const statesOptions = STATES.map(state => (
    <Select.Option key={state.name} value={state.name}>
        {state.name}
    </Select.Option>
));

const InfoTab = memo(({ company }) => {
    const [form] = Form.useForm();
    const paymentMethod = company?.subscription?.paymentMethod;

    return (
        <Box $my={['20', '30']}>
            <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                Profile
            </Text>
            <Form
                form={form}
                name="infoTabForm"
                initialValues={{
                    name: company?.name,
                    industry: company?.industry,
                    website: company?.website,
                    nbEmployees: company?.nbEmployees,
                    billingAddress: paymentMethod?.billingDetails?.address?.line1,
                    city: paymentMethod?.billingDetails?.address?.city,
                    zipCode: paymentMethod?.billingDetails?.address?.postalCode,
                    state: paymentMethod?.billingDetails?.address?.state,
                    country: paymentMethod?.billingDetails?.address?.country,
                    heardManyPixelsFrom: company?.subscription?.user?.heardManyPixelsFrom,
                }}
            >
                <FormItemFlex $justifyContent="space-between" $itemWidthPct={22} spacing={10}>
                    <Box $mb={['16', '30']} $w={['100%', '50%']}>
                        <Form.Item name="name" label="Company name" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '50%']}>
                        <Form.Item name="industry" label="Industry" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                </FormItemFlex>
                <FormItemFlex $justifyContent="space-between" $itemWidthPct={22} spacing={10}>
                    <Box $mb={['16', '30']} $w={['100%', '50%']}>
                        <Form.Item name="website" label="Company website" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '50%']}>
                        <Form.Item name="nbEmployees" label="Number of Employees" colon={false} style={{ marginBottom: 0 }}>
                            <Select disabled>{numberOfEmployeesOptions}</Select>
                        </Form.Item>
                    </Box>
                </FormItemFlex>
                <Box $mb={['16', '30']}>
                    <Form.Item name="billingAddress" label="Address" colon={false} style={{ marginBottom: 0 }}>
                        <Input disabled />
                    </Form.Item>
                </Box>
                <FormItemFlex $justifyContent="space-between" $itemWidthPct={22} spacing={10}>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="city" label="City" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="zipCode" label="Zip code" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="state" label="State" colon={false} style={{ marginBottom: 0 }}>
                            <Select disabled>{statesOptions}</Select>
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w={['100%', '25%']}>
                        <Form.Item name="country" label="Country" colon={false} style={{ marginBottom: 0 }}>
                            <Select disabled>{countriesOptions}</Select>
                        </Form.Item>
                    </Box>
                    <Box $mb={['16', '30']} $w="100%">
                        <Form.Item name="heardManyPixelsFrom" label="How did you hear about us?" colon={false} style={{ marginBottom: 0 }}>
                            <Input disabled />
                        </Form.Item>
                    </Box>
                </FormItemFlex>
            </Form>
        </Box>
    );
});

export default InfoTab;
