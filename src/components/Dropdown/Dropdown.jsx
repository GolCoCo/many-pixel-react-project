import React from 'react';

import { Text } from '../Text';
import { DropdownMenuIcon } from './style';

export const DropdownMenuItemContent = ({ icon, children }) => {
    return (
        <>
            {icon && <DropdownMenuIcon>{icon}</DropdownMenuIcon>}
            {children && (
                <Text as="span" $textVariant="P4" $pl={icon && '16'} $w="100%">
                    {children}
                </Text>
            )}
        </>
    );
};
