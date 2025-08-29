import { Box } from '@components/Box';
import { Radio } from '@components/Radio';
import IconLeftArrow from '@components/Svg/IconLeftArrow';
import { Text } from '@components/Text';
import { Spin } from 'antd';
import React, { forwardRef } from 'react';
import Icon, { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <Icon component={LoadingOutlined} spin />;

const ButtonMove = ({ children, isUp, onClick, loading, showRadio, selected, mb = '14' }) => {
    const transform = loading ? undefined : isUp ? `rotate(90deg)` : 'rotate(-90deg)';

    return (
        <Box
            as="button"
            type="button"
            $w="100%"
            $h={['34', '60']}
            $d="flex"
            $alignItems="center"
            onClick={onClick}
            data-active={selected ? 'true' : undefined}
            $bg="white"
            $colorScheme="primary"
            $mb={mb}
            $appearance="none"
            $outline="none"
            $borderW="1"
            $borderStyle="solid"
            $borderColor="outline-gray"
            $px="16"
            $cursor="pointer"
            $trans="0.2s all"
            disabled={loading}
            _active={{
                $bg: 'bg-light-blue',
                $colorScheme: 'cta',
                $borderColor: 'cta',
            }}
            _disabled={{
                $opacity: 0.7,
                $cursor: 'not-allowed',
            }}
            $radii="10"
        >
            <Box $transform={transform} $h="20" $w="20" $d="inline-flex" $justifyContent="center" $alignItems="center">
                {loading ? <Spin indicator={loadingIcon} /> : <IconLeftArrow />}
            </Box>
            <Text $textVariant="Badge" $pl="10">
                {children}
            </Text>
            {showRadio && (
                <Box $ml="auto">
                    <Radio checked={selected} />
                </Box>
            )}
        </Box>
    );
};

export const FieldMove = forwardRef(({ value, onChange, showRadio, lastMb, loading }, ref) => {
    const handleClickTop = () => {
        if (onChange) {
            onChange('top');
        }
    };

    const handleClickBottom = () => {
        if (onChange) {
            onChange('bottom');
        }
    };

    return (
        <Box ref={ref}>
            <ButtonMove
                loading={loading && value === 'top'}
                onClick={handleClickTop}
                isUp
                selected={value === 'top'}
                showRadio={showRadio}
            >
                Move it to the top of my Queue
            </ButtonMove>
            <ButtonMove
                loading={loading && value === 'bottom'}
                onClick={handleClickBottom}
                selected={value === 'bottom'}
                showRadio={showRadio}
                $mb={lastMb}
            >
                Move it to the bottom of my Queue
            </ButtonMove>
        </Box>
    );
});
