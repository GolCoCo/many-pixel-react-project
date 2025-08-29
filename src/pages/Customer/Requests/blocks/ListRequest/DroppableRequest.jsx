import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Box } from '@components/Box';

export const DroppableRequest = ({ children, name, ...rest }) => {
    return (
        <Droppable droppableId={name}>
            {(provided, snapshot) => (
                <Box {...provided.droppableProps} {...rest} ref={provided.innerRef}>
                    {children}
                    {provided.placeholder}
                </Box>
            )}
        </Droppable>
    );
};
