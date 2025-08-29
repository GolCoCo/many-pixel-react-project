import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { TextArea } from '@components/Input';
import { Form } from '@components/Form';
import Avatar from '@components/Avatar';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import { Dropdown, Tooltip } from 'antd';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import IconOptionsSmall from '@components/Svg/IconOptionsSmall';
import { useOutsideClick } from '@hooks/useOutsideClick';
import WithLoggedUser from '@components/WithLoggedUser';
import { timeSince } from '@constants/time';
import { withResponsive } from '@components/ResponsiveProvider';
import IconCopy from '@components/Svg/IconCopy';
import { hasLink, parseLinks } from '@components/Wysiwyg';

const displayComment = comment => {
    if (hasLink(comment)) {
        return (
            <Box
                dangerouslySetInnerHTML={{
                    __html: parseLinks(comment),
                }}
            />
        );
    }

    return comment;
};

const CommentBox = WithLoggedUser(({ author, createdAt, content, viewer, onClickEdit, onClickDelete }) => {
    const authorName = `${author?.firstname ?? ''} ${author.lastname ?? ''}`;
    const handleFolderLinkCopy = async () => {
        await navigator.clipboard.writeText(content);
    };

    return (
        <Box $borderB="1" $borderBottomStyle="solid" $borderBottomColor="outline-gray" $cursor="auto">
            <Box $d="flex" $flexDir="row" $alignItems="center" $pt="16" $px="16" $mb="10">
                <Box>
                    <Avatar src={author?.picture?.url} name={authorName} size={32} $fontSize={12} />
                </Box>
                <Box $px="16">
                    <Text $textVariant="H6">{authorName}</Text>
                </Box>
                <Box $ml="auto">
                    <Box $d="flex" $flexDir="row" $alignItems="center">
                        <Text $textVariant="P4" $colorScheme="secondary" $mr="10">
                            {timeSince(createdAt)}
                        </Text>
                        {viewer.id === author.id && (
                            <Dropdown
                                trigger={['click']}
                                overlay={
                                    <DropdownMenu $w="229" $mt="-8">
                                        <DropdownMenuItem key="edit" onClick={onClickEdit} className="comment-action">
                                            <DropdownMenuItemContent icon={<IconEdit />}>Edit</DropdownMenuItemContent>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem key="delete" onClick={onClickDelete} className="comment-action">
                                            <DropdownMenuItemContent icon={<IconDelete />}>Delete Comment</DropdownMenuItemContent>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="comment-action" key="copy" onClick={handleFolderLinkCopy}>
                                            <DropdownMenuItemContent icon={<IconCopy />}>Copy</DropdownMenuItemContent>
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                }
                            >
                                <Tooltip color="white" title="Comment actions" trigger="hover">
                                    <Button hasDropDown type="default" icon={<IconOptionsSmall />} $w="34" $h="34" mobileH="32" $borderW="0" />
                                </Tooltip>
                            </Dropdown>
                        )}
                    </Box>
                </Box>
            </Box>
            <Box $pr="16" $pl="64" $mb="16" $cursor="text" $userSelect="text">
                <Text $textVariant="P4" $wordBreak="break-all" $cursor="text">
                    {displayComment(content)}
                </Text>
            </Box>
        </Box>
    );
});

const ListReply = withResponsive(({ windowHeight, children }) => {
    return (
        <Box $overflowY="auto" style={{ maxHeight: windowHeight - 400 }}>
            {children}
        </Box>
    );
});

