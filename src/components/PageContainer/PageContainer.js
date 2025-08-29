import { displayUtils, sizeUtils } from '@components/Utils';
import styled from 'styled-components';

/**
 * PageContainer used to wrap Page layout to specific width with padding
 */
export const PageContainer = styled.div`
    position: relative;
    ${displayUtils}
    padding-top: 20px;
    padding-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    ${sizeUtils}
    padding-left: initial;
    padding-right: initial;

    @media screen and (max-width: 1200px) {
        padding-left: 16px;
        padding-right: 16px;
    }
`;
