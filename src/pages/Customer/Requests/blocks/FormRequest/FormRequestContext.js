import { createContext, useContext } from 'react';

export const FormRequestContext = createContext();

export const useFormRequestContext = () => {
    return useContext(FormRequestContext);
};
