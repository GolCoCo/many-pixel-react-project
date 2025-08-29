import { useMutation } from '@apollo/client';
import React, { useEffect, useState, memo } from 'react';
import * as OrderStatus from '@constants/order';
import { Box } from '@components/Box/Box';
import { UPDATE_ORDERS_PRIORITY } from '@graphql/mutations/order';
import { DragDropContext } from 'react-beautiful-dnd';
import { DroppableRequest } from './DroppableRequest';
import { RowItemRequest } from './RowItemRequest';
import { DropdownActionRequest } from './DropdownActionRequest';
import { AdminRowItemRequest } from './AdminItemRequest';

const draggableStatus = [
    OrderStatus.ORDER_STATUS_ONGOING_PROJECT,
    OrderStatus.ORDER_STATUS_ONGOING_REVISION,
    OrderStatus.ORDER_STATUS_SUBMITTED,
    OrderStatus.ORDER_STATUS_AWAITING_FEEDBACK,
    OrderStatus.ORDER_STATUS_QUEUED,
];

const RenderRequest = ({
    tab,
    data,
    $isNotCustomer,
    refetch,
    enableDrag,
    enableDrop,
    lastRequest,
    isAdmin,
    ...props
}) => {
    return (
        <Box>
            {Array.isArray(data) && (
                <DroppableRequest name="active">
                    {data.map((item, index) =>
                        isAdmin ? (
                            <AdminRowItemRequest
                                feedback={item?.feedback}
                                priority={index + 1}
                                key={item.id}
                                company={item.company}
                                owners={item.owners}
                                id={item.id}
                                index={index}
                                isLastRequest={item.id === lastRequest.id}
                                enableDrag={tab === 'QUEUE' && draggableStatus.includes(item.status)}
                                enableDrop={enableDrop}
                                name={item.name}
                                rate={item.rate}
                                category={item.category}
                                workers={item.workers}
                                date={item.status === 'SUBMITTED' ? item.submittedAt : item.updatedAt}
                                dateLabel={item.status === 'SUBMITTED' ? 'Submitted' : 'Last Updated'}
                                status={item.status}
                                brand={item.brand}
                                unreadMessages={item.unreadMessages}
                                refetchOrders={refetch}
                                iconProps={{
                                    $borderColor: 'cta',
                                }}
                                optionComponent={DropdownActionRequest}
                                optionProps={{
                                    id: item.id,
                                    enableComplete:
                                        draggableStatus.includes(item.status) ||
                                        item.status === OrderStatus.ORDER_STATUS_DELIVERED_REVISION ||
                                        item.status === OrderStatus.ORDER_STATUS_DELIVERED_PROJECT,
                                    enableDuplicate: true,
                                    enableDownload: tab !== 'DRAFT',
                                    enableDelete: true,
                                    enablePause: draggableStatus.includes(item.status),
                                    enableResume:
                                        item.status === OrderStatus.ORDER_STATUS_NOT_STARTED ||
                                        item.status === OrderStatus.ORDER_STATUS_ON_HOLD,
                                    enableSubmit: item.status === OrderStatus.ORDER_STATUS_DRAFT,
                                    refetch,
                                    status: item.status,
                                    lastFolder: item?.previews?.length
                                        ? item.previews[item?.previews?.length - 1]
                                        : null,
                                    requestName: item.name,
                                }}
                                $isNotCustomer={$isNotCustomer}
                                isAdmin={isAdmin}
                            />
                        ) : (
                            <RowItemRequest
                                key={item.id}
                                feedback={item?.feedback}
                                priority={index + 1}
                                company={item.company}
                                owners={item.owners}
                                id={item.id}
                                index={index}
                                isLastRequest={item.id === lastRequest.id}
                                enableDrag={tab === 'QUEUE' && draggableStatus.includes(item.status)}
                                enableDrop={enableDrop}
                                name={item.name}
                                rate={item.rate}
                                category={item.category}
                                workers={item.workers}
                                date={item.status === 'SUBMITTED' ? item.submittedAt : item.updatedAt}
                                dateLabel={item.status === 'SUBMITTED' ? 'Submitted' : 'Last Updated'}
                                status={item.status}
                                brand={item.brand}
                                unreadMessages={item.unreadMessages}
                                refetchOrders={refetch}
                                iconProps={{
                                    $borderColor: 'cta',
                                }}
                                optionComponent={DropdownActionRequest}
                                optionProps={{
                                    id: item.id,
                                    enableComplete:
                                        draggableStatus.includes(item.status) ||
                                        item.status === OrderStatus.ORDER_STATUS_DELIVERED_REVISION ||
                                        item.status === OrderStatus.ORDER_STATUS_DELIVERED_PROJECT,
                                    enableDuplicate: true,
                                    enableDownload: tab !== 'DRAFT',
                                    enableDelete: true,
                                    enablePause: draggableStatus.includes(item.status),
                                    enableResume:
                                        item.status === OrderStatus.ORDER_STATUS_NOT_STARTED ||
                                        item.status === OrderStatus.ORDER_STATUS_ON_HOLD,
                                    enableSubmit: item.status === OrderStatus.ORDER_STATUS_DRAFT,
                                    refetch,
                                    status: item.status,
                                    lastFolder: item?.previews?.length
                                        ? item.previews[item?.previews?.length - 1]
                                        : null,
                                    requestName: item.name,
                                }}
                                $isNotCustomer={$isNotCustomer}
                                isAdmin={isAdmin}
                            />
                        )
                    )}
                </DroppableRequest>
            )}
        </Box>
    );
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const SectionRequestRenderer = memo(({ tab, ...props }) => {
    const [updateOrdersPriority] = useMutation(UPDATE_ORDERS_PRIORITY);
    const [data, setData] = useState(() => props.data);
    useEffect(() => {
        setData(props.data);
    }, [props.data, tab]);

    const handleDragEnd = async result => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;
        const newOrders = reorder(data, result.source.index, result.destination.index);
        setData(newOrders);
        await updateOrdersPriority({
            variables: {
                orders: newOrders
                    .filter(order => order.status !== OrderStatus.ORDER_STATUS_ON_HOLD)
                    .map((order, index) => ({ id: order.id, priority: 0 + index + 1 })),
            },
        });
        if (props.refetchOrder) {
            await props.refetchOrder();
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <RenderRequest {...props} data={data} tab={tab} />
        </DragDropContext>
    );
});
