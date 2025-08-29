import React, { useState, useCallback, useMemo } from 'react';
import message from '@components/Message';
import { useMutation } from '@apollo/client';
import { Popup } from '@components/Popup';
import { MARK_AS_COMPLETE, RESUME_ORDER, PAUSE_ORDER, REOPEN_ORDER, CHANGE_ORDER_STATUS, UPDATE_ORDER_OWNERS } from '@graphql/mutations/order';
import {
    ORDER_STATUS_COMPLETED,
    ORDER_STATUS_DRAFT,
    ORDER_STATUS_ONGOING_PROJECT,
    ORDER_STATUS_ON_HOLD,
    ORDER_STATUS_QUEUED,
    ORDER_STATUS_SUBMITTED,
    ORDER_TAB_STATUSES,
} from '@constants/order';
import { toHtml } from '@components/Wysiwyg';
import FormReopenRequest from './FormReopenRequest.jsx';
import FormManageOwner from './FormManageOwner.jsx';
import FormRequestComplete from './FormRequestComplete.jsx';
import { useDetailContext } from './DetailContext.js';
import FormResumeRequest from './FormResumeRequest.jsx';
import { useHistory } from 'react-router';

export const useRequestActions = () => {
    const { request, refetchRequests } = useDetailContext();
    const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
    const [pauseOrder] = useMutation(PAUSE_ORDER);
    const [resumeOrder] = useMutation(RESUME_ORDER);
    const [reopenOrder] = useMutation(REOPEN_ORDER);
    const [changeOrder] = useMutation(CHANGE_ORDER_STATUS);
    const [updateOrderOwners] = useMutation(UPDATE_ORDER_OWNERS);

    const history = useHistory();

    const [isShowResume, setIsShowResume] = useState(false);
    const [isShowComplete, setIsShowComplete] = useState(false);
    const [isShowReopen, setIsShowReopen] = useState(false);
    const [isShowManageOwner, setIsShowManageOwner] = useState(false);
    const ownersInitialValues = useMemo(() => {
        return request.owners?.length ? request.owners.map(({ id }) => id) : [];
    }, [request]);
    const handleChangeStatus = useCallback(
        async (status, values) => {
            let variables = {
                id: request.id,
                status,
            };
            if (status === ORDER_STATUS_COMPLETED) {
                variables = {
                    ...variables,
                    ...values,
                };
                await markAsComplete({ variables });
                setIsShowComplete(false);
            } else if (status === ORDER_STATUS_ON_HOLD) {
                await pauseOrder({ variables });
            } else if (status === ORDER_STATUS_ONGOING_PROJECT && request.status === ORDER_STATUS_ON_HOLD) {
                variables = {
                    ...variables,
                    ...values,
                };

                await resumeOrder({ variables });
            } else if ((status === ORDER_STATUS_ONGOING_PROJECT || status === ORDER_STATUS_QUEUED) && request.status === ORDER_STATUS_COMPLETED) {
                variables = {
                    message: toHtml(values?.message),
                    move: values.move,
                    fileIds: values.fileIds,
                    ...variables,
                };

                await reopenOrder({ variables });
                setIsShowReopen(false);
            } else if (status === ORDER_STATUS_SUBMITTED) {
                await changeOrder({ variables });
            }
        },
        [pauseOrder, markAsComplete, resumeOrder, request, setIsShowComplete, setIsShowReopen, reopenOrder, changeOrder]
    );
    const handleClickPauseOrResume = async () => {
        if (request.status === ORDER_STATUS_ON_HOLD) {
            setIsShowResume(true);
        } else {
            message.destroy();
            message.loading('Pausing request...', 50000);
            await handleChangeStatus(ORDER_STATUS_ON_HOLD);
            message.destroy();
            message.success('This request has been paused');
        }
    };

    const handleClickSubmit = async () => {
        // Check if request required field is filled
        const hasDeliverables = request.deliverables && request.deliverables.length > 0;
        const hasOtherDeliverable = request.deliverables && request.deliverables.length > 0 && request.deliverables.includes('OTHERS');
        const deliverableCheck = hasOtherDeliverable ? hasDeliverables && request.otherDeliverables : hasDeliverables;
        if (request.name && request.category && request.category.id && request.service && request.service.id && request.description && deliverableCheck) {
            message.destroy();
            message.loading('Submitting request...', 50000);
            await handleChangeStatus(ORDER_STATUS_SUBMITTED);
            message.destroy();
            message.success('Your request status has been submitted');
        } else {
            history.push(`/requests/edit/${request.id}?submitdraft=true`);
        }
    };

    const handleClickComplete = () => {
        setIsShowComplete(true);
    };

    const handleRequestComplete = async values => {
        message.destroy();
        message.loading('Completing request...', 50000);
        await handleChangeStatus(ORDER_STATUS_COMPLETED, values);
        message.destroy();
        message.success('Request completed. Your feedback has been submitted');
    };

    const handleClickReopen = () => {
        setIsShowReopen(true);
    };

    const handleRequestReopen = async values => {
        message.destroy();
        message.loading('Reopening request...', 50000);
        await handleChangeStatus(ORDER_STATUS_QUEUED, values);
        message.destroy();
        message.success('Your request has been reopened');
    };

    const handleResumeMove = async move => {
        message.destroy();
        message.loading('Resuming request...', 50000);
        await handleChangeStatus(ORDER_STATUS_ONGOING_PROJECT, { move });
        setIsShowResume(false);
        message.destroy();
        message.success('Your request has been resumed');
    };

    const handleClickManageOwner = () => {
        setIsShowManageOwner(true);
    };

    const handleManageOwner = async values => {
        const ownersToDisconnectIds = ownersInitialValues.filter(id => !values.ownerIds.includes(id));

        try {
            message.destroy();
            message.loading('Updating owners...', 50000);
            await updateOrderOwners({
                variables: {
                    orderId: request.id,
                    ownerIds: values.ownerIds,
                    ownersToDisconnectIds,
                },
            });
            await refetchRequests();
            message.destroy();
            message.success('The owner of this request has been updated');
            setIsShowManageOwner(false);
        } catch (e) {
            message.destroy();
            message.error('Error on updating owners');
            setIsShowManageOwner(false);
        }
    };

    // TODO
    const handleResumeSubscription = () => {};
    const getPopupResume = () => (
        <Popup
            open={isShowResume}
            onCancel={() => setIsShowResume(false)}
            $variant="default"
            title="Resume request"
            width={500}
            destroyOnClose
            centered
            footer={null}
        >
            <FormResumeRequest onChange={handleResumeMove} />
        </Popup>
    );

    const getPopupComplete = () => (
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
    );

    const getPopupReopen = () => (
        <Popup
            open={isShowReopen}
            onCancel={() => setIsShowReopen(false)}
            $variant="default"
            width={500}
            title="Reopen request"
            destroyOnClose
            centered
            footer={null}
        >
            <FormReopenRequest onSuccessSubmit={handleRequestReopen} />
        </Popup>
    );

    const getPopupManageOwner = () => (
        <Popup
            open={isShowManageOwner}
            onCancel={() => setIsShowManageOwner(false)}
            $variant="default"
            width={500}
            title="Manage owner(s)"
            destroyOnClose
            centered
            footer={null}
        >
            <FormManageOwner onSuccessSubmit={handleManageOwner} initialValue={ownersInitialValues} options={request?.company?.users || []} />
        </Popup>
    );

    const showHandlerPauseOrResume = ORDER_TAB_STATUSES.QUEUE.includes(request.status);

    const showHandlerComplete = request.status !== ORDER_STATUS_COMPLETED && request.status !== ORDER_STATUS_DRAFT;

    const showHandlerReopen = request.status === ORDER_STATUS_COMPLETED;

    const showHandlerSubmit = request.status === ORDER_STATUS_DRAFT;

    return {
        getPopupComplete,
        getPopupResume,
        getPopupReopen,
        getPopupManageOwner,
        handleResumeSubscription,
        handleClickPauseOrResume,
        handleClickReopen,
        handleClickComplete,
        handleClickManageOwner,
        handleClickSubmit,
        showHandlerComplete,
        showHandlerPauseOrResume,
        showHandlerReopen,
        showHandlerSubmit,
    };
};
