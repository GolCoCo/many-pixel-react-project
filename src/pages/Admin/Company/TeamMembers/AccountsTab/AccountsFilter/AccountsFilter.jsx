import React from 'react';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import IconSearch from '@components/Svg/IconSearch';
import StatusField from '@pages/Admin/Company/MembersTab/blocks/StatusField';

const AccountsFilter = ({ onChangeFilters }) => {
    const [form] = Form.useForm();
    const handleFieldsChange = (name, value) => {
        const newValue = value;
        onChangeFilters({ [name]: newValue });
    };

    return (
        <Form
            form={form}
            name="accountsFilter"
            initialValues={{
                search: '',
                status: 'ALL',
            }}
        >
            <Box $d="flex" $justifyContent="space-between">
                <Box $maxW="404" $flex="1">
                    <Form.Item name="search" label="" colon={false} required={false} style={{ marginBottom: 20 }}>
                        <Input
                            prefix={
                                <Box $d="inline-flex" $alignItems="center" $colorScheme="cta" $lineH="1">
                                    <IconSearch />
                                </Box>
                            }
                            placeholder="Search by email, user, company"
                            onChange={e => handleFieldsChange('search', e.target.value)}
                        />
                    </Form.Item>
                </Box>
                <Box $d="flex" $alignItems="center">
                    <Form.Item label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                        <StatusField handleFieldsChange={handleFieldsChange} />
                    </Form.Item>
                </Box>
            </Box>
        </Form>
    );
};

export default AccountsFilter;
