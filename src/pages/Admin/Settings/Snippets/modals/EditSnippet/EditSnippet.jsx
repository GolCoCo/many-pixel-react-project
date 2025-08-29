import React, { useState, memo, useCallback, useEffect } from 'react';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import message from '@components/Message';
import { Wysiwyg, toWysiwyg } from '@components/Wysiwyg';

const EditSnippet = memo(({ mentions, visible, onCancel, onEdit, refetch, selectedData }) => {
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                setIsLoading(true);
                message.loading('Updating snippet...', 50000);

                try {
                    await onEdit({ ...values });
                    message.destroy();
                    message.success('Snippet has been updated');
                    await refetch();
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
    }, [isLoading, validateFields, onEdit, onCancel, refetch]);

    return (
        <Popup $variant="default" width={900} title="Edit Snippet" open={visible} onCancel={onCancel} footer={null} centered destroyOnClose>
            <Form
                onFinish={handleSubmit}
                form={form}
                initialValues={{
                    name: selectedData?.name,
                    text: toWysiwyg(selectedData?.text),
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
                    label="Name"
                    colon={false}
                    required={true}
                >
                    <Input autoFocus />
                </Form.Item>
                <Form.Item name="text" label="Snippet text" colon={false} required={true} style={{ marginBottom: 16 }}>
                    <Wysiwyg $contentMinHeight="202px" placeholder="Write your snippet text" mentions={mentions} disableEnterKey={false} />
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

export default EditSnippet;
