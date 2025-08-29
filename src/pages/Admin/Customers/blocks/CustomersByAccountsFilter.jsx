import React, { useMemo } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import debounce from 'lodash/debounce';
import SearchInput from '@components/Input/SearchInput';
import PlanField from './PlanField.jsx';
import TeamField from './TeamField.jsx';
import StatusField from './StatusField.jsx';

const CustomersByAccountsFilter = ({ onChangeFilters }) => {
    const [form] = Form.useForm();
    const { setFieldsValue } = form;

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    return (
        <Box>
            <Form
                form={form}
                name="customersByAccountsFilterForm"
                initialValues={{
                    keyword: '',
                    plan: 'ALL',
                    team: 'ALL',
                    status: 'ALL',
                }}
            >
                <Box $d="flex" $alignItems="center" $mx="-10">
                    <Box $maxW="402" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="keyword" label="" colon={false} required={false}>
                            <SearchInput
                                onChangeText={value => {
                                    debouncedOnChangeFilters('keyword', value);
                                }}
                                onClear={() => {
                                    setFieldsValue({ keyword: '' });
                                    onChangeFilters('keyword', '');
                                }}
                                placeholder="Search..."
                            />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="plan" label="" colon={false} required={false}>
                            <PlanField onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="team" label="" colon={false} required={false}>
                            <TeamField onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                    <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                        <Form.Item name="status" label="" colon={false} required={false}>
                            <StatusField onFieldChange={onChangeFilters} />
                        </Form.Item>
                    </Box>
                </Box>
            </Form>
        </Box>
    );
};

export default CustomersByAccountsFilter;
