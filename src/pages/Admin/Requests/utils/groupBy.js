export const groupBy = (arr, groupedBy) => {
    return arr.reduce((prev, item) => {
        const key = typeof groupedBy === 'function' ? groupedBy(item) : item[groupedBy];

        if (!prev[key]) {
            prev[key] = [];
        }
        prev[key].push(item);
        return prev;
    }, {});
};
