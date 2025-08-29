import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '@components/Form';
import { Input } from '@components/Input';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import message from '@components/Message';
import { RENAME_ORDER_FOLDER } from '@graphql/mutations/folder';

const FormRenameFolder = ({ folderId, folderName, onSuccessSubmit }) => {
    const [form] = Form.useForm();
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameFolder] = useMutation(RENAME_ORDER_FOLDER);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (!isRenaming) {
                message.destroy();
                message.loading('Renaming folder...');
                setIsRenaming(true);

                await renameFolder({
                    variables: { folderId, oldName: folderName, name: values.name },
                })
                    .then(async () => {
                        setIsRenaming(false);
                        await onSuccessSubmit();
                    })
                    .catch(error => {
                        setIsRenaming(false);
                        message.destroy();
                        const errors = error.graphQLErrors || [];
                        const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on renaming folder';
                        message.error(formErrorMessage);
                    });
            }
        });
    };

    return (
        <Form onFinish={handleSubmit} name="renameFolderForm" form={form} initialValues={{ name: folderName }}>
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

export default FormRenameFolder;
