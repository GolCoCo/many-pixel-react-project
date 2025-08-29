import React, { memo, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Select } from '@components/Select';
import { Skeleton } from '@components/Skeleton';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Link } from '@components/Link';
import message from '@components/Message';
import { ALL_ACTIVE_WORKERS } from '@graphql/queries/user';
import { ASSIGN_ORDER_WORKERS } from '@graphql/mutations/order';
import { MEMBER_INFO } from '@constants/routes';
import { useLocation } from 'react-router-dom';
import { getStrings, mapDesignerIdsToValues, mapValuesToDesignerIds, parseDesignerOptions } from '@pages/Admin/Requests/blocks/DetailRequest/designer-field-lib';
import { Tooltip } from 'antd';

const RowDesignerField = memo(({ requestId, designerIds, requestStatus }) => {
    const [form] = Form.useForm();
    const { loading, data, refetch } = useQuery(ALL_ACTIVE_WORKERS, {
        fetchPolicy: 'network-only',
    });

    const location = useLocation();
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [assignOrderWorkers] = useMutation(ASSIGN_ORDER_WORKERS);

    const designersResult = useMemo(() => parseDesignerOptions(Array.isArray(data?.allUsers) ? data.allUsers : []), [data]);

    const designerIdValues = useMemo(
        () => mapDesignerIdsToValues(getStrings(designerIds), designersResult.idToDataMap),
        [designerIds, designersResult.idToDataMap]
    );

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const options = designersResult.array.map(({ data: designer, value }) => {
        return (
            <Select.Option key={designer.id} value={value}>
                <Box
                    as={isOpen ? 'div' : Link}
                    to={{
                        pathname: MEMBER_INFO.replace(':id', designer.id ?? ''),
                        state: { previousPage: location.pathname },
                    }}
                    $maxW="221"
                    $d="inline-flex"
                >
                    <Box $d="flex" $alignItems="center" className={designerIdValues.includes(value) ? 'selected-multiple' : 'not-selected-multiple'}>
                        <Box $isTruncate $maxW="185">
                            {designer.firstname} {designer.lastname?.[0]}
                        </Box>
                    </Box>
                </Box>
            </Select.Option>
        );
    });

    const handleChange = async vals => {
        const ids = mapValuesToDesignerIds(getStrings(vals), designersResult.valueToIdMap);

        try {
            message.destroy();
            message.loading('Updating designer(s)...', 50000);
            setIsSaving(true);
            setIsOpen(false);

            await assignOrderWorkers({ variables: { id: +requestId, workersIds: ids } })
                .then(async () => {
                    await refetch();
                    message.destroy();
                    message.success('Designer(s) has been updated');
                    setIsSaving(false);
                })
                .catch(err => {
                    console.log(err);
                    setIsSaving(false);
                    message.destroy();
                    message.error('Error on updating designer(s)');
                });
        } catch (e) {
            console.log(e);
            setIsSaving(false);
            setIsOpen(false);
            message.destroy();
            message.error('Error on updating designer(s)');
        }
    };

    const handleDropdownVisibleChange = bool => {
        setIsOpen(bool);
    };

    return (
        <Box>
            <Form
                form={form}
                name="rowDesignerFieldForm"
                initialValues={{
                    assignedDesigners: designerIdValues,
                }}
            >
                <Form.Item name="assignedDesigners" label="" colon={false} required={false} style={{ marginBottom: -5 }}>
                    <Select
                        mode="multiple"
                        placeholder="Select Designer(s)"
                        dropdownStyle={{ width: 278 }}
                        dropdownMatchSelectWidth={false}
                        showArrow
                        style={{ maxHeight: 80, overflowY: 'auto', overflowX: 'hidden' }}
                        onChange={handleChange}
                        disabled={requestStatus === 'DRAFT' || requestStatus === 'ON_HOLD' || isSaving}
                        loading={isSaving}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        maxTagCount="responsive"
                        maxTagPlaceholder={omittedValues => (
                            <Tooltip
                                color="white"
                                styles={{ root: { pointerEvents: 'none' } }}
                                title={omittedValues
                                    .map(({ value }) => {
                                        const found = designersResult.array.find(({ value: designerValue }) => designerValue === value);
                                        const { data: item } = found;
                                        return `${item.firstname} ${item.lastname?.[0]}`;
                                    })
                                    .join(', ')}
                            >
                                <span>...</span>
                            </Tooltip>
                        )}
                    >
                        {options}
                    </Select>
                </Form.Item>
            </Form>
        </Box>
    );
});

export default RowDesignerField;
