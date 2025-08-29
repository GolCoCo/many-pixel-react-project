import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';

const PauseCancelModal = memo(({ visible, onCancel, onPauseSelectModalSubs, onCancelSubs, planStatus }) => {

    const isPause = planStatus === 'paused' || planStatus === 'willPause';

    return (
        <Popup
            $variant="default"
            width={500}
            title={isPause ? 'Cancel subscription' : 'Pause or cancel subscription'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <Text $textVariant="P4" $colorScheme="secondary" $mb={isPause ? '30' : '21'}>
                <Text $d="inline" $colorScheme="primary" $fontWeight="500">
                    Cancelling your subscription
                </Text>{' '}
                will remove access to all of your requests and files at the end of your billing cycle. You will be able
                to use the service until then.
            </Text>
            {!isPause && (
                <Text $textVariant="P4" $colorScheme="secondary" $mb="30">
                    If you are planning to use the service at a later stage and would like to keep access to your
                    requests and files, you can{' '}
                    <Text $d="inline" $colorScheme="primary" $fontWeight="500">
                        pause your subscription
                    </Text>{' '}
                    for{' '}
                    <Text $d="inline" $colorScheme="primary" $fontWeight="500">
                        $10 per month
                    </Text>{' '}
                    and resume it anytime. This will take effect immediately: your remaining credits will be kept in
                    your account and can be used later.
                </Text>
            )}
            <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                <Box $mb={['16', '0']}>
                    <Button type="danger" onClick={onCancelSubs} $w={['100%', 'auto']}>
                        Cancel subscription
                    </Button>
                </Box>
                {!isPause && (
                    <Button
                        $ml={['0', '14']}
                        type="primary"
                        onClick={onPauseSelectModalSubs}
                        $w={['100%', 'auto']}
                    >
                        Pause subscription
                    </Button>
                )}
            </Box>
        </Popup>
    );
});

export default PauseCancelModal;
