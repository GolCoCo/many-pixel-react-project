import React, { useState, useRef } from 'react';
import { Form } from '@components/Form';
import { AttachmentPlugin, Wysiwyg } from '@components/Wysiwyg';
import { FieldMove } from './FieldMove.jsx';
import { Box } from '@components/Box';
import { Button } from '@components/Button';

const FormReopenRequest = ({ onSuccessSubmit }) => {
    const [form] = Form.useForm();
    const editorRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileIds, setFileIds] = useState([]);
    const [hasSent, setHasSent] = useState(false);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);

    const handleSubmit = ev => {
        form.validateFields().then(async values => {
            if (isSubmitting) {
                return;
            }

            console.log(onSuccessSubmit);
            if (onSuccessSubmit) {
                setIsSubmitting(true);
                await onSuccessSubmit({ ...values, fileIds });
                setIsSubmitting(false);
            }
        });
    };

    const handleGetFileIds = attachmentIds => {
        setFileIds(attachmentIds);
    };

    const handleRemoveFileId = (attachmentId, index) => {
        const filteredFileIds = fileIds.filter((fileId, fileIndex) => (attachmentId !== null ? fileId !== attachmentId : fileIndex !== index));
        setFileIds(filteredFileIds);
    };

    const resetSentStatus = () => {
        setHasSent(false);
    };

    const handleUploadingFiles = bool => {
        setIsUploadingFiles(bool);
    };

    const onBlurEditor = () => {
        if (editorRef?.current) {
            editorRef.current.editor.blur();
        }
    };

    return (
        <Form onFinish={handleSubmit} form={form} name="reopenRequestFormC">
            <Form.Item name="message" label="Message" colon={false} required={false}>
                <Wysiwyg
                    ref={editorRef}
                    placeholder="Type your message here"
                    $contentMinHeight="120px"
                    $isFlip
                    $toolbarColor="gray"
                    $isReopen={true}
                    toolbarRight={
                        <AttachmentPlugin
                            onSetFileIds={handleGetFileIds}
                            onRemoveFileId={handleRemoveFileId}
                            onResetSentStatus={resetSentStatus}
                            onUploadingFiles={handleUploadingFiles}
                            onBlurEditor={onBlurEditor}
                            hasSent={hasSent}
                        />
                    }
                />
            </Form.Item>
            <Form.Item name="move" label="Move to" colon={false} required={false}>
                <FieldMove showRadio />
            </Form.Item>
            <Box $textAlign="right">
                <Button disabled={isUploadingFiles} type="primary" htmlType="submit" loading={isSubmitting}>
                    Reopen request
                </Button>
            </Box>
        </Form>
    );
};

export default FormReopenRequest;
