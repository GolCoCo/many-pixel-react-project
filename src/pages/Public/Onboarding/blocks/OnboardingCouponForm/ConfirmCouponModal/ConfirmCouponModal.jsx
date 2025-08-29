import React from 'react';
import { Popup } from '@components/Popup';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';

const ConfirmCouponModal = ({ visible, onCancel, onApplyCoupon }) => {
    return (
        <Popup
            $variant="default"
            width={500}
            title="Override referral bonus?"
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <Text $textVariant="P4" $colorScheme="primary" $mb="30">
                Your coupon will override the referral bonus. Are you sure you want to apply the coupon?
            </Text>
            <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                <Button type="default" onClick={onCancel} $mr="14">
                    NO
                </Button>
                <Button type="primary" onClick={onApplyCoupon}>
                    Yes, apply
                </Button>
            </Box>
        </Popup>
    );
};

export default ConfirmCouponModal;
