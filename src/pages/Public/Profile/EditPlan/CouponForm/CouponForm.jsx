import React, { useCallback, useEffect, useState } from 'react';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import coupon from '@public/assets/icons/coupon.svg';

const CouponForm = ({ handleCoupon, shouldReset, setShouldReset }) => {
    const [form] = Form.useForm()
    const { validateFields } = form;
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (shouldReset) {
            form.resetFields()
            setShouldReset(false)
        }
    }, [shouldReset])

    const handleSubmit = useCallback(
        () => {
            validateFields().then(async (values) => {
                if (!isSubmitting) {
                    setIsSubmitting(true);
                    await handleCoupon(values.couponCode);
                }
                setIsSubmitting(false);
            });
        },
        [isSubmitting, validateFields, handleCoupon]
    );

    return (
        <Box $mb="-10">
            <Form
                name="updateSubCouponForm"
                form={form}
                onFinish={handleSubmit}
            >
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
                            <Input prefix={<img src={coupon} alt="Coupon" />} placeholder="Enter coupon" isCoupon/>
                        </Form.Item>
                    </Box>
                    <Box $w="106">
                        <Form.Item>
                            <Button
                                $radii="0 10px 10px 0"
                                $h={['40', '40']}
                                type="primary"
                                loading={isSubmitting}
                                htmlType="submit"
                                $w="100%"
                        >
                                Apply
                            </Button>
                        </Form.Item>
                    </Box>
                </Box>
            </Form>
        </Box>
    );
};

export default CouponForm;
