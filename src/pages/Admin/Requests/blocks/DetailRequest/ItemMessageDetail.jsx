import React, { memo } from 'react';
import { MessageTypeAction } from './MessageTypeAction.jsx';
import { MessageTypeDefault } from './MessageTypeDefault.jsx';
import { MessageTypeNote } from './MessageTypeNote.jsx';

export const ItemMessageDetail = memo(({ deleteMessage, updateMessage, isNote, isAction, message, usersOnline }) => {

    if (isNote && isAction) {
        return <MessageTypeNote {...message} usersOnline={usersOnline} />;
    }
    if (isAction) {
        return <MessageTypeAction {...message} usersOnline={usersOnline} />;
    }
    return (
        <MessageTypeDefault
            {...message}
            isNote={isNote}
            deleteMessage={deleteMessage}
            updateMessage={updateMessage}
            usersOnline={usersOnline}
        />
    );
});
