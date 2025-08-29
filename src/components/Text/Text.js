import styled from 'styled-components';
import { colorUtils, sizeUtils, textUtils, displayUtils, mediaQueryUtils } from '../Utils';

export const Text = styled.div`
    cursor: ${props => props.$cursor};
    pointer-events: ${props => props.pointerEvents};
    ${displayUtils}
    ${textUtils}
    ${colorUtils}
    ${sizeUtils}
    ${mediaQueryUtils}
`;
