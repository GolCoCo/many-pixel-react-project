// import styled, { css } from 'styled-components';
// import * as theme from '../Theme';
// import { baseButtonCss, buttonPrimaryCss } from '../Button';
// import bold from '../../assets/icons/bold.svg';
// import boldHover from '../../assets/icons/bold_hover.svg';
// import boldGray from '../../assets/icons/bold_gray.svg';
// import italic from '../../assets/icons/italic.svg';
// import italicHover from '../../assets/icons/italic_hover.svg';
// import italicGray from '../../assets/icons/italic_gray.svg';
// import bulletList from '../../assets/icons/bullet_list.svg';
// import bulletListHover from '../../assets/icons/bullet_list_hover.svg';
// import bulletListGray from '../../assets/icons/bullet_list_gray.svg';
// import numbersList from '../../assets/icons/numbers_list.svg';
// import numbersListHover from '../../assets/icons/numbers_list_hover.svg';
// import numbersListGray from '../../assets/icons/numbers_list_gray.svg';
// import connect from '../../assets/icons/connect.svg';
// import connectHover from '../../assets/icons/c÷onnect_hover.svg';
// import connectGray from '../../assets/icons/connect_gray.svg';
// import smile from '../../assets/icons/smile.svg';
// import smileHover from '../../assets/icons/smile_hover.svg';
// import smileGray from '../../assets/icons/smile_gray.svg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import dropChat from '../../assets/icons/dropchat.svg';
// import uncheckedBox from '../../assets/icons/unchecked-box.svg';
// import checkedBox from '../../assets/icons/checked-box.svg';
// import { displayUtils, mediaQueryProps, mediaQueryVariantCss, sizeUtils, textUtils } from '../Utils';

// export const emojiPluginCss = css`
//     .rdw-emoji-wrapper {
//         display: flex;
//         align-items: center;
//         margin-bottom: 0;
//         position: relative;
//         flex-wrap: wrap;
//     }

//     .rdw-emoji-modal {
//         overflow: auto;
//         position: absolute;
//         top: 35px;
//         left: 5px;
//         display: flex;
//         flex-wrap: wrap;
//         width: 235px;
//         height: 180px;
//         border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
//         padding: 4px 10px 19px 10px;
//         border-radius: 0;
//         z-index: 100;
//         background: white;
//         box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
//     }
//     .rdw-emoji-icon {
//         margin: 2.5px;
//         height: 22px;
//         width: 22px;
//         cursor: pointer;
//         font-size: 22px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }

//     ${props =>
//         props.$isFlip &&
//         css`
//             .rdw-emoji-modal {
//                 bottom: 40px;
//                 top: inherit;
//                 left: -10px;
//             }
//         `}

//     @media (max-width: 600px) {
//         .rdw-emoji-modal {
//             box-shadow: none !important;
//             border: 1px solid #e4ebf1 !important;
//             bottom: 72px !important;
//             top: inherit !important;
//             left: -158px;
//             width: 294px !important;
//             height: 193px !important;
//             border-radius: 10px !important;
//             -ms-overflow-style: none !important; /* IE and Edge */
//             scrollbar-width: none !important; /* Firefox */
//             &::-webkit-scrollbar {
//                 display: none;
//             }
//         }
//         .rdw-link-modal {
//             left: -154px;
//         }
//     }
// `;

// export const linkPluginCss = css`
//     .rdw-link-dropdown {
//         width: 50px;
//     }

//     .rdw-link-dropdownOption {
//         height: 40px;
//         display: flex;
//         justify-content: center;
//     }

//     .rdw-link-dropdownPlaceholder {
//         margin-left: 8px;
//     }

//     .rdw-link-modal {
//         position: absolute;
//         top: 35px;
//         left: 5px;
//         display: flex;
//         flex-direction: row;
//         flex-wrap: wrap;
//         align-items: center;
//         width: calc(100vw - 30px);
//         max-width: 358px;
//         height: 214px;
//         border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
//         padding: 16px;
//         border-radius: 0;
//         z-index: 100;
//         background: white;
//         box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

