import styled from 'styled-components';
import { Collapse as AntdCollapse } from 'antd';
import * as theme from '../Theme';

export const Collapse = styled(AntdCollapse)`
    border-radius: 0;
    border-color: transparent;
    border-width: 0;
    background-color: white;

    .ant-collapse-item {
        &.ant-collapse-item-active {
            .ant-collapse-header {
                border-radius: 10px 10px 0 0;
            }
            
            .ant-collapse-content  {
                border-radius: 0 0 10px 10px;
            }
        }
    }
`;

export const CollapsePanel = styled(AntdCollapse.Panel)`
    .ant-collapse & {
        border-radius: 0;
        margin-bottom: 16px;
        border-width: 0;
        border-bottom-width: 0;
    }

    .ant-collapse-header,
    .ant-collapse-content {
        border-radius: 10px;
        border-width: 0;
        overflow: hidden;
        background-color: ${theme.COLOR_BACKGROUND_GRAY};
    }

    .ant-collapse-content-box {
        padding: 0;
    }
`;
