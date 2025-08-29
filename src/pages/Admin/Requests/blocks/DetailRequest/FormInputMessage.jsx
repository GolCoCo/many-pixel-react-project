import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Form } from '@components/Form';
import { AttachmentPlugin, parseLinks, SendButtonPlugin, toHtml, toWysiwyg, Wysiwyg } from '@components/Wysiwyg';
import { EditorState, getDefaultKeyBinding } from 'draft-js';
import { useDetailContext } from './DetailContext.js';
import message from '@components/Message';
import { Button } from '@components/Button';
import CloseIcon from '@components/Svg/Close';
import { Box } from '@components/Box';
import { USER_TYPE_CUSTOMER } from '@constants/account';
import {
    ORDER_STATUS_COMPLETED,
    ORDER_STATUS_DELIVERED_PROJECT,
    ORDER_STATUS_DELIVERED_REVISION,
    ORDER_STATUS_ONGOING_REVISION,
} from '@constants/order';
import { Popup } from '@components/Popup';
import FormDeliveredRevision from './FormDeliveredRevision.jsx';
import { CHANGE_ORDER_STATUS, MARK_AS_COMPLETE, UPDATE_ORDERS_PRIORITY } from '@graphql/mutations/order';
import { useMutation } from '@apollo/client';
import FormRequestComplete from './FormRequestComplete.jsx';

const generateLocalStorageKey = requestId => `request_message_${requestId}`;

const FormInputMessage = ({ onSubmit, editingValues, onChange, onCloseEdit }) => {
    const editorRef = useRef();
    const [form] = Form.useForm();
    const formContainerRef = useRef();
    const { request, refetchRequests, viewerRole, users } = useDetailContext();
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

    const addSnippetToContent = useCallback(
        snippet => {
            const newContent = `${toHtml(content)} ${snippet.text}`;

            setFieldsValue({
                content: toWysiwyg(newContent),
            });
        },
        [setFieldsValue, content]
    );

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
                let content = values?.content
                    ? getHtmlFormattedContent(values?.content)
                    : '<p style="padding: 0; margin: 0;"></p>';

                // Replace URL automatically
                const urlRegex = /(https?:\/\/[^\s<]+)/g;
                // Replace URLs with anchor tags
                content = content.replace(urlRegex, url => {
                    // Check if the link is not already used in a tag
                    if (!/<a[^>]*href=["'][^"']*["'][^>]*>/.test(content)) {
                        return `<a href="${url}" target="_blank">${url}</a>`;
                    }
                    return url;
                });

                content = content.replace(/(<p><br><\/p>)+$/, '').replace(/(<p><\/p>)+$/, '');

                content = parseLinks(content);
                await onSubmit(content, fileIds, activeMessageType, mentionedIds);
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

    const canReopenRequest = useMemo(
        () =>
            [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION].indexOf(request.status) > -1 &&
            viewerRole === USER_TYPE_CUSTOMER,
        [request.status, viewerRole]
    );

    const handleSubmit = () => {
        if (canReopenRequest) {
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

    const handleKeyCommand = useCallback(
        command => {
            if (command === 'send-message') {
                handleSubmit();
                return true;
            }
            return false;
        },
        [hasMessage, fileIds, isUploadingFiles]
    );

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

    const handleChangeMove = value => {
        message.destroy();
        message.loading('Changing request...', 50000);

        submitValues(async () => {
            await changeOrderStatus({
                variables: {
                    id: request.id,
                    status: ORDER_STATUS_ONGOING_REVISION,
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
                initialValues={{
                    content: initialValue,
                }}
                form={form}
                name="adminFormInputMessageForm"
            >
                <Form.Item name="content" style={{ marginBottom: 0 }}>
                    <Wysiwyg
                        ref={editorRef}
                        placeholder="Type your message here"
                        $isFlip
                        isCustomer={false}
                        $showTabSwitcher={true}
                        $contentMaxHeight="200px"
                        $toolbarHeight="40px"
                        $toolbarColor="gray"
                        canReopenRequest={canReopenRequest}
                        onBlur={handleBlurInput}
                        onChange={handleChange}
                        onFocusAfterChangeTab={handleFocusAfterChangeTab}
                        handleChangeMessageType={handleChangeMessageType}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={handleKeyBindingFn}
                        fileIds={fileIds}
                        handleReturn={handleReturn}
                        mentions={mentions}
                        addSnippetToContent={addSnippetToContent}
                        isAdminChat
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
