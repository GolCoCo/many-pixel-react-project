import React, { useContext, useState } from 'react';

export const CustomerPopupContext = React.createContext({
    isExporting: false,
    isAdding: false,
    setExporting: () => {},
    setAdding: () => {},
});

export const useCustomerPopupContext = () => {
    return useContext(CustomerPopupContext);
};

export const CustomerPopupProvider = ({ children }) => {
    const [isExporting, setExporting] = useState(false);
    const [isAdding, setAdding] = useState(false);

    return (
        <CustomerPopupContext.Provider value={{ isExporting, isAdding, setExporting, setAdding }}>
            {children}
        </CustomerPopupContext.Provider>
    );
};
