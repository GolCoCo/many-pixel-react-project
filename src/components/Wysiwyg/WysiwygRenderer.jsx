import React from 'react';
import DOMPurify from 'dompurify';
import styled from 'styled-components';

const RendererContainer = styled.div`
    font-weight: ${props => `${props.$fontWeight}` ?? 'inherit'};
    word-break: keep-all;
    overflow-wrap: break-word;
    li,
    p {
        font-weight: 300;
    }

    ol {
        margin-bottom: 0;
    }

    p {
        margin-bottom: 0em;
    }

    span.mention {
        height: 24px;
        width: auto;
        color: #0099f6;
    }
`;

const WysiwygRenderer = ({ content, $fontWeight, padding = '0 0 0 4px' }) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ['iframe', 'ol', 'ul', 'li'],
        ADD_ATTR: ['target', 'rel', 'style', 'class', 'data-list'],
    });
    return <RendererContainer $fontWeight={$fontWeight} dangerouslySetInnerHTML={{ __html: sanitizedContent }} style={{ padding }} />;
};

export default WysiwygRenderer;
