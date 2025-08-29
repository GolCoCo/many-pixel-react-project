import React, { memo, useEffect, useRef } from 'react';
import { Input } from '@components/Input';
import { Box } from '@components/Box';
import CloseIcon from '@components/Svg/Close';
import IconSearch from '@components/Svg/IconSearch';
import { NavSearchContainer } from '../style';
import { useNavSearchContext } from './NavSearchContext';

const NavSearch = memo(({ handleClose }) => {
    const { search, setSearch } = useNavSearchContext();

    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <NavSearchContainer>
            <Input ref={ref} prefix={<IconSearch />} value={search} onChange={ev => setSearch(ev.target.value)} />
            <Box $colorScheme="white" $px="16" $h="100%" $d="inline-flex" $alignItems="center" onClick={handleClose}>
                <CloseIcon />
            </Box>
        </NavSearchContainer>
    );
});

export default NavSearch;
