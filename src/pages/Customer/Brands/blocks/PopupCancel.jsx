import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';

const CancelModal = memo(({ visible, onCancel, setShowCancel }) => {
    return (
        <Popup
            $variant="default"
            width={500}
            title="Are you sure you want to quit?"
            open={visible}
            onCancel={() => {
                setShowCancel(false);
            }}
            footer={null}
            destroyOnClose
            centered
            maskClosable={false}
        >
            <Text $textVariant="P4" $colorScheme="secondary" $mb={'30'}>
                All changes on this brand will be cancelled.
            </Text>

            <Box $d={['block', 'flex']} $justifyContent="flex-end" $alignItems="center">
                <Box $mb={['16', '0']}>
                    <Button
                        type="default"
                        onClick={() => {
                            setShowCancel(false);
                        }}
                        $w={['100%', 'auto']}
                    >
                        CANCEL
                    </Button>
                </Box>
                <Button
                    $ml={['0', '14']}
                    type="primary"
                    onClick={() => {
                        onCancel();
                        setShowCancel(false);
                    }}
                    $w={['100%', 'auto']}
                >
                    QUIT
                </Button>
            </Box>
        </Popup>
    );
});

export default CancelModal;
