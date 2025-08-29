import React, { useState, useCallback, useMemo } from 'react';
import { memberColumns as cols } from '@pages/Admin/Company/MembersTab/constants';
import MembersTable from '@pages/Admin/Company/MembersTab/blocks/MembersTable';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { CustomIconDelete } from '@components/Svg/IconDelete';
import { COLOR_OTHERS_RED } from '@components/Theme/color';
import { PopupDelete } from '@components/Popup';
import { DESIGNER_LEAVE_TEAM } from '@graphql/mutations/user';
import message from '@components/Message';
import { useMutation } from '@apollo/client';
import { USER_TYPE_WORKER } from '@constants/account';

const Designers = ({ member, filters, refetch, viewer, ...props }) => {
    const [userToDelete, setUserToDelete] = useState({});
    const [showDelete, setShowDelete] = useState(false);
    const [designerLeaveTeam] = useMutation(DESIGNER_LEAVE_TEAM);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleShowDeletePopup = user => {
        setUserToDelete(user);
        setShowDelete(true);
    };

    const handleDelete = useCallback(async () => {
        try {
            setIsDeleting(true);
            await designerLeaveTeam({
                variables: {
                    teamId: member?.teamLeadersTeams[0]?.id,
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
    }, [refetch, userToDelete, member, designerLeaveTeam]);

    const dataSource = useMemo(() => member?.teamLeadersTeams[0]?.designers, [member]);
    const count = useMemo(() => member?.teamLeadersTeams[0]?._designersCount, [member]);
    const isWorker = viewer?.role === USER_TYPE_WORKER;

    const columns = [
        cols.name(),
        cols.email(),
        cols.lastLogin(),
        cols.role(),
        cols.specialities(),
        cols.status(),
        !isWorker &&
            cols.actions([
                {
                    handleClick: record => {
                        handleShowDeletePopup(record);
                    },
                    icon: <CustomIconDelete style={{ color: COLOR_OTHERS_RED }} />,
                    label: 'Delete',
                },
            ]),
    ].filter(item => item);

    return (
        <Box $mt="30">
            <Text $textVariant="H5" $mb="10">
                Assigned Designers
            </Text>
            <Text $textVariant="Badge" $colorScheme="primary" $mb="10">
                {count ?? 0} member{count > 1 && 's'}
            </Text>
            <MembersTable dataSource={dataSource} columns={columns} totalCount={count} {...props} />
            <PopupDelete
                title={`Are you sure you want to remove this member from ${member?.teamLeadersTeams[0]?.name} Team?`}
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
        </Box>
    );
};

export default Designers;
