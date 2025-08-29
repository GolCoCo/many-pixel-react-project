import styled from 'styled-components';
import { Tabs as AntdTabs } from 'antd';
import { sizeUtils } from '@components/Utils';
import * as theme from '../Theme';

export const Tabs = styled(AntdTabs)`
    overflow: visible;
    ${sizeUtils}
    &.ant-tabs {
        width: 100%;
        max-width: 100vw;

        .ant-tabs-tab {
            & + .ant-tabs-tab {
                margin: 0;
            }
        }

        .ant-tabs-nav {
            margin: 0;

            .ant-tabs-tab {
                ${theme.TYPO_H6}
                margin-right: 27px;
                padding: 12px 0;
                font-size: 14px;

                ${props =>
                    props.$isNav &&
                    `
                    margin-right: 16px;
                ${
                    window.innerWidth < 375 &&
                    `
                    margin-right: 12px;
                    font-size:13px
                `
                }
                `}
            }

            .ant-tabs-ink-bar {
                height: 3px;
            }
        }
    }
`;
