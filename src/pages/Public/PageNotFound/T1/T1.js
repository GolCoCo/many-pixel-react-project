import styled from 'styled-components';
import media from '@constants/media';

export default styled.h1`
    font-size: 2.375rem;
    line-height: 46px;
    margin-bottom: 0;
    color: #444;
    ${media.phone`
        margin-bottom: 8px;
    `}
`;
