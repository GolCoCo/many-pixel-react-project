import React from 'react';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import IconSearch from '@components/Svg/IconSearch';

const MembersFilter = ({ onChangeFilters }) => {
    const [form] = Form.useForm();
    const handleFieldsChange = e => {
        const newValue = e.target.value;
        onChangeFilters(newValue);
    };

    return (
        <Form
            form={form}
            name="membersFilterForm"
            initialValues={{
                filter: '',
            }}
        >
            <Box $maxW="404" $flex="1">
                <Form.Item name="filter" label="" colon={false} required={false} style={{ marginBottom: 20 }}>
                    <Input
                        prefix={
                            <Box $d="inline-flex" $alignItems="center" $colorScheme="cta" $lineH="1">
                                <IconSearch />
                            </Box>
                        }
                        placeholder="Search by status, team, user"
                        onChange={e => handleFieldsChange(e)}
                    />
                </Form.Item>
            </Box>
        </Form>
    );
};

export default MembersFilter;
