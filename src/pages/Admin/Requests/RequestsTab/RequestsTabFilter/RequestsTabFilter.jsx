import React, { memo, useMemo } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Form } from '@components/Form';
import { USER_TYPE_WORKER } from '@constants/account';
import SearchInput from '@components/Input/SearchInput';
import StatusField from '../blocks/StatusField';
import TeamField from '../blocks/TeamField';
import AccountField from '../blocks/AccountField';
import DesignerField from '../blocks/DesignerField';
import ProductField from '../blocks/ProductField';
import * as qs from 'query-string';
import debounce from 'lodash/debounce';

const RequestsTabFilter = memo(({ onChangeFilters, viewer, designerId }) => {
    const [form] = Form.useForm();
    const { resetFields, setFieldsValue } = form;
    const isWorker = viewer?.role === USER_TYPE_WORKER;
    const parsed = qs.parse(window.location.search);

    const initialDesigner = parsed.designer ? parsed.designer : designerId || (isWorker ? viewer?.id : 'ALL');
    const initialStatus = parsed.status
        ? typeof parsed.status === 'string'
            ? [parsed.status]
            : parsed.status
        : viewer?.role === USER_TYPE_WORKER
        ? ['SUBMITTED', 'ONGOING_PROJECT']
        : ['ALL'];
    const handleFieldsChange = (name, value) => {
        onChangeFilters(name, value);
    };

    const debouncedOnChangeFilters = useMemo(() => debounce(onChangeFilters, 1000), [onChangeFilters]);

    const handleResetForm = () => {
        resetFields();
        onChangeFilters('', '', true);
    };

    return (
        <Box $mb="20">
            <Form
                form={form}
                name="requestsTabFilter"
                initialValues={{
                    keyword: parsed.keyword ?? '',
                    team: parsed.team ?? 'ALL',
                    account: parsed.account ?? 'ALL',
                    designer: initialDesigner,
                    product: parsed.product ?? 'ALL',
                    status: initialStatus,
                }}
            >
                <Box $d="flex" $alignItems="center" $mx="-10">
                    <Box $maxW="404" $flex="1" $mx="10">
                        <Form.Item name="keyword" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <SearchInput
                                onChangeText={value => debouncedOnChangeFilters('keyword', value)}
                                onClear={() => {
                                    setFieldsValue({ keyword: '' });
                                    handleFieldsChange('keyword', '');
                                }}
                                placeholder="Search by request, account, user"
                            />
                        </Form.Item>
                    </Box>
                    <Box $maxW={isWorker ? '180' : '140'} $flex="1" $mx="10">
                        <Form.Item name="team" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <TeamField onFieldChange={handleFieldsChange} />
                        </Form.Item>
                    </Box>
                    <Box $maxW={isWorker ? '356' : '226'} $flex="1" $mx="10">
                        <Form.Item name="account" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <AccountField isWorker={isWorker} onFieldChange={handleFieldsChange} />
                        </Form.Item>
                    </Box>
                    <Box $maxW={isWorker ? '200' : '170'} $flex="1" $mx="10">
                        <Form.Item name="designer" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                            <DesignerField isWorker={!!designerId || isWorker} onFieldChange={handleFieldsChange} />
                        </Form.Item>
                    </Box>
                    {!isWorker && (
                        <Box $maxW="180" $flex="1" $mx="10">
                            <Form.Item name="product" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                                <ProductField onFieldChange={handleFieldsChange} />
                            </Form.Item>
                        </Box>
                    )}
                </Box>
                <Box $d="flex" $alignItems="center" $pt="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mr="20">
                        Status
                    </Text>
                    <Form.Item name="status" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                        <StatusField isWorker={true} handleFieldsChange={handleFieldsChange} />
                    </Form.Item>
                    <Text $ml="20" $textVariant="H6" $colorScheme="cta" onClick={handleResetForm} $cursor="pointer">
                        Reset Filters
                    </Text>
                </Box>
            </Form>
        </Box>
    );
});

export default RequestsTabFilter;
