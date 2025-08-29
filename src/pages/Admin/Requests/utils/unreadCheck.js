export const unreadCheck = (item, viewer) => {
    const isSameCreator = item.user && item.user.id ? item.user.id === viewer.id : false;
    if (!isSameCreator) {
        const readerArrayCheck = Array.isArray(item.readBy) && item.readBy.findIndex(item => item.userId === viewer.id) < 0;
        const readerIsNull = item.readBy === null;
        return readerArrayCheck || readerIsNull;
    }
    return false;
};
