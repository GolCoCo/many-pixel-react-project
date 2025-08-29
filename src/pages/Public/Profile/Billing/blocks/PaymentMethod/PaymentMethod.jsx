import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import EditCardModal from './EditCardModal';

const brandLogos = {
    Visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
    Mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
    'American Express': 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
    UnionPay: 'https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg',

    // Not Supported, if it is, make sure that brand name same as this brand logs key attribute
    // discover: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
    // diners: 'https://js.stripe.com/v3/fingerprinted/img/diners-fbcbd3360f8e3f629cdaa80e93abdb8b.svg',
    // jcb: 'https://js.stripe.com/v3/fingerprinted/img/jcb-271fd06e6e7a2c52692ffa91a95fb64f.svg',
};

const PaymentMethod = ({ paymentMethod, refetchSubscriptionInvoice }) => {
    const [isEditCardVisible, setIsEditCardVisible] = useState(false);

    const handleEditCardVisible = () => {
        setIsEditCardVisible(!isEditCardVisible);
    };

    const logoBrandName = paymentMethod?.card?.brand ?? 'Visa';
    const selectedImage = brandLogos[logoBrandName] ?? brandLogos.Visa;

    return (
        <>
            <EditCardModal
                visible={isEditCardVisible}
                onClose={handleEditCardVisible}
                paymentMethod={paymentMethod}
                refetchSubscriptionInvoice={refetchSubscriptionInvoice}
            />
            <Box $my={['20', '32']}>
                <Text $textVariant="H5" $colorScheme="primary" $mb="16">
                    Payment method
                </Text>
                <Box
                    $w={['100%', '300']}
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="outline-gray"
                    $px="20"
                    $py="16"
                    $alignItems="center"
                    $mb="20"
                    $radii="10"
                >
                    <Box $d="flex">
                        <Box $mr="16">
                            <Box as="img" src={selectedImage} alt={logoBrandName} $h="25" />
                        </Box>
                        <Box $mt="-5">
                            <Text $textVariant="Badge" $colorScheme="primary" $mb="-4">
                                &#8226; &#8226; &#8226; &#8226; &nbsp; &#8226; &#8226; &#8226; &#8226; &nbsp; &#8226;
                                &#8226; &#8226; &#8226; &nbsp; {paymentMethod?.card?.last4}
                            </Text>
                            {paymentMethod?.card && (
                                <Text $textVariant="P5" $colorScheme="secondary">
                                    {paymentMethod.card.expMonth < 10 && '0'}
                                    {paymentMethod.card.expMonth}/{paymentMethod.card.expYear}
                                </Text>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Button $h="44" $fontSize="12px" $w={['100%', 'auto']} type="primary" onClick={handleEditCardVisible}>
                    Edit Card
                </Button>
            </Box>
        </>
    );
};

export default PaymentMethod;
