import React, { memo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Popup } from '@components/Popup';

const ConfirmationModal = memo(({ visible, onCancel, title, desc }) => {
    return (
        <Popup $variant="default" width={500} title={title} open={visible} onCancel={onCancel} footer={null} centered>
            <Text $textVariant="P4" $colorScheme="primary" $mb="30">
                {desc}
            </Text>
            <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                <Button type="primary" onClick={onCancel}>
                    Okay
                </Button>
            </Box>
        </Popup>
    );
});

export default ConfirmationModal;
