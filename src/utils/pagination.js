import { useEffect, useMemo, useState, useCallback } from 'react';
import * as qs from 'query-string';
import { useHistory } from 'react-router-dom';

export const DEFAULT_PAGE = 1;

export const DEFAULT_PAGE_SIZE = 10;

/**
 *
 * @returns {[page: number, size: number]}
 */
export function getDefaultPagination() {
    const parsed = qs.parse(window.location.search);
    return [parsed.page ? parseInt(parsed.page) : DEFAULT_PAGE, parsed.size ? parseInt(parsed.size) : DEFAULT_PAGE_SIZE];
}

/**
 * @param {number} page
 * @param {number} size
 * @returns {[skip: number, first: number]}
 */
export function getFirstAndSkip(page, size) {
    const first = size;
    const skip = (page - 1) * first;

    return [skip, first];
}

/**
 * @param {[page: number, size: number]} current
 */
export function dispatchDefaultPaginationCallback(current) {
    if (current[0] === DEFAULT_PAGE && current[1] === DEFAULT_PAGE_SIZE) {
        return current;
    }

    const parsed = qs.parse(window.location.search);
    return [parsed.page ? parseInt(parsed.page) : DEFAULT_PAGE, parsed.size ? parseInt(parsed.size) : DEFAULT_PAGE_SIZE];

}

/**
 * @param {number} page
 * @param {number} size
 * @param {(current: [page: number, size: number]) => [page: number, size: number]} setPagination
 */
export function createTablePaginationOptions(page, size, setPagination, changeParams) {
    return {
        defaultPageSize: DEFAULT_PAGE_SIZE,
        pageSize: size,
        current: page,
        onShowSizeChange: (_, currentSize) => {
            setPagination(current => (currentSize === current[1] ? current : [current[0], currentSize]));
            changeParams({ pageSize: currentSize, page: 1 })
        },
        onChange: currentPage => {

            setPagination(current => {
                if (currentPage === current[0]) {
                    return current;
                }

                return [currentPage, current[1]];
            });
            changeParams({ page: currentPage })
        },
    };
}

/**
 * @param {number} page
 * @param {number} size
 * @param {(current: {page: number, size: number}) => {page: number, size: number}} setPagination
 */
export function useTablePaginationOptions(page, size, setPagination, changeParams) {
    return useMemo(() => {
        const [skip, first] = getFirstAndSkip(page, size);

        return {
            skip,
            first,
            options: createTablePaginationOptions(page, size, setPagination, changeParams),
        };
    }, [page, setPagination, size, changeParams]);
}

/**
 * @param {{resetDependency?: string | null} | undefined} options
 */
export function useFullPagination(options) {
    const [[page, size], setPagination] = useState(getDefaultPagination);
    const { push } = useHistory();
    
    const changeParams = useCallback((newParams) => {
        const location = window.location;
        const parsed = qs.parse(window.location.search);
        const stringify = qs.stringify(Object.assign(parsed, newParams));
        push({
            pathname: location.pathname,
            search: stringify,
        })
    }, [push])

    const { skip, first, options: tablePagination } = useTablePaginationOptions(page, size, setPagination, changeParams);

    const theResetDependency = options?.resetDependency;

    useEffect(() => setPagination(dispatchDefaultPaginationCallback), [theResetDependency]);

    return {
        setPagination,
        page,
        size,
        skip,
        first,
        tablePagination,
    };
}
