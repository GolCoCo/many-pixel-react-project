import React, { forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { Row } from 'antd';
import { Select } from '@components/Select';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import Avatar from '@components/Avatar';
import { USER_ASSIGNED_DESIGNERS } from '@graphql/queries/assignment';

export const FieldDesigner = forwardRef(({ value, onChange, viewer, windowWidth }, ref) => {
    const { data, loading } = useQuery(USER_ASSIGNED_DESIGNERS, { variables: { id: viewer.id } });
    const designers = data?.User?.assignedDesigners || [];

    return (
        <React.Fragment>
            <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                {!loading && Array.isArray(designers) && designers.length > 0 && (
                    <Select placeholder="Select designer" value={value} onChange={onChange} ref={ref}>
                        {designers.map(assignment => (
                            <Select.Option key={assignment.designer.id} value={assignment.designer.id}>
                                <Box $d="flex" $alignItems="center" $px="10">
                                    <Avatar name={`${assignment.designer.firstname} ${assignment.designer.lastname}`} size={24} $fontSize={14} />
                                    <Text $textVariant="Badge" $pl="16" $pt="4" $maxW="180" $isTruncate>
                                        {`${assignment.designer.firstname} ${assignment.designer.lastname}`}
                                    </Text>
                                </Box>
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Row>
        </React.Fragment>
    );
});
