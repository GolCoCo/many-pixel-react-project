import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import message from '@components/Message';
import { ADD_ORDER_FOLDER } from '@graphql/mutations/folder';

const FormAddFolder = ({ orderId, userId, onSuccessSubmit }) => {
    const [form] = Form.useForm();
    const [isAdding, setIsAdding] = useState(false);
    const [createFolder] = useMutation(ADD_ORDER_FOLDER);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (!isAdding) {
                message.destroy();
                message.loading('Adding folder...');
                setIsAdding(true);

                await createFolder({
                    variables: { orderId, userId, name: values.name },
                })
                    .then(async () => {
                        setIsAdding(false);
                        await onSuccessSubmit();
                    })
                    .catch(error => {
                        setIsAdding(false);
                        message.destroy();
                        const errors = error.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on adding folder';
                        message.error(formErrorMessage);
                    });
            }
        });
    };

    return (
        <Form onFinish={handleSubmit} form={form} name="addFolderForm">
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
                name="name"
                label="Folder name"
                colon={false}
                required={false}
            >
                <Input ref={inputRef} placeholder="Enter folder name" />
            </Form.Item>
            <Box $textAlign="right">
                <Button htmlType="submit" type="primary" $h="34" $fontSize="12" loading={isAdding}>
                    Add
                </Button>
            </Box>
        </Form>
    );
};

export default FormAddFolder;
