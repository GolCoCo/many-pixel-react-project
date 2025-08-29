const { createContext } = require('react');

export const CanvasContext = createContext();

export const useCanvasContext = () => {
    return useContext(CanvasContext);
};
