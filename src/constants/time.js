export const timeSince = strDate => {
    const date = new Date(strDate);

    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        const intv = Math.floor(interval);
        return `${intv} year${intv > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const intv = Math.floor(interval);
        return `${intv} month${intv > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval >= 2) {
        return `${Math.floor(interval)} days ago`;
    }
    if (interval > 1 && interval < 2) {
        return 'Yesterday';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return `${Math.floor(interval)} hour${interval >= 2 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        return `${Math.floor(interval)} minute${interval >= 2 ? 's' : ''} ago`;
    }

    if (interval < 2) {
        return 'just now';
    }

    return `${Math.floor(seconds)} second${seconds >= 2 ? 's' : ''} ago`;
};
