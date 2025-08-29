import React, { memo, useMemo, useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Form } from '@components/Form';
import debounce from 'lodash/debounce';
import SearchInput from '@components/Input/SearchInput';
import TeamField from '../blocks/TeamField';
import RoleField from '../blocks/RoleField';
import DesignTypeField from '../blocks/DesignTypeField';
import StatusField from '../blocks/StatusField';

const MembersTabFilters = memo(({ onChangeFilters, filters }) => {
    const [form] = Form.useForm();
    const { resetFields, setFieldsValue } = form;
    const [showFilters] = useState(true);

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    const handleResetForm = () => {
        resetFields();

        Object.entries({
            keyword: '',
            team: 'ALL',
            designType: 'ALL',
            role: 'ALL',
            status: 'ALL',
        }).forEach(([key, value]) => {
            onChangeFilters(key, value);
        });
    };

    const isSameAsInitial =
        filters.keyword === '' && filters.team === 'ALL' && filters.role === 'ALL' && filters.designType === 'ALL' && filters.status === 'ALL';

    return (
        <>
            {showFilters && (
                <Box $mb="30">
                    <Form
                        form={form}
                        name="membersTabFilterForm"
                        initialValues={{
                            keyword: '',
                            team: 'ALL',
                            role: 'ALL',
                            designType: 'ALL',
                            status: 'ALL',
                        }}
                    >
                        <Box $d="flex" $alignItems="center" $mx="-10">
                            <Box $maxW="404" $flex="1" $mx="10" $mb="-10">
                                <Form.Item name="keyword" label="" colon={false} required={false}>
                                    <SearchInput
                                        onChangeText={value => {
                                            debouncedOnChangeFilters('keyword', value);
                                        }}
                                        onClear={() => {
                                            setFieldsValue({ keyword: '' });
                                            onChangeFilters('keyword', '');
                                        }}
                                        placeholder="Search by status, team, user"
                                    />
                                </Form.Item>
                            </Box>
                            <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                                <Form.Item name="team" label="" colon={false} required={false}>
                                    <TeamField onFieldChange={onChangeFilters} />
                                </Form.Item>
                            </Box>
                            <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                                <Form.Item name="role" label="" colon={false} required={false}>
                                    <RoleField onFieldChange={onChangeFilters} />
                                </Form.Item>
                            </Box>
                            <Box $maxW="246" $flex="1" $mx="10" $mb="-10">
                                <Form.Item name="designType" label="" colon={false} required={false}>
                                    <DesignTypeField onFieldChange={onChangeFilters} />
                                </Form.Item>
                            </Box>
                        </Box>
                        <Box $d="flex" $alignItems="center">
                            <Form.Item name="status" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                                <StatusField handleFieldsChange={onChangeFilters} value={filters.status} />
                            </Form.Item>
                            {!isSameAsInitial && (
                                <Text $ml="20" $textVariant="H6" $colorScheme="cta" onClick={handleResetForm} $cursor="pointer">
                                    Reset Filters
                                </Text>
                            )}
                        </Box>
                    </Form>
                </Box>
            )}
        </>
    );
});

export default MembersTabFilters;
