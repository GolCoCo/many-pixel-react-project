import React, { useMemo } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import debounce from 'lodash/debounce';
import SearchInput from '@components/Input/SearchInput';
import StatusField from './StatusField.jsx';
import AccountField from './AccountField.jsx';
import RoleField from './RoleField.jsx';

const CustomersByUsersFilter = ({ onChangeFilters }) => {
    const [form] = Form.useForm();
    const { setFieldsValue } = form;

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    return (
        <Box>
            <Form
                form={form}
                name="customerByUserFilterForm"
                initialValues={{
                    keyword: '',
                    account: 'ALL',
                    role: 'ALL',
                    status: 'ALL',
                }}
            >
                <Box $d="flex" $alignItems="center" $mx="-10">
                    <Box $maxW="402" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="keyword" label="" colon={false} required={false}>
                            <SearchInput
                                onChangeText={value => debouncedOnChangeFilters('keyword', value)}
                                onClear={() => {
                                    setFieldsValue({ keyword: '' });
                                    onChangeFilters('keyword', '');
                                }}
                                placeholder="Search..."
                            />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="account" label="" colon={false} required={false}>
                            <AccountField onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="role" label="" colon={false} required={false}>
                            <RoleField onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="status" label="" colon={false} required={false}>
                            <StatusField isUsersActive onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                </Box>
            </Form>
        </Box>
    );
};

export default CustomersByUsersFilter;
