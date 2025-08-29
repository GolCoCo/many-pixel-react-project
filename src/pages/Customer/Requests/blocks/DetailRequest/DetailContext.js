import { createContext, useContext } from 'react';

export const DetailContext = createContext({});

export const useDetailContext = () => {
    return useContext(DetailContext);
};
