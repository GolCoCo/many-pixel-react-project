import React, { useRef, useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { SET_COMPANY_INFORMATION } from '@graphql/mutations/user';
import { ME } from '@graphql/queries/userConnected';
import withLoggedUser from '@components/WithLoggedUser';
import { NUMBER_OF_EMPLOYEES, TIMEZONES, INDUSTRIES } from '@constants/forms';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { Form } from '@components/Form';
import message from '@components/Message';

const numberOfEmployeesOptions = NUMBER_OF_EMPLOYEES.map(numberOfEmployees => (
    <Select.Option key={numberOfEmployees.value} value={numberOfEmployees.value}>
        {numberOfEmployees.text}
    </Select.Option>
));

const industriesOptions = INDUSTRIES.map(industry => (
    <Select.Option key={industry.value} value={industry.value}>
        {industry.name}
    </Select.Option>
));

const timezonesOptions = TIMEZONES.map(timezone => (
    <Select.Option key={timezone.value} value={timezone.value}>
        {timezone.name}
    </Select.Option>
));

const CompanyInformation = ({ viewer, goNextStep, windowWidth }) => {
    const [form] = Form.useForm();
    const companyIndustryRef = useRef();
    const companyWebsiteRef = useRef();
    const numberOfEmployeesRef = useRef();
    const timezoneRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [setCompanyInformation] = useMutation(SET_COMPANY_INFORMATION, {
        refetchQueries: [{ query: ME }],
        awaitRefetchQueries: true,
    });

    const { validateFields } = form;

    const handleSubmit = useCallback(
        async () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    if (!viewer || !viewer.id) {
                        //TODO Error
                    }

                    setIsLoading(true);
                    message.destroy();
                    message.loading('Setting company information...', 50000);

                    try {
                        const userInfo = {
                            companyName: viewer?.company?.name || '',
                            nbEmployees: numberOfEmployeesRef.current,
                            companyIndustry: companyIndustryRef.current,
                            companyWebsite: viewer?.company?.website || '',
                            timezone: timezoneRef.current,
                            heardManyPixelsFrom: values.hearAboutUs,
                        };

                        await setCompanyInformation({ variables: { id: viewer.id, userInfo } });

                        message.destroy();
                        message.success('Company information saved!');
                        setIsLoading(false);
                        goNextStep();
                    } catch (e) {
                        setIsLoading(false);
                        console.error(e);
                        message.destroy();
                        message.error('Cannot save company information');
                        return false;
                    }
                }
            });
        },
        [isLoading, setCompanyInformation, viewer, goNextStep, validateFields]
    );

    return (
        <Box>
            <Text $textVariant="H3" $colorScheme="headline" $mb="30">
                Company information
            </Text>
            <Form onFinish={handleSubmit} form={form} name="companyInformationForm">
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name="industry"
                    label="Industry"
                    colon={false}
                    required
                >
                    <Select
                        placeholder="Choose your industry type"
                        onChange={e => {
                            companyIndustryRef.current = e;
                        }}
                    >
                        {industriesOptions}
                    </Select>
                </Form.Item>
                <Form.Item name="numberOfEmployees" label="Number of employees" colon={false}>
                        <Select
                            placeholder="Number of employees"
                            onChange={e => {
                                numberOfEmployeesRef.current = e;
                            }}
                        >
                            {numberOfEmployeesOptions}
                        </Select>
                </Form.Item>
                <Form.Item
                    label={windowWidth > 768 ? '' : 'Time zone'}
                    colon={false}
                >
                    <Box hide="mobile" $mb="9">
                        <TooltipIconBlock
                            tooltipIconSize="16px"
                            $textVariant="H6"
                            $colorScheme="primary"
                            label="Time zone"
                            tooltip="This will help us match you with a design team in a suitable time zone."
                            required={true}
                        />
                    </Box>

                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'This field cannot be empty',
                            },
                        ]}
                        name="timezone"
                        style={{ margin: '0', padding: '0'}}
                    >
                        <Select
                            placeholder="Choose your time zone"
                            onChange={e => {
                                timezoneRef.current = e;
                            }}
                        >
                            {timezonesOptions}
                        </Select>
                    </Form.Item>
                </Form.Item>
                {/* <Text $textVariant="H5" $colorScheme="primary" $mb="20">
                    How did you hear about us?
                    <Text $d="inline" $colorScheme="other-red">
                        *
                    </Text>
                </Text> */}
                <Form.Item
                    name="hearAboutUs"
                    label="How did you hear about us?"
                    required
                    colon={false}
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input placeholder="I searched for design subscription company on google" />
                </Form.Item>
                <Box $mt="-10">
                    <Form.Item>
                        <Button $w="100%" type="primary" htmlType="submit" loading={isLoading}>
                            Finish
                        </Button>
                    </Form.Item>
                </Box>
            </Form>
        </Box>
    );
};

export default withLoggedUser(CompanyInformation);
