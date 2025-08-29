import React, { useState, useRef, useCallback } from 'react';
import { Input } from '@components/Input';
import { Box } from '@components/Box';
import IconSearch from '@components/Svg/IconSearch';
import CloseIcon from '@components/Svg/Close';
import { Button } from '@components/Button';

export const DelayedSearchInput = ({ placeholder = 'Search', initialValue, onChange }) => {
    const [internalSearch, setInternalSearch] = useState(() => initialValue ?? '');

    const timeoutRef = useRef();

    const handleSearch = ev => {
        const searchValue = ev.target.value;
        setInternalSearch(searchValue);
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            onChange(searchValue);
        }, 1000);
    };

    const handleKeyPress = useCallback(
        e => {
            if (e.key === 'Escape') {
                setInternalSearch('');
                onChange('');
            }
        },
        [onChange]
    );

    return (
        <Input
            placeholder={placeholder}
            onKeyDown={handleKeyPress}
            value={internalSearch}
            prefix={
                <Box $d="inline-flex" $alignItems="center" $colorScheme="cta" $lineH="1">
                    <IconSearch />
                </Box>
            }
            onChange={handleSearch}
            suffix={
                internalSearch ? (
                    <Button
                        $colorScheme="cta"
                        style={{
                            marginRight: -12,
                            borderWidth: 0,
                            backgroundColor: 'transparent',
                        }}
                        onClick={() => {
                            setInternalSearch('');
                            onChange('');
                        }}
                    >
                        <CloseIcon />
                    </Button>
                ) : undefined
            }
        />
    );
};
