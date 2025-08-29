import styled from 'styled-components';
import { Form as AntdForm } from 'antd';
import * as theme from '../Theme';

export const Form = styled(AntdForm)`
		.ant-row {
			.ant-form-item-control-input {
				min-height: 0;
			}
			&.ant-form-item-row {
				display: block;
			}

			.ant-form-item-label {
				label {
					height: auto;
				}
			}
		}

    .ant-form-item {
        margin-bottom: 24px;

        &:last-child {
             margin-bottom: 0;
        }

		label {
			${theme.TYPO_H6}
			color: ${theme.COLOR_TEXT_PRIMARY};
			
			&:after {
				content: ' ';
			}

			&:before {
				font-family: Mulish !important;
			}
		}
    }

	.ant-form-item-label {
		margin-bottom: 8px;
		line-height: 0;
		padding: 0;

		.ant-form-item-no-colon {
			padding-right: 12px;

			&:after {
				content: ' ';
				margin: 0;
				position: relative;
				top: 0;
			}
		}
	}

	.ant-form-item-required {
		&:before {
			position: absolute;
            right: 1px;
            color: #F34530;
            top: 0;
		}
	}

	.ant-form-explain {
		margin-top: 0;
		margin-bottom: 0;
		font-size: 12px;
		font-weight: 300;
		line-height: 18px;
		min-height: auto;
		height: 0;
	}

	.ant-form-item-control {
		line-height: unset;
	}

	&.ant-form-horizontal {
		.ant-form-item {
			margin-bottom: 24px;
		}
	}

    .ant-input-status-error {
        &.ant-select-auto-complete.ant-select .ant-input,
        &.ant-select-selection,
        &.ant-input {
            &,
            &:focus
            &:hover {
                border-color: ${theme.COLOR_OTHERS_RED}!important;
            }
        }
    }

		.ant-form-item-explain-error {
			color: ${theme.COLOR_OTHERS_RED};
			${theme.TYPO_P5};
			margin-top: 4px;
			font-weight: 300;
		}
`;
