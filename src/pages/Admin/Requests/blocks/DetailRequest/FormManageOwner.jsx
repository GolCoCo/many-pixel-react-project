import React, { useState } from 'react';
import { Form } from '@components/Form';
import { Text } from '@components/Text';
import FieldOwnerSelector from '@pages/Customer/Team/blocks/FieldOwnerSelector';
import { Box } from '@components/Box';
import { Button } from '@components/Button';

const FormManageOwner = ({ onSuccessSubmit, options, initialValue }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (isLoading) {
                return;
            }

            if (onSuccessSubmit) {
                setIsLoading(true);
                await onSuccessSubmit(values);
                setIsLoading(false);
            }
        });
    };

    return (
        <Form
            onFinish={handleSubmit}
            name="manageOwnerForms"
            form={form}
            initialValues={{
                ownerIds: initialValue,
            }}
        >
            <Text $textVariant="P4" $mb="20">
                The owner(s) of a request will receive update notifications via email.
            </Text>
            <Form.Item name="ownerIds">
                <FieldOwnerSelector options={options} $mb="14" />
            </Form.Item>
            <Box $textAlign="right">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Update
                </Button>
            </Box>
        </Form>
    );
};

export default FormManageOwner;
