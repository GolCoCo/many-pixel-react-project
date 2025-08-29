import styled from 'styled-components';
import { Input } from 'antd';
import * as theme from '@components/Theme';
import { mediaQueryProps, sizeUtils } from '@components/Utils';

export const CardBrandContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    height: 80px;
    background-color: ${theme.COLOR_WHITE};
    border-width: 1px;
    border-style: solid;
    border-color: ${theme.COLOR_OUTLINE_GRAY};
    border-radius: 10px;
    padding: 14px 20px;
    transition:
        border-color 0.2s,
        background-color 0.2s;

    &:hover {
        background-color: ${theme.COLOR_BACKGROUND_LIGHT_BLUE};
        border-color: ${theme.COLOR_CTA};
    }
`;

export const AddColorContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    cursor: pointer;
    height: 60px;

    background-color: ${props => (props.$hasDragFile ? 'rgba(0, 153, 246, 0.4)' : theme.COLOR_WHITE)};
    border-width: 1px;
    border-style: solid;
    border-color: ${props => (props.$hasDragFile ? theme.COLOR_CTA : theme.COLOR_OUTLINE_GRAY)};
    padding: 11px 10px 11px 16px;
    border-radius: 10px;

    &:hover {
        background-color: ${theme.COLOR_BACKGROUND_LIGHT_BLUE};
        border-color: ${theme.COLOR_CTA};
    }

    ${mediaQueryProps('margin-bottom', ['16px', '20px'])}
`;

export const InputHexBase = styled(Input)`
    &.ant-input-affix-wrapper .ant-input:not(:first-child) {
        border-radius: 0;
    }

    &.ant-input-affix-wrapper {
        border-radius: 10px;
        height: 40px;
    }
`;

export const InputBoxLike = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    width: 100%;
`;

export const InputBoxItem = styled.div`
    display: flex;
    height: 100%;
    border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
    justify-content: center;
    align-items: center;
    padding-left: 11px;
    padding-right: 11px;
    ${sizeUtils}
`;

export const PreviewColor = styled.div`
    width: 24px;
    height: 24px;
    background-color: ${props => props.$bg};
`;

export const MiniUpload = styled(AddColorContainer)`
    flex-direction: column;
    height: 164px;
    justify-content: center;
    border-style: ${props => (props.$uploaded || props.$hasDragFile ? 'solid' : 'dashed')};
    padding: 11px 16px;

    ${mediaQueryProps('width', ['100%', '224px'])}
`;
