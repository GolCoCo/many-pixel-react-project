import React, { memo, useCallback, useState } from 'react';
import { Form } from '@components/Form';
import { useMutation } from '@apollo/client';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { Button } from '@components/Button';
import { Select } from '@components/Select';
import message from '@components/Message';
import { withResponsive } from '@components/ResponsiveProvider';
import { NUMBER_OF_EMPLOYEES, TIMEZONES, INDUSTRIES } from '@constants/forms';
import { COMPANY_ROLE_MEMBER } from '@constants/account';
import { UPDATE_COMPANY_INFORMATION } from '@graphql/mutations/user';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UPLOAD_FILE } from '@graphql/mutations/file';
import Icon from '@ant-design/icons';
import { Skeleton } from '@components/Skeleton';


const numberOfEmployeesOptions = NUMBER_OF_EMPLOYEES.map(numberOfEmployees => (
    <Select.Option key={numberOfEmployees.value} value={numberOfEmployees.value}>
        {numberOfEmployees.text}
    </Select.Option>
));

const industriesOptions = INDUSTRIES.map(industries => (
    <Select.Option key={industries.value} value={industries.value}>
        {industries.name}
    </Select.Option>
));

const timezonesOptions = TIMEZONES.map(timezone => (
    <Select.Option key={timezone.name} value={timezone.name}>
        {timezone.name}
    </Select.Option>
));

