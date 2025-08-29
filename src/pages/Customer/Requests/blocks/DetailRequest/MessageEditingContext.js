import { createContext, useContext } from 'react';

export const MessageEditingContext = createContext({});

export const useMessageEditingContext = () => {
    return useContext(MessageEditingContext);
};