//         ${props =>
//         props.$isFlip &&
//         css`
//                 bottom: 40px;
//                 top: inherit;
//             `}

//         ${mediaQueryVariantCss('mobile')`
//             left: 50%;
//             transform: translateX(-25%);
//         `}
//     }

//     .rdw-link-modal-label {
//         font-size: 12px !important;
//         font-weight: 300 !important;
//         font-family: 'Geomanist' !important;
//         line-height: 34px !important;
//         color: ${theme.COLOR_TEXT_SECONDARY} !important;
//         width: 72px;
//         height: 40px;
//     }

//     .rdw-link-modal-input {
//         ${theme.TYPO_P4}
//         color: ${theme.COLOR_TEXT_PRIMARY};
//         border-radius: 0;
//         border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
//         height: 40px;
//         line-height: 40px;
//         margin-top: 0;
//         margin-bottom: 10px;
//         padding: 10px 16px;
//         width: calc(100% - 72px);
//     }

//     .rdw-link-modal-input:focus {
//         outline: none;
//     }

//     .rdw-link-modal-buttonsection {
//         margin: 0 auto;
//     }

//     .rdw-link-modal-target-option {
//         font-size: 14px !important;
//         font-weight: 300 !important;
//         font-family: 'Geomanist' !important;
//         line-height: 20px !important;
//         margin-top: 6px;
//         margin-bottom: 16px;
//         display: flex !important;
//         align-items: center;
//     }

//     .rdw-link-modal-target-option > span {
//         padding-left: 28px;
//         height: 21px;
//         display: inline-block;
//         line-height: 21px;
//         background-repeat: no-repeat;
//         background-position: 0 0, 0 19px;
//         vertical-align: middle;
//         cursor: pointer;
//         background-image: url(${uncheckedBox}), url(${checkedBox});
//         margin-left: 0;
//     }

//     .rdw-link-modal-target-option > input[type='checkbox'] {
//         position: absolute;
//         overflow: hidden;
//         clip: rect(0 0 0 0);
//         height: 1px;
//         width: 1px;
//         margin: -1px;
//         padding: 0;
//         border: 0;

//         &:checked + span {
//             background-position: 0 19px, 0 0;
//         }
//     }

//     .rdw-link-modal-buttonsection {
//         display: flex;
//         flex-direction: row;
//         justify-content: center;
//         align-items: center;
//         width: 100%;

//         .rdw-link-modal-btn {
//             width: 100%;
//             height: 40px;
//             margin: 0;
//             border: 0;

//             ${baseButtonCss}
//             ${buttonPrimaryCss}

//             &:first-child {
//                 margin-right: 0;
//             }

//             &:last-child {
//                 display: none;
//             }
//         }
//     }
// `;

// export const toolbarButtonCss = ({ title, icon, iconHover }, width = '20px', height = '20px') => css`
//     .rdw-option-wrapper[title='${title}'] {
//         &:after {
//             content: '';
//             width: ${width};
//             height: ${height};
//             background: url(${icon}) no-repeat;
//         }
//         &.rdw-option-active:after,
//         &:hover:after {
//             background: url(${iconHover}) no-repeat;
//         }
//     }
// `;

// export const wrapperCss = css`
//     border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
// `;

// export const notCustomerWrapperCss = css`
//     border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
//     border-top: 0;
// `;

// export const toolbarCss = css`
//     border: 0;
//     border-bottom: 1px solid ${theme.COLOR_OUTLINE_GRAY};
//     border-radius: 0;
//     margin-bottom: 0;
//     padding-top: 13px;
//     padding-bottom: 13px;
//     ${mediaQueryProps('padding-left', ['4px', '8px'])}
//     ${mediaQueryProps('padding-right', ['4px', '8px'])}

