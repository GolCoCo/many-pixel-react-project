import React, { useCallback, useState } from 'react';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Form } from '@components/Form';
import { AttachmentPlugin, toWysiwyg, Wysiwyg, toHtml, parseLinks } from '@components/Wysiwyg';
import { PopupDelete } from '@components/Popup';
import { Text } from '@components/Text';
import { getDefaultKeyBinding } from 'draft-js';

const FormMessageEdit = ({ initialValues, onCancel, onSubmit, onDelete, isNote, users }) => {
    const [form] = Form.useForm();
    const [fileIds, setFileIds] = useState([]);
    const [hasSent, setHasSent] = useState(false);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [loading, setSubmitting] = useState(false);
    const [hasMessage, setHasMessage] = useState(false);
    const [isShowDelete, setShowDelete] = useState(false);

    const handleChange = useCallback(editorState => {
        if (typeof editorState === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = editorState;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            setHasMessage(textContent.trim() !== '');
        } else {
            setHasMessage(false);
        }
    }, []);

    const handleGetFileIds = attachmentIds => {
        setFileIds(attachmentIds);
    };

    const handleRemoveFileId = (attachmentId, index) => {
        const filteredFileIds = fileIds.filter((fileId, fileIndex) =>
            attachmentId !== null ? fileId !== attachmentId : fileIndex !== index
        );
        setFileIds(filteredFileIds);
    };

    const resetSentStatus = () => {
        setHasSent(false);
    };

    const handleUploadingFiles = bool => {
        setIsUploadingFiles(bool);
    };

    const handleHideDelete = () => {
        setShowDelete(false);
        setSubmitting(false);
    };

    const getMentionedIds = val => {
        const htmlVal = toHtml(val);
        const mentionedIds = [];

        // eslint-disable-next-line
        const splitHtmlVal = htmlVal.split(' ').map(word => {
            if (word.includes('datamentionid="')) {
                const newMentionId = word.split('"')[1];
                mentionedIds.push(newMentionId);
            }

            return word;
        });

        return mentionedIds;
    };

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (!loading) {
                console.log(values);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = values.text;
                let textContent = values.text || tempDiv.textContent || tempDiv.innerText || '';

                const urlRegex = /(https?:\/\/[^\s<]+)/g;
                // Replace URLs with anchor tags
                textContent = textContent.replace(urlRegex, url => {
                    // Check if the link is not already used in a tag
                    if (!/<a[^>]*href=["'][^"']*["'][^>]*>/.test(textContent)) {
                        return `<a href="${url}" target="_blank">${url}</a>`;
                    }
                    return url;
                });

                textContent = textContent.replace(/(<p><br><\/p>)+$/, '').replace(/(<p><\/p>)+$/, '');

                const isMessageNotEmpty = textContent.trim() !== '';
                const mentionedIds = getMentionedIds(values.text);
                if (isMessageNotEmpty || fileIds.length) {
                    textContent = parseLinks(textContent);
                    await onSubmit({ ...values, text: textContent, fileIds, mentionedIds });
                    setFileIds([]);
                    setHasSent(true);
                    setSubmitting(false);
                } else {
                    setShowDelete(true);
                }
            }
        });
    };

    const handleConfirmDelete = async () => {
        await onDelete();
        setFileIds([]);
        setHasSent(true);
    };

    const handleKeyCommand = command => {
        if (command === 'send-message') {
            handleSubmit();
            return 'handled';
        }
        return false;
    };

    const handleKeyBindingFn = evt => {
        if (!evt.shiftKey && evt.keyCode === 13) {
            return 'send-message';
        }

        // handle typing event
        return getDefaultKeyBinding(evt);
    };

    const handleReturn = event => {
        return false;
    };

    const mentions = users?.map(user => ({
        text: `${user.firstname} ${user.lastname[0]}`,
        value: `${user.firstname} ${user.lastname[0]}`,
        url: user.id,
    }));

    return (
        <>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="messageEditForm"
                initialValues={{ text: toWysiwyg(initialValues?.text) }}
            >
                <Form.Item name="text" style={{ marginBottom: 12 }}>
                    <Wysiwyg
                        $isNotCustomer={false}
                        placeholder="Type your message here"
                        $isFlip
                        isNote={isNote}
                        isCustomer={false}
                        $contentMaxHeight="200px"
                        $toolbarHeight="40px"
                        $toolbarColor="gray"
                        onChange={handleChange}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={handleKeyBindingFn}
                        handleReturn={handleReturn}
                        mentions={mentions}
                        toolbarRight={
                            <AttachmentPlugin
                                onSetFileIds={handleGetFileIds}
                                onRemoveFileId={handleRemoveFileId}
                                onResetSentStatus={resetSentStatus}
                                onUploadingFiles={handleUploadingFiles}
                                hasSent={hasSent}
                            />
                        }
                    />
                </Form.Item>
                <Box>
                    <Button
                        type="default"
                        $h={['34', '34']}
                        $fontSize="12"
                        htmlType="button"
                        onClick={onCancel}
                        $mr="10"
                        disabled={isUploadingFiles}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        $h={['34', '34']}
                        loading={loading}
                        $fontSize="12"
                        htmlType="submit"
                        disabled={isUploadingFiles}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Form>
            <PopupDelete
                open={isShowDelete}
                onOk={handleConfirmDelete}
                onCancel={handleHideDelete}
                title="Are you sure you want to delete this message?"
            >
                <Text>This action cannot be undone</Text>
            </PopupDelete>
        </>
    );
};

export default FormMessageEdit;