const FeedbackCreateForm = ({ clearMarker, handleEvent, onClose, onSubmit, onDelete, activeComment, isTypeMessageHidden }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setSubmitting] = useState(false);
    const [isShow, setShow] = useState(() => !activeComment);
    const [allowSubmit, setAllowSubmit] = useState(true);
    const [editing, setEditing] = useState({
        type: null,
        id: null,
    });
    const inputRef = useRef(null);
    const content = Form.useWatch('content', form);
    const handleClose = useCallback(() => {
        setEditing({ type: null, id: null });
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const ref = useOutsideClick(ev => {
        const feedbackBox = document.getElementsByClassName('feedback-box');
        const commentAction = document.getElementsByClassName('comment-action');
        let triggered = true;
        if (ev.target.classList.contains('marker')) {
            triggered = false;
        }
        [feedbackBox, commentAction].forEach(box => {
            for (let i = 0; i < box.length; i++) {
                const el = box[i];
                if (el.contains(ev.target)) {
                    triggered = false;
                }
            }
        });

        if (triggered) {
            handleClose();
        }
    });

    useEffect(() => {
        if (inputRef.current) {
            if (activeComment) {
                inputRef.current.blur();
            } else {
                inputRef.current.focus();
            }
        }
    }, [activeComment]);

    useEffect(() => {
        if (activeComment === null) {
            setShow(true);
        } else {
            setShow(!!content);
        }
    }, [activeComment, content]);

    useEffect(() => {
        form.validateFields(values => {
            if (!err) {
                if (values.content) {
                    setAllowSubmit(true);
                } else {
                    setAllowSubmit(false);
                    setEditing({ type: null, id: null });
                }
            }
        });
    }, [form]);

    const handleFocusComment = () => {
        if (activeComment) {
            setShow(true);
        }
        window.removeEventListener('keypress', handleEvent);
    };
    const handleBlurComment = useCallback(() => {
        if (activeComment) {
            setShow(!!content);
        }
        window.addEventListener('keypress', handleEvent);
    }, [content]);

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            if (!isSubmitting) {
                setSubmitting(true);
                const newValues = editing.id !== null ? { ...values, id: editing.id } : values;
                await onSubmit(newValues, editing.type);
            }
            if (activeComment) {
                form.setFieldsValue({ content: '' });
            }
            setSubmitting(false);
        });
    };

    const handleClickEdit = ({ content, ...value }) => {
        setEditing(value);
        form.setFieldsValue({ content });
    };

    const handleCancel = () => {
        setEditing({ type: null, id: null });
        if (!activeComment) {
            if (onClose) {
                onClose();
            }
        } else {
            form.setFieldsValue({ content: '' });
        }
    };

    const handleClickDelete = async values => {
        try {
            onDelete(values);
        } catch (err) {
            console.log(err);
        }
    };

    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            clearMarker();
        }
    };

    return (
        <Box $radii="10" ref={ref} $bg="white" $w="412" $boxShadow=" 0px 2px 8px rgba(0, 0, 0, 0.16)" onKeyDown={handleKeyDown}>
            <Form onFinish={handleSubmit} name="feedbackCreateFormC" form={form}>
                {activeComment && (
                    <ListReply>
                        <CommentBox
                            content={activeComment?.content}
                            author={activeComment?.user}
                            createdAt={activeComment?.createdAt}
                            onClickEdit={() =>
                                handleClickEdit({
                                    type: 'feedback',
                                    id: activeComment.id,
                                    content: activeComment?.content,
                                })
                            }
                            onClickDelete={() =>
                                handleClickDelete({
                                    type: 'feedback',
                                    id: activeComment.id,
                                })
                            }
                        />
                        {Array.isArray(activeComment?.comments) &&
                            activeComment?.comments.map(comment => (
                                <CommentBox
                                    key={comment.id}
                                    content={comment.content}
                                    author={comment?.user}
                                    createdAt={comment?.createdAt}
                                    onClickEdit={() =>
                                        handleClickEdit({
                                            type: 'comment',
                                            id: comment.id,
                                            content: comment.content,
                                        })
                                    }
                                    onClickDelete={() =>
                                        handleClickDelete({
                                            type: 'comment',
                                            id: comment.id,
                                        })
                                    }
                                />
                            ))}
                    </ListReply>
                )}
                {!isTypeMessageHidden && (
                    <Form.Item name="content" style={{ marginBottom: 0 }}>
                        <TextArea
                            ref={inputRef}
                            placeholder={activeComment ? 'Reply' : 'Add a comment'}
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            $borderW="0"
                            $px="20"
                            $py="16"
                            $resize="none"
                            onFocus={handleFocusComment}
                            onBlur={handleBlurComment}
                            style={{ $borderColor: 'transparent' }}
                            _focus={{ $boxShadow: 'none', $borderW: '0' }}
                        />
                    </Form.Item>
                )}
                {isTypeMessageHidden && (
                    <Box $p="20" $mb="16" $cursor="text" $userSelect="text" $textAlign="center">
                        <Text $textVariant="P4" $wordBreak="break-all" $cursor="text">
                            Request is Paused/Completed
                        </Text>
                    </Box>
                )}
                {isShow && !isTypeMessageHidden && (
                    <Box $d="flex" $flexDir="row" $justifyContent="flex-end" $pb="16" $px="20">
                        <Button type="default" $mr="10" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" disabled={!allowSubmit} loading={isSubmitting}>
                            {editing.id !== null ? 'Save' : activeComment ? 'Reply' : 'Post'}
                        </Button>
                    </Box>
                )}
            </Form>
        </Box>
    );
};

export default FeedbackCreateForm;
