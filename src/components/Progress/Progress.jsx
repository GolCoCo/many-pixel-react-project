import { Progress as AntdProgress } from 'antd';
import styled from 'styled-components';

export const Progress = styled(AntdProgress)`
    .ant-progress-inner {
        background-color: transparent;
        border: 1px solid;
        border: none;
        border-bottom: 1px solid #d5d6dd;
        border-radius: 0;
        .ant-progress-bg {
            background: #0099f6;
            border-radius: 0;
        }
    }
`;
