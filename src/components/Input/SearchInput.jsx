import * as React from 'react';
import styled from 'styled-components';
import IconSearch from '@components/Svg/IconSearch';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Input } from './Input';
import { colorSchemes } from '../Utils/color';

const StyledDiv = styled.div`
    display: inline-flex;
    align-items: center;
    color: ${colorSchemes.cta};
    line-height: 1;
`;

const SearchInput = (
    /**
     * @type {{value?: string, placeholder?: string, onChange?: (event: any) => void, onChangeText?: (value: string) => void, onClear?: () => void}}
     */
    props,
    ref
) => {
    const { placeholder, onChange = () => {}, onChangeText = () => {}, onClear, ...otherProps } = props;

    const { value } = otherProps;

    return (
        <Input
            {...otherProps}
            ref={ref}
            prefix={
                <StyledDiv>
                    <IconSearch />
                </StyledDiv>
            }
            placeholder={placeholder}
            onChange={val => {
                onChange(val);
                onChangeText(val.target.value);
            }}
            suffix={
                value ? (
                    <Button
                        style={{
                            marginRight: -12,
                            borderWidth: 0,
                            backgroundColor: 'transparent',
                        }}
                        onClick={onClear}
                    >
                        <CloseCircleOutlined />
                    </Button>
                ) : undefined
            }
        />
    );
};

export default React.forwardRef(SearchInput);
