import React, { useState, memo, useCallback } from 'react';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';

const AddDesignType = memo(({ visible, onCancel, onAdd, refetchDesignTypes }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.loading('Adding design type...', 50000);

                try {
                    await onAdd({ ...values });
                    message.destroy();
                    message.success('Design type successfully added');
                    await refetchDesignTypes();
                    setIsLoading(false);
                    onCancel();
                    return true;
                } catch (e) {
                    message.destroy();
                    setIsLoading(false);
                    console.error(e);
                    return false;
                }
            }
        });
    }, [isLoading, validateFields, onAdd, onCancel, refetchDesignTypes]);

    return (
        <Popup $variant="default" width={500} title="Add design type" open={visible} onCancel={onCancel} footer={null} centered destroyOnClose>
            <Form onFinish={handleSubmit} name="addDesignTypeForm" form={form}>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    label="Design type"
                    colon={false}
                    required={false}
                >
                    <Input autoFocus placeholder="Enter design type" />
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default AddDesignType;
