import React, { useState, useEffect, useMemo } from 'react';
import { Popup } from '@components/Popup';
import { useQuery } from '@apollo/client';
import { ALL_ORDERS } from '@graphql/queries/order';
import { ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION } from '@constants/order';
import withLoggedUser from '@components/WithLoggedUser';
import moment from 'moment';
import { ItemFeedbackRequest } from './ItemFeedbackRequest';

const FEEDBACK_PREFIX = 'popup_feedback';

export const PopupFeedbackRequests = withLoggedUser(({ viewer, refetch }) => {
    const [isShow, setIsShow] = useState(false);

    const { data } = useQuery(ALL_ORDERS, {
        variables: {
            where: {
                companyId: viewer?.company?.id,
                status: {
                    in: [ORDER_STATUS_DELIVERED_PROJECT, ORDER_STATUS_DELIVERED_REVISION],
                },
                isArchived: false,
            },
            orderBy: { priority: 'Asc' },
        },
        fetchPolicy: 'network-only',
    });

    const storageKey = useMemo(() => {
        return viewer ? `${FEEDBACK_PREFIX}_${viewer.company.id}` : null;
    }, [viewer]);

    useEffect(() => {
        const currentDate = moment().startOf('day');

        const insertAndShow = () => {
            window.localStorage.setItem(storageKey, currentDate.format('YYYY-MM-DD'));
            setIsShow(true);
        };

        const count = data?._allOrdersMeta?.count ?? 0;
        if (storageKey !== null && count > 0) {
            const threeDaysPast = moment().startOf('day').subtract(3, 'days');
            const savedDate = window.localStorage.getItem(storageKey);
            if (savedDate) {
                const lastSavedDate = moment(savedDate);
                if (!lastSavedDate.isBetween(threeDaysPast, currentDate, 'date', '[]')) {
                    insertAndShow();
                }
            } else {
                insertAndShow();
            }
        }
    }, [data, storageKey]);

    return (
        <Popup width={500} open={isShow} onCancel={() => setIsShow(false)} title="How did the request(s) go?" footer={null}>
            {Array.isArray(data?.allOrders) &&
                data.allOrders.map((order, index) => (
                    <ItemFeedbackRequest
                        key={order.id}
                        id={order.id}
                        name={order.name}
                        category={order.category.title}
                        $mb={index === data.allOrders.length - 1 ? '0' : '16'}
                        refetch={refetch}
                    />
                ))}
        </Popup>
    );
});
