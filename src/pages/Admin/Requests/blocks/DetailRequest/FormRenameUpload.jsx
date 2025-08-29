import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import message from '@components/Message';
import { EDIT_FILENAME } from '@graphql/mutations/file';

const FormRenameUpload = ({ initialValues, onSuccessSubmit }) => {
    const [form] = Form.useForm();
    const [isRenaming, setIsRenaming] = useState(false);
    const [updateFile] = useMutation(EDIT_FILENAME);
    const inputRef = useRef(null);
    const initialFileNames = initialValues && initialValues.name ? initialValues.name.split('.') : ['', ''];
    const extensionName = initialFileNames[initialFileNames.length - 1];
    const fileName = (initialValues?.name ?? '').replace(`.${extensionName}`, '');

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (!isRenaming) {
                message.destroy();
                message.loading('Renaming file...');
                setIsRenaming(true);

                await updateFile({
                    variables: { id: initialValues.id, name: `${values.name}.${extensionName}` },
                })
                    .then(async () => {
                        setIsRenaming(false);
                        await onSuccessSubmit({
                            ...values,
                            name: `${values.name}.${extensionName}`,
                        });
                    })
                    .catch(error => {
                        setIsRenaming(false);
                        message.destroy();
                        const errors = error.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on renaming file';
                        message.error(formErrorMessage);
                    });
            }
        });
    };

    return (
        <Form form={form} onFinish={handleSubmit} name="renameUploadForm" initialValues={{ name: fileName }}>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'This field cannot be empty',
                    },
                ]}
                label="File name"
                colon={false}
                required={false}
            >
                <Input ref={inputRef} />
            </Form.Item>
            <Box $textAlign="right">
                <Button htmlType="submit" type="primary" $h="34" $fontSize="12" loading={isRenaming}>
                    Update
                </Button>
            </Box>
        </Form>
    );
};

export default FormRenameUpload;
