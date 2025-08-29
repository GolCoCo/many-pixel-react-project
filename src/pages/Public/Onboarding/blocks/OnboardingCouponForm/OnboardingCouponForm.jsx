import React, { useCallback, useState, memo } from 'react';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import ConfirmCouponModal from './ConfirmCouponModal';
import coupon from '@public/assets/icons/coupon.svg';

const OnboardingCouponForm = memo(({ referrerId, handleCoupon, initialCoupon }) => {
    const [form] = Form.useForm()
    const { validateFields, resetFields } = form;
    const [isSubmitting, setSubmitting] = useState(false);
    const [showConfirmCouponModal, setShowConfirmCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState(() => initialCoupon ?? null);

    const handleConfirmCouponModalVisible = () => {
        setShowConfirmCouponModal(!showConfirmCouponModal);
    };

    const handleApplyCoupon = () => {
        setShowConfirmCouponModal(false);
        handleCoupon(couponCode);
        resetFields();
    };

    const handleSubmit = useCallback(
        () => {
            validateFields().then((values) => {
                if (!isSubmitting) {
                    setSubmitting(true);
                    if (!referrerId) {
                        handleCoupon(values.couponCode);
                        resetFields();
                    } else {
                        setShowConfirmCouponModal(true);
                        setCouponCode(values.couponCode);
                    }
                }
                setSubmitting(false);
            });
        },
        [isSubmitting, validateFields, handleCoupon, referrerId, resetFields]
    );

    return (
        <>
            <ConfirmCouponModal
                open={showConfirmCouponModal}
                onCancel={handleConfirmCouponModalVisible}
                onApplyCoupon={handleApplyCoupon}
                initialValues={{
                    couponCode: initialCoupon,
                }}
            />
            <Box $mb="-30">
                <Form onFinish={handleSubmit} form={form} name="onBoardingCouponForm">
                    <Box $d="flex" $alignItems="center">
                        <Box $flex="1 1 0%">
                            <Form.Item
                                name="couponCode"
                                rules={[
                                        {
                                            required: true,
                                            message: '',
                                        },
                                ]}
                            >
                                <Input prefix={<img src={coupon} alt="Coupon" />} placeholder="Enter coupon" isCoupon />
                            </Form.Item>
                        </Box>
                        <Box $w="106">
                            <Form.Item>
                                <Button
                                    $h={['40', '40']}
                                    type="primary"
                                    loading={isSubmitting}
                                    htmlType="submit"
                                    $w="100%"
                                    $radii="0 10px 10px 0"
                                >
                                    Apply
                                </Button>
                            </Form.Item>
                        </Box>
                    </Box>
                </Form>
            </Box>
        </>
    );
});

export default OnboardingCouponForm;
