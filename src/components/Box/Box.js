import styled from 'styled-components';
import { colorUtils, mediaQueryUtils, sizeUtils, textUtils, displayUtils, pseudoUtils } from '../Utils';

/**
 * Base component with styling
 * Useful for component that doesn't have presets inside figma design explicitly
 */

export const Box = styled.div`
    ${displayUtils}
    ${sizeUtils}
    ${colorUtils}
    ${textUtils}
    ${mediaQueryUtils}
    ${pseudoUtils}
    div.ant-progress-bg {
        background-color: #1890ff !important;
    }

    .hover-blue:hover {
        background-color: #e1f1fb;
    }
`;
