import React, { useCallback, useState } from 'react';
import { Text } from '@components/Text';
import { useMutation } from '@apollo/client';
import { GET_TEAM_DESIGNERS, GET_TEAM_LEADERS } from '@graphql/queries/team';
import { PopupDelete } from '@components/Popup';
import { DESIGNER_LEAVE_TEAM, TEAM_LEADER_LEAVE_TEAM } from '@graphql/mutations/user';
import { useRouteMatch } from 'react-router-dom';
import { MANAGE_TEAM } from '@constants/routes';
import message from '@components/Message';
import WithLoggedUser from '@components/WithLoggedUser';
import MembersTableWithHeader from '../MembersTableWithHeader';
import AddUserToTeamPopup from '../blocks/AddUserToTeamPopup';
import TeamPopup from '../../../TeamsTab/blocks/TeamPopup';

const MembersList = ({ roles, filters, team, isAddVisible, onAddClose, isEditVisible, onEditClose }) => {
    const [userToDelete, setUserToDelete] = useState({});
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refetch, setRefetch] = useState(() => {});
    const [countRefetch, setCountRefetch] = useState(1);
    const [designerLeaveTeam] = useMutation(DESIGNER_LEAVE_TEAM);
    const [teamLeaderLeaveTeam] = useMutation(TEAM_LEADER_LEAVE_TEAM);
    const routeMatch = useRouteMatch(MANAGE_TEAM);

    const handleShowDeletePopup = user => {
        setUserToDelete(user);
        setShowDelete(true);
    };

    const Query = {
        teamLeaders: GET_TEAM_LEADERS,
        designers: GET_TEAM_DESIGNERS,
    };

    const Mutation = {
        manager: teamLeaderLeaveTeam,
        worker: designerLeaveTeam,
    };

    const handleDelete = useCallback(async () => {
        const mutate = Mutation[userToDelete.role];
        try {
            setIsDeleting(true);
            await mutate({
                variables: {
                    teamId: routeMatch.params.id,
                    id: userToDelete.id,
                },
            });
            if (typeof refetch === 'function') {
                await refetch();
            }
            message.success('Member has been removed from the team');
            setUserToDelete({});
            setShowDelete(false);
            setIsDeleting(false);
        } catch (err) {
            console.error(err);
        }
    }, [Mutation, refetch, userToDelete, routeMatch.params.id]);

    return (
        <>
            <AddUserToTeamPopup
                visible={isAddVisible}
                onCloseModal={onAddClose}
                refetchSource={() => {
                    setCountRefetch(old => old + 1);
                }}
                team={team}
            />
            <TeamPopup
                visible={isEditVisible}
                onCloseModal={onEditClose}
                refetch={refetch}
                initialData={{
                    id: team.id,
                    name: team.name,
                }}
            />
            {roles.map((role, index) => (
                <MembersTableWithHeader
                    roles={roles}
                    filters={filters}
                    role={role}
                    key={`${role}-${index}`}
                    Query={Query[role]}
                    handleShowDeletePopup={handleShowDeletePopup}
                    setRefetch={setRefetch}
                    countRefetch={countRefetch}
                />
            ))}
            <PopupDelete
                title={`Are you sure you want to remove this member from ${team?.name} Team?`}
                $variant="delete"
                open={showDelete}
                onOk={handleDelete}
                onCancel={() => setShowDelete(false)}
                confirmLoading={isDeleting}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </>
    );
};

export default WithLoggedUser(MembersList);
