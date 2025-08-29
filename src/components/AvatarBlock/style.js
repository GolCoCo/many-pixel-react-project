import styled from 'styled-components';
import { mediaQueryProps } from '../Utils';

export const AvatarBlockStyle = styled.div`
    > a {
        border-radius: 100%;
        border: 1px solid #d5d6dd;
        padding: 5px;
        background-color: #fff;
        line-height: 1px;
        display: inline-block;
        vertical-align: bottom;
        margin-left: -20px;
        position: relative;
    }

    .ant-avatar,
    .ant-skeleton-avatar {
        border: ${({ styles }) => `${styles.border || 'none'}`};
    }

    ${mediaQueryProps('margin-top', ['20px', '18px'])}
    ${mediaQueryProps('margin-bottom', ['16px', '13px'])}
`;
