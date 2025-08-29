import styled from 'styled-components';
import { Slider as AntdSlider } from 'antd';
import * as theme from '../Theme';

export const Slider = styled(AntdSlider)`
    .ant-slider-rail {
        height: 10px;
        border-radius: 5px;
        background: ${theme.COLOR_BACKGROUND_GRAY};
    }
    .ant-slider-track {
        background: ${theme.COLOR_CTA};
        height: 10px;
        z-index: 1;
    }

    .ant-slider-step {
        .ant-slider-dot {
            width: 10px;
            height: 10px;
            top: 0;
            border: none;
            background-color: ${theme.COLOR_OUTLINE_GRAY};

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-left: -10px;
            }
        }
    }

    .ant-slider-handle {
        z-index: 2;
        margin-top: -12px;
        width: 34px;
        height: 34px;
        background-color: ${theme.COLOR_OTHERS_YELLOW};
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        border: none;
    }

    &:hover {
        .ant-slider-track {
            background: #007ac5;
            height: 10px;
        }

        .ant-slider-step {
            .ant-slider-dot {
                background-color: ${theme.COLOR_TEXT_TERTIARY};
            }
        }
    }
`;
