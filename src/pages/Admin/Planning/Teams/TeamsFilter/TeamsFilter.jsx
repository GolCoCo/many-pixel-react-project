import React from 'react';
import { Form } from '@components/Form';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import DesignerField from './blocks/DesignerField/DesignerField.jsx';
import TeamsField from './blocks/TeamsField';
import { USER_TYPE_WORKER } from '@constants/account';

const TeamsFilter = ({ onChangeFilters, viewer }) => {
    const [form] = Form.useForm();
    const handleFieldsChange = (name, value) => {
        const newValue = value;
        onChangeFilters({ [name]: newValue });
    };

    const isWorker = viewer?.role === USER_TYPE_WORKER;

    return (
        <Box $mb="30">
            <Box $d="flex" $alignItems="center" $mx="-10">
                {!isWorker && (
                    <Box $mx="10">
                        <Text $textVariant="H6">Filter:</Text>
                    </Box>
                )}
                <Box $mx="10">
                    <Form layout="horizontal" form={form} initialValues={{ team: 'ALL', designer: 'ALL' }}>
                        <Box $d="flex" $alignItems="center">
                            <Form.Item label="" colon={false} required={false} style={{ marginBottom: 0, width: 200, marginRight: 20 }} name="team">
                                <TeamsField onFieldChange={handleFieldsChange} />
                            </Form.Item>
                            <Form.Item name="designer" label="" colon={false} required={false} style={{ marginBottom: 0, width: 200 }}>
                                <DesignerField onFieldChange={handleFieldsChange} />
                            </Form.Item>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>
    );
};

export default TeamsFilter;
