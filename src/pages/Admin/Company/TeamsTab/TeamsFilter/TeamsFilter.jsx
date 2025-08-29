import React, { memo, useMemo } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import SearchInput from '@components/Input/SearchInput';
import debounce from 'lodash/debounce';

const TeamsFilter = memo(({ onChangeFilters }) => {
    const [form] = Form.useForm();
    const { setFieldsValue } = form;

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    return (
        <Box $mb="20">
            <Box $maxW="420">
                <Form form={form}>
                    <Form.Item name="search" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                        <SearchInput
                            onChangeText={value => {
                                debouncedOnChangeFilters('search', value);
                            }}
                            onClear={() => {
                                setFieldsValue({ search: '' });
                                onChangeFilters('search', '');
                            }}
                            placeholder="Search by designer, team name, team leader"
                        />
                    </Form.Item>
                </Form>
            </Box>
        </Box>
    );
});

export default TeamsFilter;
