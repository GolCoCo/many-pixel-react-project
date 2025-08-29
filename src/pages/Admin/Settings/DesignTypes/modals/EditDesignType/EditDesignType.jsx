import React, { useState, memo, useCallback } from 'react';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';

const EditDesignType = memo(({ visible, onCancel, onEdit, refetchDesignTypes, selectedData }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.loading('Updating design type...', 50000);

                try {
                    await onEdit({ ...values });
                    message.destroy();
                    message.success('Design type has been updated');
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
    }, [isLoading, validateFields, onEdit, onCancel, refetchDesignTypes]);

    return (
        <Popup $variant="default" width={500} title="Edit design type" open={visible} onCancel={onCancel} footer={null} centered destroyOnClose>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="editDesignTypeForm"
                initialValues={{
                    name: selectedData?.name,
                }}
            >
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name="name"
                    label="Design type"
                    colon={false}
                    required={false}
                >
                    <Input autoFocus />
                </Form.Item>
                <Form.Item>
                    <Box $d="flex" $justifyContent="flex-end">
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Box>
                </Form.Item>
            </Form>
        </Popup>
    );
});

export default EditDesignType;