//     color: ${props => (props.toolbarColor === 'gray' ? theme.COLOR_TEXT_TERTIARY : theme.COLOR_TEXT_PRIMARY)};
//     /* background-color: ${props => (props.toolbarColor === 'gray' ? 'white' : 'white')}; */
//     background-color: ${props => (props.isNotesActive ? theme.COLOR_BADGE_YELLOW : 'white')};
//     transition: all 0.2s;

//     ${props =>
//         props.toolbarHeight &&
//         css`
//             padding-top: 0;
//             padding-bottom: 0;
//             ${props => mediaQueryProps('height', props.toolbarHeight)}
//         `}

//     .rdw-option-wrapper {
//         border: 0;
//         box-shadow: none;
//         border-radius: 0;
//         padding: 0 8px;
//         margin: 0;
//         /* background-color: ${props => (props.toolbarColor === 'gray' ? theme.COLOR_BACKGROUND_GRAY : 'white')}; */
//         background-color: ${props => (props.isNotesActive ? theme.COLOR_BADGE_YELLOW : 'white')};
//         transition: all 0.2s;

//         img {
//             display: none;
//         }
//     }

//     .rdw-option-active {
//         color: ${theme.COLOR_CTA};
//     }

//     ${props =>
//         toolbarButtonCss(
//             { title: 'Bold', icon: props.toolbarColor === 'gray' ? boldGray : bold, iconHover: boldHover },
//             '14px',
//             '18px'
//         )}
//     ${props =>
//         toolbarButtonCss({
//             title: 'Italic',
//             icon: props.toolbarColor === 'gray' ? italicGray : italic,
//             iconHover: italicHover,
//         })}
//     ${props =>
//         toolbarButtonCss({
//             title: 'Link',
//             icon: props.toolbarColor === 'gray' ? connectGray : connect,
//             iconHover: connectHover,
//         })}
//     ${props =>
//         toolbarButtonCss({
//             title: 'Unordered',
//             icon: props.toolbarColor === 'gray' ? bulletListGray : bulletList,
//             iconHover: bulletListHover,
//         })}
//     ${props =>
//         toolbarButtonCss({
//             title: 'Ordered',
//             icon: props.toolbarColor === 'gray' ? numbersListGray : numbersList,
//             iconHover: numbersListHover,
//         })}

//     .rdw-emoji-wrapper[title='Emoji'] > div {
//         &:after {
//             content: '';
//             width: 20px;
//             height: 20px;
//             background: url(${props => (props.toolbarColor === 'gray' ? smileGray : smile)}) no-repeat;
//         }
//         &.rdw-option-active:after,
//         &:hover:after {
//             background: url(${smileHover}) no-repeat;
//         }
//     }

//     .rdw-inline-wrapper, .rdw-link-wrapper, .rdw-list-wrapper {
//         margin-bottom: 0;
//     }
// `;

// export const mainCss = css`
//     ${theme.TYPO_P4}
//     background-color: ${props => (props.isNotesActive ? theme.COLOR_BADGE_YELLOW : 'white')};
//     color: ${theme.COLOR_TEXT_PRIMARY};
//     font-weight: 300;
    
//     .DraftEditor-root {
//       overflow-x: visible;
//       overflow-y: auto;
//       padding-top: 14px;
      
//       padding-bottom: 14px;
//       ${mediaQueryProps('padding-left', ['10px', '16px'])}
//       ${mediaQueryProps('padding-right', ['10px', '16px'])}
//       ${props => mediaQueryProps('min-height', props.contentMinHeight)}
//       ${props => mediaQueryProps('max-height', props.contentMaxHeight)}
//     }

//     .public-DraftEditorPlaceholder-inner {
//         color: ${theme.COLOR_TEXT_TERTIARY};
//     }

//     .public-DraftStyleDefault-block,
//     .public-DraftStyleDefault-ol,
//     .public-DraftStyleDefault-ul {
//         margin: 0;
//         line-height: 20px;
//     }

