import React, { memo, useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';

const UpdatePlanConfirmationModal = memo(({ visible, onCancel, onConfirm, plan }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
    };
    return (
        <Popup
            $variant="default"
            width={500}
            title="Update confirmation"
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            closable={false}
            maskCloseable={false}
        >
            <Text $textVariant="P4" $colorScheme="primary" $mb="30">
                Are you sure you want to update your plan to {plan}?
            </Text>
            <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                <Box $mr={['0', '14']} $mb={['16', '0']}>
                    <Button disabled={isLoading} type="default" onClick={onCancel} $w={['100%', 'auto']}>
                        No, stay with current plan
                    </Button>
                </Box>
                <Button
                    loading={isLoading}
                    disabled={isLoading}
                    type="primary"
                    onClick={handleConfirm}
                    $w={['100%', 'auto']}
                >
                    Yes, update now
                </Button>
            </Box>
        </Popup>
    );
});

export default UpdatePlanConfirmationModal;
