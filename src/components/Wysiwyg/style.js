import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import * as theme from '../Theme';

export const QuillEditorContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: ${({ $isFlip }) => ($isFlip ? 'column-reverse' : 'column')};

    button {
        color: ${theme.COLOR_TEXT_TERTIARY};
    }

    .toolbar-left {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
    }

    .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border-top: ${({ $isFlip, $showTabSwitcher }) => (!$isFlip || $showTabSwitcher ? 'none' : '1px solid #ccc')};
    }

    .ql-tooltip {
        display: none;
    }

    .ql-toolbar.ql-snow {
        border-top: ${({ $isFlip }) => (!$isFlip ? '1px solid #ccc' : 'none')};
    }

    .ql-toolbar {
        height: ${({ $toolbarHeight }) => $toolbarHeight};
        background-color: ${({ $toolbarColor, $isFocused }) => ($isFocused && $toolbarColor === 'gray' ? '#F8F8F8' : 'white')};
        align-items: center;
        display: flex;
        border-top-left-radius: ${({ $isFlip }) => ($isFlip ? '0' : '10px')};
        border-top-right-radius: ${({ $isFlip }) => ($isFlip ? '0' : '10px')};
        border-bottom-left-radius: ${({ $isFlip, $showTabSwitcher, isCustomer }) =>
        $isFlip && $showTabSwitcher ? '10px' : $isFlip && !isCustomer ? '10px' : '0'};
        border-bottom-right-radius: ${({ $isFlip, $showTabSwitcher, isCustomer }) =>
        $isFlip && $showTabSwitcher ? '10px' : $isFlip && !isCustomer ? '10px' : '0'};
        padding: 13px 4px;
        transition: background-color 0.2s ease;
        background-color: ${({ $activeTab }) => $activeTab === 'NOTES' && '#FEF7E1'};
        border-bottom: ${({ $isFlip, $showTabSwitcher }) => (!$isFlip && !$showTabSwitcher ? '0px solid #ccc' : '1px solid #ccc')};
        button {
            padding: 0px 8px;
            height: 100%;
            width: 20px;
            box-sizing: content-box;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0px;

            svg {
                width: 100%;
                height: 100%;
            }
        }

        .ql-formats {
            height: 24px;
            display: flex;
            align-items: center;
            margin-right: 0px;

            button {
                padding: 0px 8px;
                height: 100%;
                width: 20px;
                box-sizing: content-box;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 0px;

                &:first-child .toolbar-icon {
                    width: 17px;
                    height: 17px;
                }

                .toolbar-icon {
                    width: 20px;
                    height: 20px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        transition: opacity 0.2s ease;
                        object-fit: contain;
                    }

                    .icon-default {
                        opacity: ${({ $toolbarColor }) => ($toolbarColor === 'gray' ? 0 : 1)};
                    }

                    .icon-gray {
                        opacity: ${({ $toolbarColor }) => ($toolbarColor === 'gray' ? 1 : 0)};
                    }

                    .icon-blue {
                        opacity: 0;
                    }
                }

                &:hover .toolbar-icon {
                    .icon-default,
                    .icon-gray {
                        opacity: 0;
                    }
                    .icon-blue {
                        opacity: 1;
                    }
                }

                &.ql-active .toolbar-icon {
                    .icon-default,
                    .icon-gray {
                        opacity: 0;
                    }
                    .icon-blue {
                        opacity: 1;
                    }
                }
            }
        }

        .custom-toolbar {
            display: flex;
            align-items: center;
            margin-left: auto;
            height: 100%;
        }
    }

    .ql-snow.ql-toolbar button:hover {
        color: ${theme.COLOR_CTA};
    }

    .ql-container {
        display: ${({ $isReopen, isCustomer }) => ($isReopen || !isCustomer ? 'flex' : 'block')};
        flex-direction: ${({ $isFlip, $isReopen }) => ($isFlip && !$isReopen ? 'column-reverse' : 'column')};
        font-family: Geomanist, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        font-weight: 300;
        position: unset;
        min-height: ${({ $contentMinHeight }) => $contentMinHeight};
        max-height: ${({ $contentMaxHeight }) => $contentMaxHeight};
        border-bottom-left-radius: ${({ $isFlip }) => ($isFlip ? '0' : '10px')};
        border-bottom-right-radius: ${({ $isFlip }) => ($isFlip ? '0' : '10px')};
        border-top-left-radius: ${({ $isFlip, $showTabSwitcher }) => ($isFlip && !$showTabSwitcher ? '10px' : '0')};
        border-top-right-radius: ${({ $isFlip, $showTabSwitcher }) => ($isFlip && !$showTabSwitcher ? '10px' : '0')};
        cursor: text;
        overflow-y: auto;
        border-top: ${({ $isFlip, $showTabSwitcher }) => ($isFlip && $showTabSwitcher ? '0px solid #ccc' : '1px solid #ccc')};
        border-bottom: ${({ $isFlip }) => (!$isFlip ? '1px solid #ccc' : 'none')};
        background-color: ${({ $activeTab }) => ($activeTab === 'NOTES' ? '#FEF7E1' : 'white')};
    }
    .ql-container {
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #d5d6dd transparent;
    }

    .ql-container.ql-snow:focus-within + .ql-toolbar.ql-snow {
        background-color: #f8f8f8;
    }

    .ql-editor {
        padding: 12px 15px;
        font-size: 14px;
        line-height: 1.5;
        min-height: 44px;

        &.ql-blank::before {
            font-family: 'Geomanist';
            font-size: 14px;
            font-style: normal;
            color: ${theme.COLOR_TEXT_TERTIARY};
            font-weight: 300;
            padding-left: 2px;
        }
    }

    .emoji-menu {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        width: 240px;
        z-index: 1000;
        top: 0px;
        left: 50px;
    }

    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 0px;
    }

    .link-menu {
        background: #ffffff;
        padding: 16px;
        border: 1px solid #D5D6DD;
        box-shadow: 0px 2px 8px 0px #0000001A;
        display: flex;
        flex-direction: column;
        z-index: 1000;
        width: 358px;
        height: 214px;

        &-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        &-row2 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 6px;
            margin-bottom: 16px;
            position: relative;
        }

        &-label {
            font-family: 'Geomanist' !important;
            font-size: 12px !important;
            font-weight: 300 !important;
            color: ${theme.COLOR_TEXT_SECONDARY} !important;
        }

        &-label2 {
            font-family: 'Geomanist' !important;
            font-size: 14px !important;
            font-weight: 300 !important;
            color: ${theme.COLOR_TEXT_PRIMARY} !important;
        }

        &-input {
            height: 40px;
            width: 252px;
            border: 1px solid #D5D6DD;
            padding-left: 16px;
            outline: unset;
        }

        &-checkbox {
            width: 20px;
            height: 20px;
            border: 1px solid #D5D6DD;
            outline: unset !important;
            border-radius: 0;
            cursor: pointer;

            &-active {
                border-color: #007aff;
            }

            &-custom {
                position: absolute;
                left: 4px;
                top: 0px;
                display:none;
                user-select: none;
                pointer-events: none;
            }

            &-active {
                & + span {
                    display:block;
                }
            }
        }

        &-button {
            height: 40px;
            color: white;
            border: none;
            background: ${theme.COLOR_TEXT_TERTIARY};

            &-active {
                background: ${theme.COLOR_CTA};
                cursor: pointer;
            }
        }
    }

    .emoji-button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 0px;
        border-radius: 4px;
        transition: background-color 0.2s;
        width: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    .ql-mention-list-container {
        width: 300px;
        border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        border-radius: 10px;
        background: white;
        box-shadow: 0px 3px 6px -4px #0000001F;
        box-shadow: 0px 6px 16px 0px #00000014;
        box-shadow: 0px 9px 28px 8px #0000000D;
        padding-top: 4px;
        overflow-y: auto;
        z-index: 10;
        border-radius: inherit;
        transform: translateY(30px);
        max-height: 500px;
    }

    .ql-mention-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .ql-mention-list-item {
        cursor: pointer;
        height: 32px;
        cursor: pointer;
        transition: all 0.05s ease;
        font-family: 'Geomanist';
        font-size: 14px;
        font-weight: 300;
        line-height: 32px;
        font-style: normal;
        color: #262626;
        padding: 0px 12px;
        background: #ffffff;

        &.selected {
            text-decoration: none;
            font-weight: 400;
            background-color: #E6F7FF;
        }
    }

    .mention {
        height: 24px;
        width: auto;
        color: ${theme.COLOR_CTA};
        cursor: pointer;
    }

`;
