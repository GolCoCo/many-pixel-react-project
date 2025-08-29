import React, { forwardRef } from 'react';
import { Box } from '@components/Box';
import { Badge } from '@components/Badge';
import { ORDER_STATUS_LABELS } from '@constants/order';

const ALL_STATUS = ['DRAFT', 'QUEUED', 'AWAITING_FEEDBACK', 'SUBMITTED', 'ONGOING_PROJECT', 'ON_HOLD', 'DELIVERED_PROJECT', 'COMPLETED'];

const DESIGNER_STATUS = {
    QUEUED: ['ONGOING_PROJECT', 'AWAITING_FEEDBACK', 'DELIVERED_PROJECT'],
    ONGOING_PROJECT: ['DELIVERED_PROJECT', 'AWAITING_FEEDBACK', 'QUEUED'],
    AWAITING_FEEDBACK: ['ONGOING_PROJECT', 'DELIVERED_PROJECT', 'QUEUED'],
    DELIVERED_PROJECT: ['ONGOING_PROJECT', 'AWAITING_FEEDBACK', 'QUEUED'],
};

const StatusSelectToRef = ({ isOpenStatusSelect, requestStatus, handleChangeOrderStatus, isWorker }, ref) => {
    const statuses = isWorker ? DESIGNER_STATUS[requestStatus] || [] : ALL_STATUS;

    if (!isOpenStatusSelect) {
        return <></>;
    }

    return (
        <Box
            ref={ref}
            $bg="white"
            $w="190"
            $h="auto"
            $maxH="276"
            $overflowY="auto"
            $overflowX="hidden"
            $boxShadow={
                isOpenStatusSelect ? '0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)' : 'none'
            }
            $radii="2"
            $left="3"
            $pos="absolute"
            $py={isOpenStatusSelect ? '4' : '0'}
            $mt={isOpenStatusSelect ? '6' : '0'}
            $trans="all 0.1s ease-in-out"
            $zIndex="1"
        >
            {statuses.map(status => (
                <Box
                    key={status}
                    $px="12"
                    $pt="10"
                    $pb="10"
                    $textAlign="center"
                    $cursor="pointer"
                    _hover={{ $bg: 'outline-gray' }}
                    onClick={() => handleChangeOrderStatus(status)}
                >
                    <Badge $variant={ORDER_STATUS_LABELS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
                </Box>
            ))}
        </Box>
    );
};

export const StatusSelect = forwardRef(StatusSelectToRef);
