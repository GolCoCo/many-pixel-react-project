import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { Select } from '@components/Select';
import { Form } from '@components/Form';
import { Popup } from '@components/Popup';
import { GET_ALL_TEAMS } from '@graphql/queries/team';
import { REMOVE_ACCOUNT_FROM_TEAM, COMPANY_JOIN_TEAM } from '@graphql/mutations/company';
import { DELETE_ASSIGNMENT } from '@graphql/mutations/assignment';
import message from '@components/Message';
import { Skeleton } from '@components/Skeleton';
import isEmpty from 'lodash/isEmpty';

const TeamForm = ({ isWorker, refetch, company }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isShowUpdateConfirm, setIsShowUpdateConfirm] = useState(false);
    const { data, loading } = useQuery(GET_ALL_TEAMS, {
        fetchPolicy: 'network-only',
    });
    const [form] = Form.useForm();
    const { validateFields } = form;
    const teams = useMemo(() => data?.allTeams || [], [data]);
    const [leaveTeam] = useMutation(REMOVE_ACCOUNT_FROM_TEAM);
    const [joinTeam] = useMutation(COMPANY_JOIN_TEAM);
    const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);
    const selectedTeam = Form.useWatch('team', form);
    const handleSubmit = useCallback(async () => {
        validateFields().then(async values => {
            if (!isLoading) {
                try {
                    setIsLoading(true);
                    message.loading('Updating team...', 2000);
                    if (company?.teams[0]?.id) {
                        await leaveTeam({
                            variables: {
                                teamId: company?.teams[0]?.id,
                                id: company?.id,
                            },
                        });
                    }
                    await joinTeam({
                        variables: {
                            teamId: values.team,
                            id: company?.id,
                        },
                    });
                    if (company?.assignedDesigners?.length > 0) {
                        await Promise.all(
                            company?.assignedDesigners?.map(ad =>
                                deleteAssignment({
                                    variables: {
                                        id: ad.id,
                                    },
                                })
                            )
                        );
                    }
                    await refetch();
                    message.destroy();
                    message.success('Team has been updated.');
                    setIsLoading(false);
                } catch (error) {
                    message.destroy();
                    setIsLoading(false);
                    console.log(error);
                    return false;
                }
            }
        });
    }, [leaveTeam, joinTeam, company, refetch, validateFields, deleteAssignment, isLoading]);

    const selectTeamOptions = options =>
        options.map((team, index) => (
            <Select.Option key={index} value={team.id} label={team.name}>
                {team.name}
            </Select.Option>
        ));

    if (loading) {
        return (
            <Box>
                <Skeleton $w="38" $h="20" $mb="10" />
                <Skeleton $w="100%" $h="40" $mb="20" />
                <Skeleton $w="98" $h="40" />
            </Box>
        );
    }

    const initialTeam = company?.teams[0]?.id;

    const handleCancel = () => {
        setIsShowUpdateConfirm(false);
    };

    const handleShowConfirm = () => {
        if (!isEmpty(selectedTeam)) {
            handleSubmit();
        } else {
            setIsShowUpdateConfirm(true);
        }
    };

    const handleUpdateTeam = async () => {
        setIsShowUpdateConfirm(false);
        await handleSubmit();
    };

    return (
        <Box>
            <Form
                onFinish={handleShowConfirm}
                name="teamForm"
                form={form}
                initialValues={{
                    team: initialTeam,
                }}
            >
                <Box $mb="20">
                    <Form.Item name="team" label="Team" colon={false} style={{ marginBottom: 0 }}>
                        <Select placeholder="Select team" disabled={isWorker} optionLabelProp="label">
                            {selectTeamOptions(teams)}
                        </Select>
                    </Form.Item>
                </Box>
                {!isWorker && (
                    <Box>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button $h="40" type="primary" htmlType="submit" disabled={isEmpty(selectedTeam)} loading={isLoading}>
                                Update
                            </Button>
                        </Form.Item>
                    </Box>
                )}
            </Form>
            <Popup
                width={400}
                open={isShowUpdateConfirm}
                title="Are you sure you want to change the team?"
                $variant="delete"
                centered
                footer={null}
                onCancel={handleCancel}
                title$colorScheme="primary"
                closable={false}
            >
                <Text $textVariant="P4" $mb="30">
                    Assigned designers related to the team will be removed.
                </Text>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button $h="34" type="default" $mr="14" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button $h="34" type="primary" onClick={handleUpdateTeam}>
                        Update
                    </Button>
                </Box>
            </Popup>
        </Box>
    );
};

export default TeamForm;
