import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Select } from '@components/Select';
import { Form } from '@components/Form';
import { DESIGN_TYPE_WORKERS } from '@graphql/queries/designType';
import { Skeleton } from '@components/Skeleton';
import message from '@components/Message';
import { UPDATE_ASSIGNMENTS } from '@graphql/mutations/assignment';

const DesignersForm = ({ isWorker, company, refetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingFields, setIsResettingFields] = useState(false);
    const [form] = Form.useForm();
    const { validateFields } = form;
    const { data, loading } = useQuery(DESIGN_TYPE_WORKERS, {
        fetchPolicy: 'network-only',
    });
    const [updateAssignments] = useMutation(UPDATE_ASSIGNMENTS);
    const companyTeamId = company?.teams[0]?.id;
 
    const designTypes = useMemo(() => data?.allDesignTypes || [], [data]);
    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                try {
                    setIsLoading(true);
                    message.loading('Updating assignments...', 2000);
                    const valuesArray = Object.entries(values).map(([typeId, designerIds]) => {
                        return {
                            typeId,
                            designerIds: designerIds?.map(value => value.split(' ', 1)[0]),
                            companyId: company?.id,
                        };
                    });
                    await Promise.all(
                        valuesArray
                            .filter(v => v?.designerIds)
                            .map(v =>
                                updateAssignments({
                                    variables: {
                                        ...v,
                                    },
                                })
                            )
                    );
                    await refetch();
                    message.destroy();
                    message.success('Assignments have been updated.');
                    setIsLoading(false);
                } catch (error) {
                    console.log(error);
                    message.destroy();
                }
            }
        });
    }, [company.id, refetch, updateAssignments, validateFields, isLoading]);

    const assignedDesigners = useMemo(() => company?.assignedDesigners, [company]);
    const filterBySpecialities = useCallback(
        type => {
            const assignments = assignedDesigners?.filter(ad => ad?.type?.id === type);
            const designers = assignments?.map(ad => {
                const { designer } = ad;
                return `${designer.id} ${designer.firstname} ${designer.lastname}`;
            });

            return designers.length ? designers : undefined;
        },
        [assignedDesigners]
    );

    useEffect(() => {
        setIsResettingFields(true);
        setTimeout(() => {
            setIsResettingFields(false);
        }, 1000);

    }, [companyTeamId]);

    
    useEffect(() => {
        const newValues = {};

        designTypes.forEach(designType => {
            newValues[designType.id] = filterBySpecialities(designType.id);
        });

        form.setFieldsValue(newValues);
    }, [company, designTypes, filterBySpecialities]);

    if (loading || isResettingFields) {
        return (
            <Box $mt="30">
                <Skeleton $w="148" $h="28" $mb="19" />
                <Box $mb="20">
                    <Skeleton $w="82" $h="20" $mb="10" />
                    <Skeleton $w="100%" $h="40" />
                </Box>
                <Box $mb="20">
                    <Skeleton $w="82" $h="20" $mb="10" />
                    <Skeleton $w="100%" $h="40" />
                </Box>
                <Box $mb="20">
                    <Skeleton $w="82" $h="20" $mb="10" />
                    <Skeleton $w="100%" $h="40" />
                </Box>
                <Skeleton $w="98" $h="40" />
            </Box>
        );
    }

    return (
        <Box $mt="30">
            <Text $textVariant="PrimaryButton" $colorScheme="primary" $mb="20">
                Assigned Designer
            </Text>
            <Box>
                <Form onFinish={handleSubmit} form={form} name="designersForm">
                    {designTypes.map(designType => (
                        <Box $mb="20" key={designType.id}>
                            <Form.Item
                                initialValue={filterBySpecialities(designType.id)}
                                name={`${designType.id}`}
                                label={designType.name}
                                colon={false}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    placeholder="Select designers"
                                    mode="multiple"
                                    disabled={isWorker || !companyTeamId}
                                    optionLabelProp="label"
                                    isDisabled={isWorker}
                                >
                                    {(designType?.designers || [])
                                        .filter(designer => designer?.designerTeams.some(dt => dt.id === companyTeamId))
                                        .map(designer => (
                                            <Select.Option
                                                key={`${designer.firstname} ${designer.lastname}`}
                                                value={`${designer.id} ${designer.firstname} ${designer.lastname}`}
                                                label={`${designer.firstname} ${designer.lastname}`}
                                            >
                                                {designer.firstname} {designer.lastname}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Box>
                    ))}
                    {!isWorker && (
                        <Box>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button $h="40" type="primary" htmlType="submit" loading={isLoading} disabled={!companyTeamId}>
                                    Update
                                </Button>
                            </Form.Item>
                        </Box>
                    )}
                </Form>
            </Box>
        </Box>
    );
};

export default DesignersForm;
