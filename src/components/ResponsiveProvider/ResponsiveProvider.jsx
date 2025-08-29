import React, { useEffect, useReducer, createContext, useCallback, useMemo } from 'react';

const ResponsiveContext = createContext();

const sizes = {
    xxl: 1600,
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
    xs: 375,
};

const IS_BROWSER = typeof window !== 'undefined';

const initialState = {
    windowWidth: 0,
    windowHeight: 0,
    responsive: 'xxl',
    showFilter: false,
    hasActiveFilters: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                windowWidth: action.windowWidth,
                windowHeight: action.windowHeight,
                responsive: action.responsive,
            };

        case 'SET_FILTER':
            return {
                ...state,
                showFilter: action.value,
            };

        case 'SET_ACTIVE_FILTERS':
            return {
                ...state,
                hasActiveFilters: action.value,
            };

        default:
            return state;
    }
};

export const ResponsiveProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSetFilter = useCallback(value => {
        dispatch({ type: 'SET_FILTER', value });
    }, []);

    const handleSetActiveFilters = useCallback(value => {
        dispatch({ type: 'SET_ACTIVE_FILTERS', value });
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            ...state,
            handleSetFilter,
            handleSetActiveFilters,
        }),
        [state, handleSetFilter, handleSetActiveFilters]
    );

    useEffect(() => {
        const onResize = () => {
            const winWidth = IS_BROWSER
                ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                : 0;
            const winHeight = IS_BROWSER
                ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                : 0;
            let newResponsive;

            if (winWidth >= sizes.xxl) {
                newResponsive = 'xxl';
            } else if (winWidth >= sizes.xl && winWidth < sizes.xxl) {
                newResponsive = 'xl';
            } else if (winWidth >= sizes.lg && winWidth < sizes.xl) {
                newResponsive = 'lg';
            } else if (winWidth >= sizes.md && winWidth < sizes.lg) {
                newResponsive = 'md';
            } else if (winWidth >= sizes.sm && winWidth < sizes.md) {
                newResponsive = 'sm';
            } else if (winWidth >= sizes.xs && winWidth < sizes.sm) {
                newResponsive = 'xs';
            }

            dispatch({ type: 'CHANGE', windowWidth: winWidth, windowHeight: winHeight, responsive: newResponsive });
        };
        onResize();

        let timeout = null;
        const debounceResize = () => {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(onResize, 100);
        };
        window.addEventListener('resize', debounceResize);
        return () => {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
            window.removeEventListener('resize', debounceResize);
        };
    }, []);

    return <ResponsiveContext.Provider value={contextValue}>{children}</ResponsiveContext.Provider>;
};

export const withResponsive = Component => props =>
    (
        <ResponsiveContext.Consumer>
            {contextProps => <Component {...props} {...contextProps} />}
        </ResponsiveContext.Consumer>
    );
