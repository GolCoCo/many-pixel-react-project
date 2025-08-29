import React, { memo, useMemo, useState } from 'react';
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
import {
    getStrings,
    mapDesignerIdsToValues,
    mapValuesToDesignerIds,
    parseDesignerOptions,
} from './designer-field-lib.js';

const DesignersField = memo(({ requestId, designerIds, requestStatus, isWorker }) => {
    const [form] = Form.useForm();
    const { loading, data, refetch } = useQuery(ALL_ACTIVE_WORKERS, {
        fetchPolicy: 'network-only',
    });
    const [assignOrderWorkers] = useMutation(ASSIGN_ORDER_WORKERS);
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isHorizontalOverflow, setIsHorizontalOverflow] = useState(true);
    const location = useLocation();

    const dataAllUsers = data?.allUsers;

    const designersResult = useMemo(
        () => parseDesignerOptions(Array.isArray(dataAllUsers) ? dataAllUsers : []),
        [dataAllUsers]
    );

    const designerIdValues = useMemo(
        () => mapDesignerIdsToValues(getStrings(designerIds), designersResult.idToDataMap),
        [designerIds, designersResult.idToDataMap]
    );

    if (loading) {
        return <Skeleton $w="100%" $h="38" />;
    }

    const options = designersResult.array.map(({ data: designer, value }) => {
        return (
            <Select.Option key={designer?.id} value={value}>
                <Box
                    as={isWorker || isOpen ? 'div' : Link}
                    to={{
                        pathname: MEMBER_INFO.replace(':id', designer?.id ?? ''),
                        state: { previousPage: location.pathname },
                    }}
                    $maxW="221"
                    $d="inline-flex"
                >
                    <Box $d="flex" $alignItems="center" $colorScheme={isWorker ? 'secondary' : 'cta'}>
                        <Box $isTruncate $maxW="185">
                            {designer?.firstname} {designer?.lastname[0]}
                        </Box>
                    </Box>
                </Box>
            </Select.Option>
        );
    });

    const handleChange = async vals => {
        const ids = mapValuesToDesignerIds(getStrings(vals), designersResult.valueToIdMap);

        try {
            setIsHorizontalOverflow(true);
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

    const handleChangeOverflow = bool => {
        setIsOpen(bool);
        setIsHorizontalOverflow(!isHorizontalOverflow);
    };

    return (
        <Box $w="335" $h="40">
            <Form
                form={form}
                name="adminDesignersFieldForm"
                initialValues={{
                    assignedDesigners: designerIdValues,
                }}
            >
                <Form.Item name="assignedDesigners" label="" colon={false} required={false} style={{ marginBottom: 0 }}>
                    <Select
                        mode="multiple"
                        placeholder="Select Designer(s)"
                        dropdownStyle={{ width: 335 }}
                        dropdownMatchSelectWidth={false}
                        showArrow
                        onChange={handleChange}
                        disabled={requestStatus === 'DRAFT' || isSaving || isWorker}
                        loading={isSaving}
                        onDropdownVisibleChange={handleChangeOverflow}
                    >
                        {options}
                    </Select>
                </Form.Item>
            </Form>
        </Box>
    );
});

export default DesignersField;
