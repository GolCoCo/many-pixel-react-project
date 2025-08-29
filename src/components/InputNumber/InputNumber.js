import { InputNumber as AntdInputNumber } from 'antd';
import styled from 'styled-components';
import { sizeUtils } from '@components/Utils';
import * as theme from '../Theme';

export const InputNumber = styled(AntdInputNumber)`
    height: 40px;
    border-radius: 0;
    border-color: ${theme.COLOR_OUTLINE_GRAY};
    width: 100%;
    min-width: 50px;
    padding-top: 4px;
    padding-bottom: 4px;
    ${sizeUtils}
`;
