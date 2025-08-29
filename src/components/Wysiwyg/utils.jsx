import linkifyIt from 'linkify-it';
import tlds from 'tlds';
import DOMPurify from 'dompurify';

export const linkify = linkifyIt();
linkify.tlds(tlds);

function replaceBetween(originalText, start, end, replacement) {
    return `${originalText.substring(0, start)}${replacement}${originalText.substring(end)}`;
}

export const hasLink = htmlText => {
    return linkify.test(htmlText);
};

export const parseLinks = (htmlText, replacementText) => {
    const matches = linkify.match(htmlText);
    let plainText = htmlText;
    if (typeof matches !== 'undefined' && matches !== null) {
        matches
            .slice() // make a shallow copy
            .reverse()
            .forEach((match, index) => {
                // const link = linkify.match(plainText)[index];

                const beforeLink = plainText.substring(0, match.index);
                const lastIndexLink = beforeLink.lastIndexOf('<a ');
                const closeTagIndex = beforeLink.indexOf('</a>', lastIndexLink);

                const href = plainText.substring(Math.max(match.index - 6, 0), match.index);
                if (lastIndexLink === -1 || (closeTagIndex !== -1 && href !== 'href="')) {
                    plainText = replaceBetween(
                        plainText,
                        match.index,
                        match.lastIndex,
                        `<a href="${match.url}" target='_blank' rel="noopener noreferrer">${
                            replacementText || match.text
                        }</a>`
                    );
                }
            });
    }
    return plainText;
};

export const toHtml = content => {
    if (!content) return '';
    return DOMPurify.sanitize(content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['target', 'rel'],
    });
};

// convert html to wysiwyg and have a check to convert old snippets to new snippets format
export const toWysiwyg = content => {
    if (!content) return '';

    let processedContent = content;

    if (/<ol/.test(content)) {
        processedContent = processedContent.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, listContent) => {
            if (!/data-list/.test(listContent)) {
                const processedList = listContent.replace(/<li[^>]*>/g, '<li data-list="ordered">');
                return `<ol>${processedList}</ol>`;
            }
            // Fix to force the use of ul in case of a data-list bullet
            // I use that instead of a blot to handle the fact that guilljs use ol wherever it's a bullet or ordered list
            if (listContent.includes('data-list="bullet"')) {
                return `<ul>${listContent}</ul>`;
            }
            return match;
        });
    }

    if (/<ul/.test(processedContent)) {
        processedContent = processedContent.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, listContent) => {
            if (!/data-list/.test(listContent)) {
                const processedList = listContent.replace(/<li[^>]*>/g, '<li data-list="bullet">');
                return `<ul>${processedList}</ul>`;
            }
            return match;
        });
    }

    return DOMPurify.sanitize(processedContent, {
        ADD_TAGS: ['iframe', 'ol', 'li', 'ul'],
        ADD_ATTR: ['target', 'rel', 'data-list'],
    });
};
