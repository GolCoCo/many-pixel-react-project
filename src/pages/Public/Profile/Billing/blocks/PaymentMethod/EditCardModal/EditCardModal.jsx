import React, { memo } from 'react';
import { Popup } from '@components/Popup';
import EditCardForm from '../EditCardForm';

const EditCardModal = memo(({ visible, onClose, paymentMethod, refetchSubscriptionInvoice }) => {
    return (
        <Popup
            $variant="default"
            width={500}
            title="Edit card"
            open={visible}
            onOk={onClose}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
        >
            {paymentMethod && (
                <EditCardForm
                    onClose={onClose}
                    paymentMethod={paymentMethod}
                    refetchSubscriptionInvoice={refetchSubscriptionInvoice}
                />
            )}
        </Popup>
    );
});

export default EditCardModal;
