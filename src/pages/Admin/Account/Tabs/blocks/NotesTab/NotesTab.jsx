import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Input } from '@components/Input';
import { Form } from '@components/Form';
import { Button } from '@components/Button';
import * as theme from '@components/Theme';
import { Steps } from 'antd';
import { ADD_NOTE, CLEAR_COMPANY_NOTES } from '@graphql/mutations/company';
import message from '@components/Message';
import moment from 'moment';

const StyledSteps = styled(Steps)`
    .ant-steps-item-content {
        width: auto;
    }

    .ant-steps-item-title {
        ${theme.TYPO_P4}
        color: #262626;
        margin-bottom: 4px;
    }
    .ant-steps-item-description {
        ${theme.TYPO_P5}
        color: #8C8C8C;
    }
`;

const NotesTab = ({ isWorker, refetch, company }) => {
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [initialNote, setInitialNote] = useState('');
    const [addNote] = useMutation(ADD_NOTE);
    const [clearCompanyNotes] = useMutation(CLEAR_COMPANY_NOTES);
    const note = Form.useWatch('note', form);
    const handleEditClick = useCallback(() => {
        setShowEdit(false);
    }, []);

    useEffect(() => {
        setShowEdit(!company?.isNotesCleared && !!company?.notes[0]?.text);
        setInitialNote(!company?.isNotesCleared ? company?.notes[0]?.text : '');
    }, [company]);

    const handleClearNotes = useCallback(async () => {
        try {
            setIsDeleting(true);
            message.destroy();
            message.loading('Clearing notes...', 1000);
            await clearCompanyNotes({
                variables: {
                    id: company.id,
                    isNotesCleared: true,
                },
            });
            message.destroy();
            message.success('Notes successfully cleared');
            setIsDeleting(false);
            resetFields();
        } catch (err) {
            console.error(err);
        }
    }, [clearCompanyNotes, company, resetFields]);

    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                try {
                    setIsLoading(true);
                    message.destroy();
                    message.loading('Adding note...', 1000);
                    await addNote({
                        variables: {
                            text: values.note,
                            id: company?.id,
                        },
                    }).then(async () => {
                        await clearCompanyNotes({
                            variables: {
                                id: company.id,
                                isNotesCleared: false,
                            },
                        }).then(async () => {
                            await refetch();
                            message.destroy();
                            message.success('Note successfully added');
                            setIsLoading(false);
                            setShowEdit(true);
                        });
                    });
                } catch (error) {
                    message.destroy();
                    console.error(error);
                    return false;
                }
            }
        });
    }, [refetch, addNote, company, validateFields, clearCompanyNotes, isLoading]);

    return (
        <Box $mt="30">
            <Text $textVariant="H5">Notes</Text>
            <Form
                form={form}
                onFinish={handleSubmit}
                name="notesTabForm"
                initalValues={{
                    note: initialNote,
                }}
            >
                <Box $mt="20" $mb={['16', '20']}>
                    <Form.Item name="note" label="Notes" colon={false} style={{ marginBottom: 0 }}>
                        <Input placeholder="Enter your notes" disabled={isWorker || showEdit} />
                    </Form.Item>
                </Box>
                {!isWorker && !showEdit && (
                    <Box $mt={['4', '0']}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button $h="40px" $fontSize="14px" type="primary" htmlType="submit" loading={isLoading} $w={['100%', 'auto']} disabled={!note}>
                                Save
                            </Button>
                        </Form.Item>
                    </Box>
                )}
                {!isWorker && showEdit && (
                    <Box $d="flex" $mt={['4', '0']}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                $h="40px"
                                $fontSize="14px"
                                type="primary"
                                loading={isLoading}
                                $w={['100%', 'auto']}
                                disabled={!initialNote}
                                $mr="20"
                                onClick={handleEditClick}
                            >
                                Edit
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                $h="40px"
                                $fontSize="14px"
                                type="secondary"
                                loading={isDeleting}
                                $w={['100%', 'auto']}
                                disabled={!initialNote || isLoading}
                                onClick={handleClearNotes}
                            >
                                Clear Notes
                            </Button>
                        </Form.Item>
                    </Box>
                )}
            </Form>
            {company?.notes?.length > 0 && (
                <Box $mt="30">
                    <Text $textVariant="H5">Note History</Text>
                    <Box $mt="20">
                        <StyledSteps progressDot direction="vertical" current={company?.notes?.length}>
                            {company?.notes?.map(item => (
                                <StyledSteps.Step
                                    key={item.id}
                                    title={item.text}
                                    description={`Created by ${item?.user?.firstname} ${item?.user?.lastname} on ${moment(item?.createdAt).format('D MMM YYYY')}`}
                                />
                            ))}
                        </StyledSteps>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default NotesTab;
