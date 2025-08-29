import React, { createContext, useContext, useMemo, useState } from 'react';
import { useDebounceValue } from '@hooks/useDebounceValue';
import { forceInt } from '@utils/forceInt';

export const NavSearchContext = createContext({});

export const useNavSearchContext = () => {
    return useContext(NavSearchContext);
};

export const NavSearchProvider = ({ children }) => {
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounceValue(search, 200);

    const intSearch = useMemo(() => {
        return forceInt(debouncedSearch);
    }, [debouncedSearch]);

    return (
        <NavSearchContext.Provider value={{ search, debouncedSearch, intSearch, setSearch }}>
            {children}
        </NavSearchContext.Provider>
    );
};

export const withNavSearchProvider = Component => props => (
    <NavSearchProvider>
        <Component {...props} />
    </NavSearchProvider>
);
