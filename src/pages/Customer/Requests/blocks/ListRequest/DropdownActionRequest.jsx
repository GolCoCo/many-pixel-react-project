import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Dropdown } from 'antd';
import { useHistory } from 'react-router';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Box } from '@components/Box';
import { Popup, PopupDelete } from '@components/Popup';
import { Text } from '@components/Text';
import { Link } from '@components/Link';
import message from '@components/Message';
import IconDownload from '@components/Svg/IconDownload';
import IconDelete from '@components/Svg/IconDelete';
import IconPause from '@components/Svg/IconPause';
import IconDuplicate from '@components/Svg/IconDuplicate';
import IconMarkComplete from '@components/Svg/IconMarkComplete';
import IconOptions from '@components/Svg/IconOptions';
import IconPlay from '@components/Svg/IconPlay';
import IconSubmit from '@components/Svg/IconSubmit';
import { MARK_AS_COMPLETE, PAUSE_ORDER, CHANGE_ORDER_STATUS, RESUME_ORDER, DELETE_ORDER } from '@graphql/mutations/order';
import { ORDER_STATUS_COMPLETED, ORDER_STATUS_ON_HOLD, ORDER_STATUS_ONGOING_PROJECT, ORDER_STATUS_DRAFT, ORDER_STATUS_SUBMITTED } from '@constants/order';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import { DUPLICATE_REQUEST } from '@constants/routes';
import FormRequestComplete from '../DetailRequest/FormRequestComplete.jsx';
import { DropdownRowRequestItem } from '../../style.js';
import FormResumeRequest from '../DetailRequest/FormResumeRequest.jsx';