const Company = memo(({ user, windowWidth, refetchViewer }) => {
    const [form] = Form.useForm()
    const { validateFields } = form;
    const { id: userId, company, companyRole } = user || {};
    const { name, industry: industries, website, nbEmployees, timezone, logo } = company || {};
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [updateCompanyInformation] = useMutation(UPDATE_COMPANY_INFORMATION);
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const [file, setFile] = useState({ url: ''});

    const [industry] = industries

    const handleSubmitCompany = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isLoading) {
                    message.destroy();
                    message.loading('Updating company information...', 50000);
                    setIsLoading(true);

                    try {
                        await updateCompanyInformation({
                            variables: {
                                userId,
                                name: values.name,
                                website: values.website,
                                nbEmployees: values.nbEmployees,
                                industry: values.industry,
                                timezone: values.timezone,
                                logoId: file.id,
                            },
                        });
                        await refetchViewer();
                        message.destroy();
                        message.success('Company information has been updated');
                        setIsLoading(false);
                        return true;
                    } catch (err) {
                        setIsLoading(false);
                        console.log(err);
                        message.destroy();
                        const errors = err.graphQLErrors || [];
                        const formErrorMessage =
                            errors.length > 0 ? errors[0].message : 'Error on updating company information';
                        message.error(formErrorMessage);
                        return false;
                    }
                }
            });
        },
        [isLoading, validateFields, userId, updateCompanyInformation, file, refetchViewer]
    );


    const customRequest = async options => {
        setIsUploading(true);
        const variables = {
            file: options.file,
        };
        const res = await uploadFile({ variables });
        options.onSuccess(res.data.uploadFile);
        return {
            abort() {
                message.destroy();
                setIsUploading(false);
                message.error('There was an error on uploading your files');
            },
        };
    };

    const handleChange = ({ file }) => {
        if (file.status === 'done') {
            setFile(file.response);
            setIsUploading(false);
        }
    };


    if (!user) {
        return <Box>
            <Skeleton $w="142" $h="20" $mt="34" $mb="34px" />
            <Box $d="flex" $gap="30px" $flexWrap="wrap" $mb="33px">
                {Array.from({ length: 5 }, (_, i) => (
                    <Box>
                        <Skeleton $w="116" $h="16" />
                        <Skeleton $w="380" $h="67" $mt="11" />
                    </Box>
                ))}
            </Box>
            <Skeleton $w="100" $h="40" />
        </Box>
    }

    return (
        <>
            <Text $textVariant="H5" $colorScheme="primary" $mt="30">
                Company information
            </Text>
            <Box $mt="20" $mb="30">
                <Form
                    onFinish={handleSubmitCompany}
                    initialValues={{
                        name: name || '',
                        industry: industry || undefined,
                        website: website || '',
                        nbEmployees: nbEmployees || undefined,
                        timezone: timezone || undefined,
                    }}
                    form={form}
                    name="companyForm"
                >
                    <Box $d={['block', 'flex']} $flexWrap="wrap" $mx={['0', '-15']}>
                        <Box $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']}>
                            <Form.Item
                                label={windowWidth > 768 ? '' : 'Company name'}
                                colon={false}
                                required={false}
                              
                            >
                                <Box hide="mobile" $mb="10">
                                    <TooltipIconBlock
                                        $textVariant="H6"
                                        $colorScheme="primary"
                                        label="Company name"
                                        tooltip="If you don't have a company, you can enter your name."
                                        $w="370"
                                    />
                                </Box>
                                <Form.Item
                                    style={{ margin: '0', padding: '0' }}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field cannot be empty',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your company name"
                                        disabled={companyRole === COMPANY_ROLE_MEMBER}
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Box>
                        <Box $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']}>
                            <Form.Item
                                label="Industry"
                                colon={false}
                                required={false}
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field cannot be empty',
                                    },
                                ]}
                                name="industry"
                            >
                                    <Select
                                        placeholder="Choose your industry"
                                        disabled={companyRole === COMPANY_ROLE_MEMBER}
                                    >
                                        {industriesOptions}
                                    </Select>
                            </Form.Item>
                        </Box>
                        <Box $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']}>
                            <Form.Item
                                name="website"
                                label="Company website"
                                colon={false}
                            >
                                    <Input
                                        placeholder="Enter your company website"
                                        disabled={companyRole === COMPANY_ROLE_MEMBER}
                                    />
                            </Form.Item>
                        </Box>
                        <Box $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']}>
                            <Form.Item
                                name="nbEmployees"
                                label="Number of employees"
                                colon={false}
                            >
                                    <Select
                                        placeholder="Choose your number of employees"
                                        disabled={companyRole === COMPANY_ROLE_MEMBER}
                                    >
                                        {numberOfEmployeesOptions}
                                    </Select>
                            </Form.Item>
                        </Box>
                        <Box $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']}>
                            <Form.Item
                                label={windowWidth > 768 ? '' : 'Time zone'}
                                colon={false}
                                required={false}
                            >
                                <Box $mb="10" hide="mobile" $h="20">
                                    <TooltipIconBlock
                                        $textVariant="H6"
                                        $colorScheme="primary"
                                        label="Time zone"
                                        tooltip="This will help us match you with a design team in a suitable time zone."
                                    />
                                </Box>
                                <Form.Item
                                    style={{ margin: '0', padding: '0' }}
                                    name="timezone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field cannot be empty',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Choose your time zone"
                                        disabled={companyRole === COMPANY_ROLE_MEMBER}
                                    >
                                        {timezonesOptions}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Box>
                        <Box $d={['none', 'block']} $flex="1 1 380px" $w={['100%', '380']} $mx={['0', '15']} />
                    </Box>
                    <Box >
                        <Form.Item>
                            <Text $textVariant="H6" $mb="10">Logo</Text>
                            <Upload
                                name="logo"
                                accept="image/*"
                                showUploadList={false}
                                onChange={file => handleChange(file)}
                                customRequest={file => customRequest(file)}
                                disabled={companyRole === COMPANY_ROLE_MEMBER}
                            >
                                {!file?.url && !logo?.url && !isUploading ? (
                                    <Box
                                        $cursor="pointer"
                                        $justifyContent="center"
                                        $alignItems="center"
                                        $d="flex"
                                        $flexDir="column"
                                        $w="104"
                                        $h="104"
                                        $borderColor="outline-gray"
                                        $borderW="1"
                                        $borderStyle="dashed"
                                        $bg="bg-gray"
                                        $overflow="hidden"
                                        $radii="10"
                                    >
                                        <PlusOutlined style={{ fontSize: "32px" }}/>
                                        <Text $mt="10">Upload</Text>
                                    </Box>
                                ) : null}
                                {(file?.url || logo?.url) && !isUploading ? (
                                    <Box
                                        $w="104"
                                        $radii="10"
                                        $h="104"
                                        $borderColor="outline-gray"
                                        $borderStyle="solid"
                                        $borderW="1"
                                        $bg={companyRole === COMPANY_ROLE_MEMBER ? 'bg-gray' : 'bg-white'}
                                        $justifyContent="center"
                                        $alignItems="center"
                                        $d="flex"
                                        $cursor="pointer"
                                        $overflow="hidden"
                                    >
                                        <img src={file?.url || logo?.url} width="67" height="67" alt="LOGO"/>
                                    </Box>
                                ) : null}
                                {isUploading ? (
                                    <Box
                                        $justifyContent="center"
                                        $alignItems="center"
                                        $d="flex"
                                        $flexDir="column"
                                        $w="104"
                                        $h="104"
                                        $borderColor="outline-gray"
                                        $borderW="1"
                                        $borderStyle="dashed"
                                        $bg="bg-gray"
                                        $overflow="hidden"
                                    >
                                        <Icon component={LoadingOutlined} style={{ fontSize: 30 }} />
                                    </Box>
                                ) : null}
                            </Upload>
                        </Form.Item>
                    </Box>
                    {companyRole !== COMPANY_ROLE_MEMBER && (
                        <Form.Item>
                            <Button $w={['100%', 'auto']} type="primary" htmlType="submit" loading={isLoading}>
                                Update
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Box>
        </>
    );
});

export default withResponsive(Company);
