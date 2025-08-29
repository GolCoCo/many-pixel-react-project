import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';
import Avatar from '@components/Avatar';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { toHtml, WysiwygRenderer } from '@components/Wysiwyg';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import { Popup, PopupDelete } from '@components/Popup';
import ArrowRightIcon from '@components/Svg/ArrowRight';
import message from '@components/Message';
import { withResponsive } from '@components/ResponsiveProvider';
import { Button } from '@components/Button';
import withLoggedUser from '@components/WithLoggedUser';
import { FEEDBACK_REQUEST } from '@constants/routes';
import { useDetailContext } from './DetailContext.js';
import FormMessageEdit from './FormMessageEdit.jsx';
import { CardAttachment } from './CardAttachment.jsx';
import { useMessageEditingContext } from './MessageEditingContext.js';
import { DetailActionButton } from '../../style.js';

export const MessageTypeDefault = withLoggedUser(
    withResponsive(({ usersOnline, viewer, id, user, text, createdAt, files, windowWidth, deleteMessage, updateMessage }) => {
        const [isShowControl, setShowControl] = useState(false);
        const [isShowDelete, setShowDelete] = useState(false);
        const [isShowEdit, setShowEdit] = useState(false);
        const [isMobileControl, setMobileControl] = useState(false);
        const [fileIds, setFileIds] = useState(null);
        const boxEditingRef = useRef(null);
        const { editingValues, setEditingValues } = useMessageEditingContext();
        const { request, refetchRequests, users } = useDetailContext();
        const history = useHistory();
        const timeout = useRef(null);
        const isMessageOwner = viewer?.id === user?.id;
        const room = `discussion/${request.discussionId}`;
        const isOnline = usersOnline?.some(userId => user?.id === userId);
        useEffect(() => {
            if (isShowEdit) {
                boxEditingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        }, [isShowEdit]);

        useEffect(() => {
            if (files?.length) {
                const filesAttached = files.map(file => file.id);
                setFileIds(filesAttached);
            }
        }, [files]);

        const onMouseEnter = () => {
            if (windowWidth >= 768) {
                setShowControl(true);
            }
        };

        const onMouseLeave = () => {
            if (windowWidth >= 768) {
                setShowControl(false);
            }
        };

        const onHold = () => {
            if (windowWidth < 768) {
                if (timeout.current !== null) {
                    window.clearInterval(timeout.current);
                }
                timeout.current = window.setTimeout(() => {
                    setMobileControl(true);
                }, 1000);
            }
        };

        const onHoldEnd = () => {
            if (timeout.current) {
                window.clearInterval(timeout.current);
            }
        };

        const handleCloseControlMobile = () => {
            setMobileControl(false);
        };

        const handleShowEdit = () => {
            if (windowWidth >= 768 && isMessageOwner) {
                setShowEdit(true);
            }
        };

        const handleHideEdit = () => {
            if (windowWidth >= 768) {
                setShowEdit(false);
            }
        };
        const handleEditMobile = () => {
            setMobileControl(false);
            setEditingValues({
                id,

                content: text,
            });
        };

        const handleEdit = useCallback(
            async ({ text, fileIds: editedFileIds, mentionedIds }) => {
                updateMessage({
                    messageId: id,
                    text: toHtml(text),
                    fileIds: editedFileIds,
                    discussionId: request.discussionId,
                    mentionedIds,
                });
                await refetchRequests();
                setShowEdit(false);
            },
            [updateMessage, id, room, refetchRequests, request.id]
        );

        const handleDeleteMobile = () => {
            setMobileControl(false);
            handleShowDelete();
        };

        const handleShowDelete = () => {
            setShowDelete(true);
        };

        const handleHideDelete = () => {
            setShowDelete(false);
        };

        const handleDelete = useCallback(() => {
            deleteMessage({
                messageId: id,
                fileIds,
                discussionId: request.discussionId,
            });
            message.success('Message deleted');
            setShowDelete(false);
        }, [deleteMessage, id, setShowDelete, fileIds, request, room]);

        const handleClickFile = file => {
            history.push(`${FEEDBACK_REQUEST.replace(':id', request.id)}?file=${file.id}`, { from: 'files' });
        };

        const handleImageUrl = () => {
            if (user?.picture?.url?.includes('https://assets.manypixels.co') || user?.picture?.url?.includes('https://assets-staging.manypixels.co')) {
                return user?.picture?.url;
            }
            try {
                const filename = new URL(user?.picture?.url).pathname.split('/').pop();
                return `https://assets.manypixels.co/${filename}`;
            } catch {
                return '';
            }
        };

        return (
            <>
                <Box
                    ref={boxEditingRef}
                    $d="flex"
                    $pos="relative"
                    $px={['16', '20']}
                    $py="8"
                    $w="100%"
                    $trans="0.2s all"
                    data-active={isShowEdit || editingValues.id === id ? 'true' : undefined}
                    $bg="white"
                    _hover={{
                        $bg: 'bg-gray',
                    }}
                    _active={{
                        $bg: 'bg-light-blue',
                    }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseDown={onHold}
                    onMouseUp={onHoldEnd}
                    onTouchStart={onHold}
                    onTouchEnd={onHoldEnd}
                    onTouchCancel={onHoldEnd}
                    $wordBreak="break-word"
                >
                    {isShowControl && !isShowEdit && isMessageOwner && (
                        <Box $pos="absolute" $zIndex="2" $top="0" $right="0" $transform="translateY(-12px) translateX(-19px)">
                            <Box $d="flex">
                                <DetailActionButton
                                    type="primary"
                                    size="small"
                                    iscapitalized="true"
                                    icon={<IconEdit $fontSize="20" />}
                                    onClick={handleShowEdit}
                                    $radii="10px 0 0 10px"
                                >
                                    Edit
                                </DetailActionButton>
                                <DetailActionButton
                                    type="danger"
                                    size="small"
                                    iscapitalized="true"
                                    icon={<IconDelete />}
                                    onClick={handleShowDelete}
                                    $radii="0 10px 10px 0"
                                >
                                    Delete
                                </DetailActionButton>
                            </Box>
                        </Box>
                    )}
                    <Box>
                        <Avatar
                            relativeW="34"
                            src={handleImageUrl()}
                            size={34}
                            $fontSize={12}
                            name={user?.firstname}
                            isActive={isOnline}
                            showActive={isOnline}
                            $textVariant="SmallTitle"
                        />
                    </Box>
                    <Box $pl="16" $flex={1} $maxW="100%">
                        <Box $d="flex" $alignItems="center" $flexWrap="wrap">
                            <Text $textVariant="H6" $colorScheme="primary">
                                {user?.firstname}
                            </Text>
                            <Text $textVariant="P4" $ml="8" $colorScheme="secondary">
                                {moment(createdAt).format('DD MMM YY, HH:mm')}
                            </Text>
                        </Box>
                        <Box $mt="6">
                            {isShowEdit ? (
                                <FormMessageEdit initialValues={{ text }} onSubmit={handleEdit} onCancel={handleHideEdit} onDelete={handleDelete} users={users} />
                            ) : (
                                <WysiwygRenderer content={text} />
                            )}
                        </Box>
                        {files?.length > 0 && (
                            <Box $mx="-7px" $d="flex" $flexWrap="wrap" $flexDir="row" $maxW="95%">
                                {files?.map(attachment => (
                                    <Box key={attachment.id} $px="7px" $maxW={['100%', '33%']} $w="100%" $pt="10">
                                        <CardAttachment
                                            {...attachment}
                                            downloadIcon={<ArrowRightIcon />}
                                            onClick={() => handleClickFile(attachment)}
                                            pl="14"
                                            pr="14"
                                            py="14"
                                            h="60"
                                            bg={isShowControl ? 'white' : 'bg-gray'}
                                            _hover={{
                                                $bg: 'white',
                                            }}
                                            requestId={request.id}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
                <Popup
                    wrapClassName="variant-bottom"
                    open={isMobileControl}
                    title="Select an option"
                    onCancel={handleCloseControlMobile}
                    width="100%"
                    $variant="bottom"
                    footer={null}
                    closable
                    maskClosable
                >
                    <Box>
                        <Button
                            type="ghost"
                            icon={
                                <Box $lineH="1" $fontSize="20">
                                    <IconEdit />
                                </Box>
                            }
                            $justifyContent="flex-start"
                            $px="0"
                            block
                            $mb="8"
                            onClick={handleEditMobile}
                        >
                            Edit
                        </Button>
                        <Button
                            type="ghost"
                            icon={
                                <Box $lineH="1" $fontSize="20">
                                    <IconDelete />
                                </Box>
                            }
                            $justifyContent="flex-start"
                            $px="0"
                            block
                            onClick={handleDeleteMobile}
                        >
                            Delete
                        </Button>
                    </Box>
                </Popup>
                <PopupDelete open={isShowDelete} onOk={handleDelete} onCancel={handleHideDelete} title="Are you sure you want to delete this message?">
                    <Text>This action cannot be undone</Text>
                </PopupDelete>
            </>
        );
    })
);