export const DropdownActionRequest = ({
    id,
    onVisibleChange,
    enableComplete,
    enableDownload,
    enableDuplicate,
    enableResume,
    enablePause,
    enableDelete,
    refetch,
    enableSubmit,
    status,
    lastFolder,
    requestName,
    name,
    description,
    service,
    category,
    deliverables,
    otherDeliverables,
}) => {
    const [isShowComplete, setIsShowComplete] = useState(false);
    const [isShowDelete, setShowDelete] = useState(false);
    const [isShowResume, setIsShowResume] = useState(false);
    const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
    const [pauseOrder] = useMutation(PAUSE_ORDER);
    const [resumeOrder] = useMutation(RESUME_ORDER);
    const [deleteOrder] = useMutation(DELETE_ORDER);
    const [changeOrder] = useMutation(CHANGE_ORDER_STATUS);
    const history = useHistory();

    const handleChangeStatus = useCallback(
        async (status, values) => {
            let variables = {
                id,
                status,
            };
            if (status === ORDER_STATUS_COMPLETED) {
                variables = {
                    ...variables,
                    ...values,
                };
                await markAsComplete({ variables });
            } else if (status === ORDER_STATUS_ON_HOLD) {
                await pauseOrder({ variables });
            } else if (status === ORDER_STATUS_ONGOING_PROJECT) {
                variables = {
                    ...variables,
                    ...values,
                };
                await resumeOrder({ variables });
            } else if (status === ORDER_STATUS_SUBMITTED) {
                await changeOrder({ variables });
            }
            if (refetch) {
                await refetch();
            }
        },
        [resumeOrder, pauseOrder, changeOrder, markAsComplete, refetch, id]
    );

    const handleMarkComplete = async values => {
        message.destroy();
        message.loading('Updating status...', 50000);
        await handleChangeStatus(ORDER_STATUS_COMPLETED, values);
        message.destroy();
        message.success('Request completed. Your feedback has been submitted');
        setIsShowComplete(false);
    };

    const handleZippingFiles = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            message.destroy();
        }
    };

    const handleDownloadFolder = () => {
        if (lastFolder?.files?.length) {
            message.destroy();
            message.loading(`Downloading last folder`, 50000);
            const folderName = `${requestName}-${lastFolder.name}`;
            downloadFilesAsZip(lastFolder.files, folderName, handleZippingFiles);
        } else {
            message.destroy();
            message.error('Folder is empty');
        }
    };

    const handleShowDelete = () => {
        setShowDelete(true);
    };

    const handleSubmitDelete = async () => {
        message.destroy();
        message.loading('Deleting request...');
        await deleteOrder({
            variables: {
                id,
            },
        });
        message.destroy();
        message.success('Request has been deleted');
        await refetch();
    };

    const handleCancelDelete = () => {
        setShowDelete(false);
    };

    const handlePause = async () => {
        message.destroy();
        message.loading('Updating status');
        await handleChangeStatus(ORDER_STATUS_ON_HOLD);
        message.destroy();
        message.success('Request has been paused');
    };

    const handleShowResume = () => {
        setIsShowResume(true);
    };

    const handleResume = async move => {
        message.destroy();
        message.loading('Updating status');
        await handleChangeStatus(ORDER_STATUS_ONGOING_PROJECT, { move });
        message.destroy();
        message.success('Request has been resumed');
    };

    const handleSubmit = async () => {
        if (status === ORDER_STATUS_DRAFT) {
            const hasDeliverables = deliverables && deliverables.length > 0;
            const hasOtherDeliverable = deliverables && deliverables.length > 0 && deliverables.includes('OTHERS');
            const deliverableCheck = hasOtherDeliverable ? hasDeliverables && otherDeliverables : hasDeliverables;

            if (name && category && category.id && service && service.id && description && deliverableCheck) {
                message.destroy();
                message.loading('Submitting request...', 50000);
                await handleChangeStatus(ORDER_STATUS_SUBMITTED);
                message.destroy();
                message.success('Your request status has been submitted');
            } else {
                history.push(`/requests/edit/${id}?submitdraft=true`);
            }
        }
    };

    return (
        <>
            <Dropdown
                trigger={['click']}
                onOpenchange={onVisibleChange}
                overlay={
                    <DropdownMenu $mt="0">
                        {enableSubmit && (
                            <DropdownMenuItem key="submit" onClick={handleSubmit}>
                                <DropdownMenuItemContent icon={<IconSubmit />}>Submit request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {enableComplete && (
                            <DropdownMenuItem key="complete" onClick={() => setIsShowComplete(true)}>
                                <DropdownMenuItemContent icon={<IconMarkComplete />}>Mark as complete</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {enableDownload && (
                            <DropdownMenuItem key="download" onClick={handleDownloadFolder}>
                                <DropdownMenuItemContent icon={<IconDownload />}>Download last folder</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {enableDuplicate && (
                            <DropdownMenuItem key="duplicate" $p="0">
                                <Box as={Link} to={DUPLICATE_REQUEST.replace(':id', id)}>
                                    <DropdownMenuItemContent icon={<IconDuplicate />}>Duplicate request</DropdownMenuItemContent>
                                </Box>
                            </DropdownMenuItem>
                        )}
                        {enableResume && (
                            <DropdownMenuItem key="resume" onClick={handleShowResume}>
                                <DropdownMenuItemContent icon={<IconPlay />}>Resume request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {enablePause && (
                            <DropdownMenuItem key="pause" onClick={handlePause}>
                                <DropdownMenuItemContent icon={<IconPause />}>Pause request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {enableDelete && (
                            <DropdownMenuItem key="delete" onClick={handleShowDelete}>
                                <DropdownMenuItemContent icon={<IconDelete />}>Delete request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenu>
                }
            >
                <DropdownRowRequestItem>
                    <IconOptions />
                </DropdownRowRequestItem>
            </Dropdown>
            <PopupDelete
                title="Are you sure you want to delete this request?"
                $variant="delete"
                open={isShowDelete}
                onOk={handleSubmitDelete}
                onCancel={handleCancelDelete}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
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
                <FormRequestComplete onSuccessSubmit={handleMarkComplete} />
            </Popup>
            <Popup
                open={isShowResume}
                onCancel={() => setIsShowResume(false)}
                $variant="default"
                width={500}
                destroyOnClose
                title="Resume request"
                centered
                closable={false}
                footer={null}
            >
                <FormResumeRequest onChange={handleResume} />
            </Popup>
        </>
    );
};
