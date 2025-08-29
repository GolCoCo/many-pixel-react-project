import styled from 'styled-components';
import * as theme from '@components/Theme';
import { mediaQueryUtils } from '@components/Utils';

export const NavbarLink = styled.div`
    ${mediaQueryUtils}
    ${theme.TYPO_H6}
    color: ${theme.COLOR_WHITE};
    display: inline-flex;
    height: 100%;
    align-items: center;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        bottom: 0px;
        height: 0px;
        width: 100%;
        transition: all 0.2s;
        background-color: transparent;
    }

    &:hover {
        &:after {
            height: 3px;
            background-color: ${theme.COLOR_CTA};
        }
    }

    &.active {
        color: ${theme.COLOR_CTA};

        &:after {
            height: 3px;
            background-color: ${theme.COLOR_CTA};
        }
    }
`;

export const NavSidebar = styled.div`
    position: fixed;
    top: 0;
    left: ${props => (props.$isOpen ? '0' : '-244px')};
    width: 244px;
    height: 100vh;
    background-color: ${theme.COLOR_TEXT_PRIMARY};
    transition: all 0.2s;
    z-index: 100;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    ${NavbarLink} {
        padding: 14px 16px;
        border-bottom: 1px solid #162340;

        &:after {
            bottom: 50%;
            left: 0;
            height: calc(100% - 32px);
            width: 0;
            transform: translateY(50%);
        }

        &:hover {
            &:after {
                width: 3px;
                height: calc(100% - 32px);
            }
        }

        &.active {
            &:after {
                width: 3px;
                height: calc(100% - 32px);
            }
        }
    }
`;

export const NavSearchContainer = styled.div`
    position: fixed;
    left: 50px;
    top: 10px;
    background-color: ${theme.COLOR_TEXT_PRIMARY};
    height: 41px;
    width: calc(100% - 50px);
    z-index: 100;
    display: flex;
    align-items: center;
`;
