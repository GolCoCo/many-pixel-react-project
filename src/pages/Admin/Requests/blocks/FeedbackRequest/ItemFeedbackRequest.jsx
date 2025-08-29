import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import IconFiles from '@components/Svg/IconFiles';
import IconMarkComplete from '@components/Svg/IconMarkComplete';
import FormFeedbackRequest from './FormFeedbackRequest';
import { useMutation } from '@apollo/client';
import { CHANGE_ORDER_STATUS, MARK_AS_COMPLETE, UPDATE_ORDERS_PRIORITY } from '@graphql/mutations/order';
import { ORDER_STATUS_COMPLETED, ORDER_STATUS_QUEUED } from '@constants/order';
import FormRevisionRequest from './FormRevisionRequest';

const textCompleted = 'Thank you! Your feedback has been submitted.';
const textRework = 'Your request has been moved to your queue';

const responses = {
    Rework: textRework,
    Completed: textCompleted,
};

export const ItemFeedbackRequest = ({ id, name, category, mb = '16', refetch }) => {
    const [showInput, setShowInput] = useState(false);
    const [response, setResponse] = useState(null);

    // const [createOrderFeedback] = useMutation(CREATE_ORDER_FEEDBACK);
    const [markAsComplete] = useMutation(MARK_AS_COMPLETE);
    const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS);
    const [updateOrdersPriority] = useMutation(UPDATE_ORDERS_PRIORITY);

    const handleClickComplete = () => {
        setResponse('Completed');
        setShowInput(true);
    };

    const handleClickRework = () => {
        setResponse('Rework');
        setShowInput(true);
    };

    const handleSubmit = async values => {
        try {
            if (response === 'Completed') {
                await markAsComplete({
                    variables: {
                        id,
                        status: ORDER_STATUS_COMPLETED,
                        feedback: values.comment,
                        rate: values.rate,
                    },
                });
            } else {
                await changeOrderStatus({
                    variables: {
                        id,
                        status: ORDER_STATUS_QUEUED,
                    },
                });

                await updateOrdersPriority({
                    variables: {
                        orders: [{ id, priority: values.move === 'top' ? 1 : 9999 }],
                    },
                });
            }

            await refetch();

            setShowInput(false);
        } catch (err) {
            console.log(err);
            setShowInput(false);
        }
    };

    return (
        <Box $py="14" $px="16" $bg="bg-gray" $mb={mb} $radii="10">
            <Box $borderB="1" $borderBottomStyle="solid" $borderBottomColor="outline-gray">
                <Text $textVariant="H6" $colorScheme="primary" $mb="4">
                    {name}
                </Text>
                <Box $d="flex" $mb="10" $alignItems="center">
                    <Text $textVariant="P4" $colorScheme="primary">
                        {category}
                    </Text>
                    <Box $bg="outline-gray" $h="10" $w="1" $mx="8" />
                    <Text $textVariant="P4" $colorScheme="cta">
                        #{id}
                    </Text>
                </Box>
            </Box>
            <Box $pt="10">
                {showInput ? (
                    <>{response === 'Completed' ? <FormFeedbackRequest onSubmit={handleSubmit} /> : <FormRevisionRequest onSubmit={handleSubmit} />}</>
                ) : response !== null ? (
                    <Text $textVariant="H6" $colorScheme={response === 'Rework' ? 'secondary' : 'other-pink'}>
                        {responses[response]}
                    </Text>
                ) : (
                    <Box $d="flex" $alignItems="center">
                        <Button
                            icon={
                                <Box $lineH="1" $fontSize="20">
                                    <IconFiles />
                                </Box>
                            }
                            type="link"
                            size="small"
                            $px="0"
                            $textTransform="unset"
                            $colorScheme="other-red"
                            $textVariant="H6"
                            mobileFontSize="12"
                            onClick={handleClickRework}
                            iscapitalized
                        >
                            Still needs rework
                        </Button>
                        <Box $h="20" $borderR="1" $borderRightStyle="solid" $borderRightColor="outline-gray" $mx="8" />
                        <Button
                            icon={
                                <Box $lineH="1" $fontSize="20">
                                    <IconMarkComplete />
                                </Box>
                            }
                            type="link"
                            size="small"
                            $px="0"
                            $textTransform="unset"
                            $textVariant="H6"
                            mobileFontSize="12"
                            onClick={handleClickComplete}
                        >
                            Mark as complete
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
