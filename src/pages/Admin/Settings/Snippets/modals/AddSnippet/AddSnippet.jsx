import React, { useState, memo, useCallback } from 'react';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';
import { Wysiwyg } from '@components/Wysiwyg';

const AddSnippet = memo(({ mentions, visible, onCancel, onAdd, refetch }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.loading('Adding snippet...', 50000);

                try {
                    await onAdd({ ...values });
                    await refetch();
                    message.destroy();
                    message.success('Snippet successfully added');
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
    }, [isLoading, validateFields, onAdd, onCancel, refetch]);

    return (
        <Popup $variant="default" width={900} title="Add Snippet" open={visible} onCancel={onCancel} footer={null} centered destroyOnClose>
            <Form onFinish={handleSubmit} name="addSnippetForm" form={form}>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                    name="name"
                    label="Name"
                    colon={false}
                    required={true}
                >
                    <Input autoFocus placeholder="Enter snippet name" />
                </Form.Item>
                <Form.Item name="text" label="Snippet text" colon={false} required={true} style={{ marginBottom: 16 }}>
                    <Wysiwyg $contentMinHeight="202px" placeholder="Write your snippet text" mentions={mentions} disableEnterKey={false} />
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

export default AddSnippet;
