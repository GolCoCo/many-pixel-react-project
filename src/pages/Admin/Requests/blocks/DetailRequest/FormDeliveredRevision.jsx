import React from 'react';
import { FieldMove } from './FieldMove.jsx';
import { Text } from '@components/Text';

const FormDeliveredRevision = ({ onChangeMove, onClickComplete }) => {
    return (
        <>
            <Text $textVariant="P4" $mb="20" $colorScheme="primary">
                Is there any more work required? Would you like to move this request back to your Queue?
            </Text>
            <Text $textVariant="H6" $mb="10" $colorScheme="primary">
                Move to
            </Text>
            <FieldMove onChange={onChangeMove} lastMb="0" />
            <Text
                $mt="20"
                as="button"
                type="button"
                $appearance="none"
                $cursor="pointer"
                $bg="transparent"
                $borderW="0"
                $textVariant="Badges"
                $colorScheme="cta"
                onClick={onClickComplete}
            >
                No more work is required on this request - mark as complete
            </Text>
        </>
    );
};

export default FormDeliveredRevision;
