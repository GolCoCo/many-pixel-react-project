import React from 'react';
import styled from 'styled-components';
import { Drawer as AntdDrawer } from 'antd';
import * as theme from '../Theme';

const ExcludeAntdDrawerDOM = ({ paddingHeader, noHeaderBorder, ...props }) => <AntdDrawer {...props} />;

export const Drawer = styled(ExcludeAntdDrawerDOM)`
    .ant-drawer-header {
        padding: ${props => (props.paddingHeader ? props.paddingHeader : '19px 20px 19px 20px')};
        border-bottom: ${props => (props.noHeaderBorder ? 'none' : '1px solid #E4EBF1')};

        .ant-drawer-close {
            line-height: 100%;
            height: 100%;
            order: 3;
            margin-right: 0;
            padding-right: 14px;

            .anticon {
                color: ${theme.COLOR_TEXT_PRIMARY};
                font-size: 18px;
                vertical-align: middle;
                &:hover {
                    color: ${theme.COLOR_CTA};
                }
            }
        }
    }

    .ant-drawer-body {
        padding: 0;
    }
`;
