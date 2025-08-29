import styled from 'styled-components';

export const FormItemFlex = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: ${({ $justifyContent }) => `${$justifyContent || 'flex-start'}`};
    margin: ${({ spacing = 15 }) => `0 -${spacing}px`};

    @media screen and (max-width: 799px) {
        margin: 0;
    }

    .ant-form-item {
        flex: ${({ $itemWidthPct }) => `0 1 ${$itemWidthPct}%`};
        margin: ${({ spacing = 15 }) => `0 ${spacing}px 30px`};

        @media screen and (max-width: 1100px) {
            flex: 0 1 45%;
        }

        @media screen and (max-width: 799px) {
            flex: 1 1 100%;
            margin: 0 0 30px;
        }
    }
`;
