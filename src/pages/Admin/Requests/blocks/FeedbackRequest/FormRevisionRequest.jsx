import React, { memo, useState } from 'react';
import { Text } from '@components/Text';
import { FieldMove } from '../DetailRequest/FieldMove.jsx';

const FormRevisionRequest = memo(({ onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [moveValue, setMoveValue] = useState(undefined);

    const onChange = async move => {
        setIsSubmitting(true);
        setMoveValue(move);
        await onSubmit({
            move,
        });
    };

    return (
        <>
            <Text $textVariant="H6" $mb="8" $colorScheme="primary">
                Revision needed?
            </Text>
            <Text $textVariant="P4" $colorScheme="primary" $mb="20">
                Is there any more work required? Would you like to move this request back to your Queue?
            </Text>
            <Text $textVariant="H6" $mb="10" $colorScheme="primary">
                Move to
            </Text>
            <FieldMove onChange={onChange} value={moveValue} lastMb="0" loading={isSubmitting} />
        </>
    );
});

export default FormRevisionRequest;
