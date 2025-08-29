import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import * as theme from '@components/Theme';
import { textVariants } from '@components/Utils';

const ExcludeAntdAvatarDOM = ({ textVariant, ...props }) => <Avatar {...props} />;

export default styled(ExcludeAntdAvatarDOM)`
    background: ${p => (p.src ? 'transparent' : theme.COLOR_BACKGROUND_GRAY)};
    border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
    color: ${p => (p.src ? 'transparent' : theme.COLOR_TEXT_PRIMARY)};
    img {
        object-fit: cover;
    }

    .ant-avatar-string {
        font-family: ${theme.TYPO_FAMILY_MULISH};
        ${props => props.$textVariant && textVariants[props.$textVariant]}
    }
`;
