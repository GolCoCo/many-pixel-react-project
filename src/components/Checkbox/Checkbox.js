import styled from 'styled-components';
import { Checkbox as AntdCheckbox } from 'antd';
import * as theme from '../Theme';

const bgVariants = {
    primary: {
        background: 'white',
    },
    white: {
        background: `${theme.COLOR_CTA}`,
    },
};

const checkColorVariants = {
    primary: {
        borderColor: `${theme.COLOR_CTA}`,
    },
    white: {
        borderColor: 'white',
    },
};

export const Checkbox = styled(AntdCheckbox)`
    &.ant-checkbox {
        &:hover::after {
            visibility: hidden;
        }
    }

    &.ant-checkbox-wrapper:hover .ant-checkbox::after {
        visibility: hidden;
    }

    .ant-checkbox-inner {
        height: 20px;
        width: 20px;
        border-radius: 5px;

        &::after {
            left: 5px;
            top: 8px;
        }
    }

    .ant-checkbox-checked {
        &::after {
            border-radius: 6px;
        }

        .ant-checkbox-inner {
            ${props => (props.$checkColorScheme ? bgVariants[props.$checkColorScheme] : bgVariants['primary'])}

            &:after {
                ${props => (props.$checkColorScheme ? checkColorVariants[props.$checkColorScheme] : checkColorVariants['primary'])}
            }
        }
    }
`;
