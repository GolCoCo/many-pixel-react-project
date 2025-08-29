import React, { memo, useCallback, useMemo } from 'react';
import { Box } from '@components/Box';
import { Form } from '@components/Form';
import { USER_TYPE_WORKER } from '@constants/account';
import SearchInput from '@components/Input/SearchInput';
import TeamField from '../blocks/TeamField';
import DesignerField from '../blocks/DesignerField';
import * as qs from 'query-string';
import { debounce } from 'lodash';

const AccountsTabFilter = memo(({ onChangeFilters, viewer, designerId }) => {
    const [form] = Form.useForm();
    // const [hasEdit, setHasEdit] = useState(false);
    const { setFieldsValue } = form;
    const isWorker = viewer?.role === USER_TYPE_WORKER;
    const initialDesigner = designerId || (isWorker ? viewer?.id : 'ALL');
    const viewerId = viewer?.id;
    const parsed = qs.parse(window.location.search);

    const handleFieldsChange = (name, value) => {
        onChangeFilters(name, value);
    };

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    const handleSubmit = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    return (
        <Box $mb="20">
            <Form
                onFinish={handleSubmit}
                initialValues={{
                    account: 'ALL',
                    designer: initialDesigner,
                    product: 'ALL',
                    keyword: parsed.keyword ? parsed.keyword : '',
                    team: parsed.team ? parsed.team : 'ALL',
                }}
                form={form}
                name="accountsTabFilterForm"
            >
                <Box $d="flex" $alignItems="center" $mx="-10">
                    <Box $maxW="404" $flex="1" $mx="10">
                        <Form.Item name="keyword" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <SearchInput
                                onChangeText={value => debouncedOnChangeFilters('keyword', value)}
                                onClear={() => {
                                    setFieldsValue({ keyword: '' });
                                    onChangeFilters('keyword', '');
                                }}
                                placeholder="Search by account, request name, request number"
                            />
                        </Form.Item>
                    </Box>
                    <Box $maxW="180" $flex="1" $mx="10">
                        <Form.Item name="team" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <TeamField onFieldChange={handleFieldsChange} />
                        </Form.Item>
                    </Box>
                    <Box $maxW={designerId || isWorker ? '200' : '336'} $flex="1" $mx="10">
                        <Form.Item name="designer" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <DesignerField isWorker={designerId || isWorker} onFieldChange={handleFieldsChange} viewerId={viewerId} disabled />
                        </Form.Item>
                    </Box>
                </Box>
            </Form>
        </Box>
    );
});

export default AccountsTabFilter;
