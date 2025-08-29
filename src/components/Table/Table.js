import { Table as AntdTable } from 'antd';
import styled from 'styled-components';
import { paginationCss } from '../Pagination';
import * as theme from '../Theme';

export const Table = styled(AntdTable)`
    .ant-table table {
        border-radius: 10px !important;
        overflow: hidden;
    }
    .ant-table-body {
        border: 1px solid ${props => (props.isAdminTable ? theme.COLOR_OTHERS_GRAY : theme.COLOR_OUTLINE_GRAY)};
    }
    .ant-pagination-item,
    .ant-pagination-jump-next,
    .ant-pagination-jump-prev {
        display: ${({ pagination }) => (pagination.showPageNumber === undefined || pagination.showPageNumber ? 'block' : 'none')};
    }

    .ant-table-footer {
        background-color: ${theme.COLOR_WHITE};
        border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        border-radius: 0;
    }

    .ant-table th {
        padding-left: ${props => (props.isAdminTable ? '16px' : '20px')};
        padding-right: ${props => (props.isAdminTable ? '16px' : '20px')};
        padding-top: ${props => (props.isAdminTable ? '16px' : '10px')};
        padding-bottom: ${props => (props.isAdminTable ? '16px' : '10px')};
        ${props => (props.isAdminTable ? theme.TYPO_H6 : theme.TYPO_BADGE)}
        color: ${props => (props.isAdminTable ? theme.COLOR_TEXT_GRAY : theme.COLOR_TEXT_PRIMARY)};
    }

    .ant-table-placeholder {
        border: 1px solid ${props => (props.isAdminTable ? theme.COLOR_OTHERS_GRAY : theme.COLOR_OUTLINE_GRAY)};
    }

    .ant-table-row td {
        height: ${props => (props.$height ? `${props.$height}px` : 'auto')};
        padding-left: ${props => (props.isAdminTable ? '16px' : '20px')};
        padding-right: ${props => (props.isAdminTable ? '16px' : '20px')};
        padding-top: ${props => (props.isAdminTable ? '16px' : '9px')};
        padding-bottom: ${props => (props.isAdminTable ? '16px' : '9px')};
        ${theme.TYPO_P4}
        color: ${theme.COLOR_TEXT_PRIMARY};
        overflow: hidden;
    }
    .custom-height td {
        height: 52px;
        margin: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 16px;
    }
    .ant-table-thead > tr > th {
        background: ${theme.COLOR_BACKGROUND_GRAY};
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
        border-bottom: 1px solid ${props => (props.isAdminTable ? theme.COLOR_OTHERS_GRAY : theme.COLOR_OUTLINE_GRAY)};
    }

    .ant-table-tbody {
        > tr:last-child {
            border-radius: 10px;
            > td:first-child {
                border-radius: ${props => (props.isAdminTable && !props.paginated ? '0' : '0 0 0 10px')};
            }

            > td:last-child {
                border-radius: ${props => (props.isAdminTable && !props.paginated ? '0' : ' 0 0 10px 0')};
            }

            > td {
                border-bottom: ${props => (props.isAdminTable && !props.paginated ? '0' : `1px solid ${theme.COLOR_OTHERS_GRAY}`)};
            }
        }
    }

    .ant-table.ant-table-bordered {
        > .ant-table-container {
            border-radius: ${props => (props.isAdminTable && !props.paginated ? '0' : '10px')};
            > .ant-table-content {
                > table > tbody > tr > td,
                > table > thead > tr > th {
                    &:not(:last-child) {
                        border-right: 0;
                    }
                }
                > table > thead {
                    > tr:first-child {
                        > th:last-child {
                            border-top-right-radius: ${props => (props.isAdminTable ? '0' : '5px')};
                        }

                        > th:first-child {
                            border-top-left-radius: ${props => (props.isAdminTable ? '0' : '5px')};
                        }
                    }
                }
            }
        }
    }

    ${props =>
        !props?.bordered &&
        `
      .ant-table-tbody {
            > tr:last-child {
                > td {
                    border-bottom: none;
                }
            }
        }
    `}

    .ant-pagination {
        ${paginationCss}

        .ant-pagination-options {
            margin-top: -1px;
        }
    }

    .ant-table-thead > tr:not(:last-child) > th[colspan] {
        border-bottom: 1px solid #f0f0f0;
    }

    ${props =>
        props.hideEmptyPagination &&
        `
      .ant-pagination-disabled {
        display: none;
      }
    `}
`;
