import React from 'react';
import { Box } from '@components/Box';
import { WysiwygRenderer } from '@components/Wysiwyg';

const text = `
<p>Your request has been submitted. If this request is at the top of your queue, you can expect a first update within the next business day.</p> 
<br />
<p>A few things to remember:</p>
<ul>
<li>We work Monday to Friday</li>
<li>We work on the requests in your Queue from top to bottom. If you would like us to work on this request first, please make sure to drag and drop it to the top of your Queue.</li>
<li>Every day, we deliver the daily output across one or multiple requests. To learn more about the daily output, check out our Help Center.</li>
</ul>
`;

export const PresetMessageMp = () => {
    return (
        <Box $mt="6">
            <WysiwygRenderer content={text} />
        </Box>
    );
};
