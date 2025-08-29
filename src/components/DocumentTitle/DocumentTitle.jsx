import React, { memo, useEffect } from 'react';

const DocumentTitle = memo(({ title, children }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
    return <>{children}</>;
});

export default DocumentTitle;
