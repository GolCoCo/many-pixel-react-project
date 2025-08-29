export const formatAction = text => {
    // TODO: handle from back or front
    const lowerText = typeof text === 'string' ? text.toLowerCase() : text;
    switch (lowerText) {
        case 'changed the status to "completed"':
            return '<span class="completed">marked the request as completed</span>';
        case 'changed status to "submitted"':
            return '<span class="bold mr-4">submitted</span> the request';
        case 'resumed the request':
            return '<span class="bold mr-4">resumed</span> the request';
        case 'paused the request':
        case 'changed the status to "paused"':
            return '<span class="bold mr-4">paused</span> the request';
        case 'deleted the request':
            return '<span class="deleted">deleted the request</span>';
        case 'changed the status to "delivered"':
            return 'changed the status to <span class="bold ml-4"> Delivered</span>';
        case 'changed the status to "queued"':
            return 'changed the status to <span class="bold ml-4"> Queued</span>';
        case 'changed the status to "waiting review"':
            return 'changed the status to <span class="bold ml-4"> Waiting Review</span>';
        case 'changed the status to "ongoing"':
            return 'changed the status to <span class="bold ml-4"> Ongoing</span>';
        default:
    }

    if (typeof text === 'string') {
        if (text.startsWith('Reopening request')) {
            return '<span class="bold mr-4">reopen</span> the request';
        }
        if (text.startsWith('left feedback on')) {
            const fileName = text.replace('left feedback on ', '');
            return `left feedback on <span class="bold ml-4">${fileName}</span>`;
        }
        if (text.startsWith('commented on')) {
            const fileName = text.replace('commented on ', '');
            return `commented on <span class="bold ml-4">${fileName}</span>`;
        }
    }
    return text;
};