//     .rdw-link-decorator-icon {
//         display: none;
//     }

//     .rdw-suggestion-dropdown {
//         position: relative;
//         width: 300px;
//         padding: 4px 0;
//         overflow-x: hidden;
//         overflow-y: auto;
//         background: #ffffff;
//         max-height: 227px;
//         border-radius: 2px;
//         box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);

//         .rdw-suggestion-option {
//             font-family: 'Geomanist';
//             font-size: 14px;
//             font-weight: 400;
//             line-height: 22px;
//             font-style: normal;
//             color: #262626;
//             padding: 5px 12px;
//             background: #ffffff;
//             cursor: pointer;
//             border: none;

//             &:hover {
//                 background: #E6F7FF;
//                 font-weight: 600;
//             }
//         }
//     }

//     .rdw-mention-link {
//         background: transparent;
//         color: #009DFF;
//         font-weight: 500;
//         padding: 0;
//         border-radius: 0;
//     }
// `;

// export const ContainerEditor = styled.div`
//     .rdw-editor-wrapper {
//         ${props => (props.$isNotCustomer ? notCustomerWrapperCss : wrapperCss)}
//         display: flex;
//         flex-direction: ${props => (props.$isFlip ? 'column-reverse' : 'column')};
//     }
//     .rdw-editor-toolbar {
//         ${toolbarCss}
//         border-width: ${props => (props.$isFlip ? '0' : '1px')};
//     }
//     .rdw-editor-main {
//         ${mainCss}
//         cursor: text;
//         overflow: visible;
//     }

//     ${emojiPluginCss}
//     ${linkPluginCss}

//     .ant-upload-drag-hover.chatDropZone {
//         width: 100% !important;
//         bottom: 0 !important;
//         cursor: inherit !important;
//         z-index: 200;
//         background: #009dff url(${dropChat}) no-repeat 50% 50% !important;
//         opacity: 0.75;
//         & .ant-upload-drag-container {
//             vertical-align: bottom !important;
//         }
//         & .wrapperClass {
//             opacity: 0.25;
//         }
//     }

//     ${props =>
//         props.toolbarColor === 'gray' &&
//         props.isFocused &&
//         css`
//             .rdw-editor-toolbar {
//                 background-color: ${props =>
//                 props.isNotesActive ? theme.COLOR_BADGE_YELLOW : theme.COLOR_BACKGROUND_GRAY};

//                 .rdw-option-wrapper {
//                     background-color: ${props =>
//                 props.isNotesActive ? theme.COLOR_BADGE_YELLOW : theme.COLOR_BACKGROUND_GRAY};
//                 }
//             }
//         `}

//         ${props =>
//         !props.isVisiblePlaceholder &&
//         css`
//                 .public-DraftEditorPlaceholder-root .public-DraftEditorPlaceholder-inner {
//                     color: white;
//                 }
//             `}
// `;

// export const WysiwygRenderer = styled.div`
//     ${theme.TYPO_P4}
//     ${textUtils}
//     ${sizeUtils}
//     ${displayUtils}
//     .text-other-green {
//         color: ${theme.COLOR_OTHERS_GREEN};
//     }
//     p {
//         margin-bottom: 0;
//     }

//     p:empty {
//       /* make same height when its empty */
//       padding-bottom: 20px; 
//     }

//     a {
//         color: ${theme.COLOR_CTA};
//     }

//     ul {
//         margin-bottom: 0;
//         padding-left: 20px;
//     }
// `;

// export const QuillEditorContainer = styled.div`
//   position: relative;
//   cursor: text;
  
//   .ql-container {
//     min-height: ${props => props.contentMinHeight};
//     ${props => props.contentMaxHeight && `max-height: ${props.contentMaxHeight};`}
//   }

//   // ... rest of the existing styles ...
// `;
