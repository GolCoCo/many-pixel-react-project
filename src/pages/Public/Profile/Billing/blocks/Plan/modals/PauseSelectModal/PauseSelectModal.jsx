import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';

const PauseSelectModal = memo(({ visible, onCancel, onPauseSubs, onPauseLaterSubs, planStatus }) => {

    const isPause = planStatus === 'paused' || planStatus === 'willPause';

    return (
        <Popup
            $variant="default"
            width={500}
            title='Pause subscription'
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <Text $textVariant="P4" $colorScheme="secondary" $mb='30'>
            You can{' '}<Text $d="inline" $colorScheme="primary" $fontWeight="500">pause your subscription now</Text>. Your remaining credits will be applied to your next invoice. You can resume your subscription at anytime.
            </Text>
            <Text $textVariant="P4" $colorScheme="secondary" $mb='30'>
            You can also{' '}<Text $d="inline" $colorScheme="primary" $fontWeight="500">schedule your subscription to go on pause at the end of your billing cycle</Text>. You will be able to use the service until then. 
            </Text>
            <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                <Box $mb={['16', '0']}>
                    <Button type="primary" onClick={ onPauseSubs } $w={['100%', 'auto']}>
                        PAUSE NOW
                    </Button>
                </Box>
                {!isPause && (
                    <Button
                        $ml={['0', '14']}
                        type="primary"
                        onClick={onPauseLaterSubs}
                        $w={['100%', 'auto']}
                    >
                        PAUSE AT END OF BILLING CYCLE
                    </Button>
                )}
            </Box>
        </Popup>
    );
});

export default PauseSelectModal;
