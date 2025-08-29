export const forceInt = str => {
    try {
        return parseInt(str, 10);
    } catch (error) {
        return '';
    }
};
