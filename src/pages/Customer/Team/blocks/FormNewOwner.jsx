import React, { useCallback, useMemo, forwardRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_ORDERS_OWNERS } from '@graphql/mutations/order';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import { Box } from '@components/Box';
import message from '@components/Message';
import FieldOwnerSelector from './FieldOwnerSelector.jsx';

const FormNewOwner = forwardRef(({ customerRequestIds, onClose, deleteUser, idToDelete, users, requestIds }, ref) => {
    const [form] = Form.useForm();
    const [updateOrdersOwners] = useMutation(UPDATE_ORDERS_OWNERS);
    const owners = Form.useWatch('owners', form);
    const { validateFields } = form;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = useCallback(() => {
        validateFields().then(async values => {
            if (isSubmitting) {
                return;
            }
            setIsSubmitting(true);
            try {
                message.loading('Assigning new owners...', 50000);
                await updateOrdersOwners({
                    variables: { customerRequestIds, requestIds, ownerIds: values.owners, ownerIdToRemove: idToDelete },
                });
                await deleteUser();
                onClose();
                setIsSubmitting(false);
                return true;
            } catch (e) {
                message.destroy();
                message.error('Error on assigning new owners');
                onClose();
                setIsSubmitting(false);
                return false;
            }
        });
    }, [isSubmitting, deleteUser, validateFields, onClose, updateOrdersOwners, requestIds, idToDelete]);

    const options = useMemo(() => users.filter(({ id }) => id !== idToDelete), [users, idToDelete]);
    const hasSelection = owners && owners.length > 0;

    return (
        <Box $textAlign="left" ref={ref}>
            <Form onFinish={handleSubmit} name="newOwnerFormC" form={form}>
                <Form.Item label="Select new requests owner" colon={false} required={false} style={{ marginTop: 20, marginBottom: 0 }} name="owners">
                    <FieldOwnerSelector options={options} />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button type="default" $mr="10" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={!hasSelection} type={!hasSelection ? 'primary' : 'danger'} htmlType="submit">
                        Remove
                    </Button>
                </Form.Item>
            </Form>
        </Box>
    );
});

export default FormNewOwner;
