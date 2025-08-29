import React from 'react';
import { FieldMove } from './FieldMove.jsx';
import { Text } from '@components/Text';

const FormResumeRequest = ({ onChange }) => {
    return (
        <>
            <Text $textVariant="P4" $mb="20" $colorScheme="primary">
                This request will be moved back to your Queue
            </Text>
            <Text $textVariant="H6" $mb="10" $colorScheme="primary">
                Move to
            </Text>
            <FieldMove onChange={onChange} lastMb="0" />
        </>
    );
};

export default FormResumeRequest;
