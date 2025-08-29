import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Form } from '@components/Form';
import { AttachmentPlugin, parseLinks, SendButtonPlugin, toHtml, toWysiwyg, Wysiwyg } from '@components/Wysiwyg';
import { EditorState, getDefaultKeyBinding } from 'draft-js';
import { useMutation } from '@apollo/client';
import message from '@components/Message';
import { Button } from '@components/Button';
import CloseIcon from '@components/Svg/Close';
import { Box } from '@components/Box';
import {
    ORDER_STATUS_COMPLETED,
    ORDER_STATUS_DELIVERED_PROJECT,
    ORDER_STATUS_DELIVERED_REVISION,
    ORDER_STATUS_QUEUED,
} from '@constants/order';
import { Popup } from '@components/Popup';
import { CHANGE_ORDER_STATUS, MARK_AS_COMPLETE, UPDATE_ORDERS_PRIORITY } from '@graphql/mutations/order';
import FormDeliveredRevision from './FormDeliveredRevision';
import FormRequestComplete from './FormRequestComplete';
import { useDetailContext } from './DetailContext';

const generateLocalStorageKey = requestId => `request_message_${requestId}`;

const FormInputMessage = ({ onSubmit, editingValues, onChange, onCloseEdit }) => {
    const editorRef = useRef();
    const formContainerRef = useRef();
    const [form] = Form.useForm();
    const { request, refetchRequests, users } = useDetailContext();
    const [fileIds, setFileIds] = useState([]);
    const [hasSent, setHasSent] = useState(false);
    const [hasMessage, setHasMessage] = useState(false);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
    const [isOpenPopupDelivered, setIsOpenPopupDelivered] = useState(false);
    const [isShowComplete, setIsShowComplete] = useState(false);
    const [activeMessageType, setActiveMessageType] = useState('REPLY');

    const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
    const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS);
    const [updateOrdersPriority] = useMutation(UPDATE_ORDERS_PRIORITY);
    const { setFieldsValue } = form;
    const content = Form.useWatch('content', form);
    let mentionedIds = [];

    const mentions = users?.map(user => ({
        text: `${user.firstname} ${user.lastname[0]}`,
        value: `${user.firstname} ${user.lastname[0]}`,
        url: user.id,
    }));

    const localStorageKey = useMemo(() => {
        return generateLocalStorageKey(request.id);
    }, [request]);

    useEffect(() => {
        return () => {
            if (content) {
                window.localStorage.setItem(localStorageKey, toHtml(content));
            }
        };
    }, [content, localStorageKey]);

    useEffect(() => {
        setFieldsValue({
            ...editingValues,
            content: toWysiwyg(editingValues?.content),
        });
    }, [setFieldsValue, editingValues]);

    useEffect(() => {
        const fileExists = fileIds.length > 0;
        setIsSendButtonDisabled(isUploadingFiles || (!isUploadingFiles && !hasMessage && !fileExists));
    }, [hasMessage, isUploadingFiles, fileIds]);

    const handleChange = useCallback(
        editorState => {
            if (onChange) {
                onChange(editorState);
            }

            if (typeof editorState === 'string') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = editorState;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                setHasMessage(textContent.trim() !== '');
            } else {
                setHasMessage(false);
            }
        },
        [onChange]
    );

    const handleBlurInput = useCallback(() => {
        if (hasMessage) {
            window.localStorage.setItem(localStorageKey, toHtml(content));
        }
    }, [content]);

    const handleClickClose = () => {
        setFieldsValue({
            content: EditorState.createEmpty(),
        });

        if (onCloseEdit) {
            onCloseEdit();
        }
    };

    const handleGetFileIds = attachmentIds => {
        setFileIds(attachmentIds);
    };

    const handleRemoveFileId = (attachmentId, index) => {
        const filteredFileIds = fileIds.filter((fileId, fileIndex) =>
            attachmentId !== null ? fileId !== attachmentId : fileIndex !== index
        );
        setFileIds(filteredFileIds);
    };

    const onBlurEditor = () => {
        if (editorRef?.current) {
            editorRef.current.editor.blur();
        }
    };

    const getHtmlFormattedContent = val => {
        let htmlVal = toHtml(val);

        const splitHtmlVal = htmlVal.split(' ').map(word => {
            if (word.includes('datamentionid="')) {
                const newMentionId = word.split('"')[1];
                mentionedIds.push(newMentionId);
            }

            return word;
        });

        htmlVal = splitHtmlVal.join(' ');

        return htmlVal;
    };

    const submitValues = callback => {
        form.validateFields().then(async values => {
            if (onSubmit) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = values?.content || '';
                const textContent = tempDiv.textContent || tempDiv.innerText || '';

                let contentOld =
                    textContent.trim() !== ''
                        ? getHtmlFormattedContent(values?.content)
                        : '<p style="padding: 0; margin: 0;"></p>';

                // Replace URL automatically
                const urlRegex = /(https?:\/\/[^\s<]+)/g;
                // Replace URLs with anchor tags
                contentOld = contentOld.replace(urlRegex, url => {
                    // Check if the link is not already used in a tag
                    if (!/<a[^>]*href=["'][^"']*["'][^>]*>/.test(contentOld)) {
                        return `<a href="${url}" target="_blank">${url}</a>`;
                    }
                    return url;
                });

                contentOld = contentOld.replace(/(<p><br><\/p>)+$/, '').replace(/(<p><\/p>)+$/, '');

                contentOld = parseLinks(contentOld);
                await onSubmit(contentOld, fileIds, activeMessageType, mentionedIds);
                mentionedIds = [];
            }

            window.localStorage.removeItem(localStorageKey);
            setFieldsValue({
                content: '',
            });
            setHasMessage(false);
            setHasSent(true);
            setFileIds([]);

            if (editorRef?.current && editorRef.current.editor) {
                editorRef.current.editor.focus();
            }

            if (callback) {
                await callback();
            }
        });
    };

    const canReopenRequest = useMemo(() => {
        return [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION].indexOf(request.status) > -1;
    }, [request.status]);

    const handleSubmit = () => {
        if ([ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION].indexOf(request.status) > -1) {
            setIsOpenPopupDelivered(true);
        } else {
            submitValues();
        }
    };

    const resetSentStatus = () => {
        setHasSent(false);
    };

    const handleUploadingFiles = bool => {
        setIsUploadingFiles(bool);
    };

    const fromLocalStorage = window.localStorage.getItem(localStorageKey);
    const initialValue = fromLocalStorage ? toWysiwyg(fromLocalStorage) : undefined;

    const handleKeyCommand = command => {
        if (command === 'send-message') {
            const contentOld = form.getFieldValue('content');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentOld;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            if (textContent.trim() !== '' || fileIds?.length > 0) {
                handleSubmit();
                return true;
            }
        }
        return false;
    };

    const handleKeyBindingFn = evt => {
        if (!evt.shiftKey && evt.keyCode === 13) {
            return 'send-message';
        }
        return getDefaultKeyBinding(evt);
    };

    const handleReturn = event => {
        return false;
    };

    const handleChangeMove = value => {
        message.destroy();
        message.loading('Changing request...', 50000);

        submitValues(async () => {
            await changeOrderStatus({
                variables: {
                    id: request.id,
                    status: ORDER_STATUS_QUEUED,
                },
            });

            await updateOrdersPriority({
                variables: {
                    orders: [{ id: request.id, priority: value === 'top' ? 1 : 499 }],
                },
            });
            await refetchRequests();
            setIsOpenPopupDelivered(false);

            message.destroy();
            message.success('Your request status has been updated');
        });
    };

    const handleClickComplete = () => {
        setIsOpenPopupDelivered(false);
        setIsShowComplete(true);
    };

    const handleRequestComplete = async values => {
        message.destroy();
        message.loading('Completing request...', 50000);

        submitValues(async () => {
            const variables = {
                ...values,
                id: request.id,
                status: ORDER_STATUS_COMPLETED,
            };
            await markAsComplete({ variables });
            await refetchRequests();
            setIsShowComplete(false);

            message.destroy();
            message.success('Request completed. Your feedback has been submitted');
        });
    };

    const handleFocusAfterChangeTab = () => {
        if (editorRef) {
            editorRef.current.focusEditor();
        }
    };

    const handleChangeMessageType = val => {
        setActiveMessageType(val);
    };

    useEffect(() => {
        if (fileIds.length > 0) {
            setHasMessage(true);
        }
    }, [fileIds.length]);
    return (
        <Box ref={formContainerRef}>
            <Popup
                open={isShowComplete}
                onCancel={() => setIsShowComplete(false)}
                $variant="default"
                width={500}
                destroyOnClose
                centered
                closable={false}
                footer={null}
            >
                <FormRequestComplete onSuccessSubmit={handleRequestComplete} />
            </Popup>
            <Popup
                open={isOpenPopupDelivered}
                onCancel={() => setIsOpenPopupDelivered(false)}
                $variant="default"
                width={500}
                title="Revisions needed?"
                destroyOnClose
                centered
                footer={null}
            >
                <FormDeliveredRevision onChangeMove={handleChangeMove} onClickComplete={handleClickComplete} />
            </Popup>
            <Form
                onFinish={handleSubmit}
                form={form}
                name="inputMessageFormC"
                initialValues={{
                    content: initialValue,
                }}
            >
                <Form.Item name="content" style={{ marginBottom: 0 }}>
                    <Wysiwyg
                        ref={editorRef}
                        placeholder="Type your message here"
                        $isFlip
                        $contentMaxHeight="200px"
                        $toolbarHeight="40px"
                        $toolbarColor="gray"
                        onBlur={handleBlurInput}
                        onChange={handleChange}
                        onFocusAfterChangeTab={handleFocusAfterChangeTab}
                        handleChangeMessageType={handleChangeMessageType}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={handleKeyBindingFn}
                        handleReturn={handleReturn}
                        fileIds={fileIds}
                        mentions={mentions}
                        canReopenRequest={canReopenRequest}
                        toolbarLeft={
                            <>
                                {editingValues && editingValues.id && (
                                    <Box
                                        hide="desktop"
                                        $d="inline-flex !important"
                                        $alignItems="center"
                                        $pl="4"
                                        $pr="6"
                                    >
                                        <Button
                                            $bg="black"
                                            $colorScheme="white"
                                            $radii="9999"
                                            $px="0"
                                            $h="20"
                                            mobileH="20"
                                            $w="20"
                                            icon={<CloseIcon style={{ fontSize: 10 }} />}
                                            onClick={handleClickClose}
                                        />
                                    </Box>
                                )}
                            </>
                        }
                        toolbarRight={
                            <>
                                <AttachmentPlugin
                                    onSetFileIds={handleGetFileIds}
                                    onRemoveFileId={handleRemoveFileId}
                                    onResetSentStatus={resetSentStatus}
                                    onUploadingFiles={handleUploadingFiles}
                                    onBlurEditor={onBlurEditor}
                                    hasSent={hasSent}
                                    enableShadowDrop
                                />
                                <SendButtonPlugin isDisabled={isSendButtonDisabled} />
                            </>
                        }
                    />
                </Form.Item>
            </Form>
        </Box>
    );
};

export default FormInputMessage;
