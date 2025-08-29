import React, { forwardRef, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { debounce } from 'lodash';
import 'quill/dist/quill.snow.css';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { Mention, MentionBlot } from 'quill-mention';
import { QuillEditorContainer } from './style';
import { WysiwygContext } from './WysiwygContext';
import { ToolbarProvider } from './ToolbarContext';
import { emojiList } from './list';
// import './extendSnowTheme';

Quill.register({ 'blots/mention': MentionBlot, 'modules/mention': Mention });

const Link = Quill.import('formats/link');
class CustomLink extends Link {
    static create(value) {
        let href;
        let target;

        if (typeof value === 'object' && value !== null) {
            href = value.href;
            target = value.target;
        } else {
            href = value;
        }

        const node = super.create(CustomLink.sanitize(href));
        node.setAttribute('href', href);
        if (target) {
            node.setAttribute('target', target);
        }
        return node;
    }

    static formats(domNode) {
        // Keep the delta clean – only store the href string.
        return { href: domNode.getAttribute('href'), target: domNode.getAttribute('target') };
    }
}
Quill.register(CustomLink, false);
const EmojiBlot = Quill.import('blots/embed');
class EmojiFormat extends EmojiBlot {
    static create(value) {
        const node = super.create();
        node.innerHTML = value;
        return node;
    }

    static value(node) {
        return node.innerHTML;
    }
}
EmojiFormat.blotName = 'emoji';
EmojiFormat.tagName = 'span';
EmojiFormat.className = 'ql-emoji';

Quill.register({
    'formats/emoji': EmojiFormat,
});

const ICON_NAMES = {
    bold: 'bold',
    italic: 'italic',
    'custom-link': 'connect',
    bulletList: 'bullet_list',
    orderedList: 'numbers_list',
    emoji: 'smile',
};

const getIconTemplate = name => `
  <span class="toolbar-icon">
    <img class="icon-default" src="/assets/icons/${name}.svg" />
    <img class="icon-gray" src="/assets/icons/${name}_gray.svg" />
    <img class="icon-blue" src="/assets/icons/${name}_hover.svg" />
  </span>
`;

const icons = Quill.import('ui/icons');

Object.entries(ICON_NAMES).forEach(([key, value]) => {
    if (key === 'bulletList') {
        icons.list.bullet = getIconTemplate(value);
    } else if (key === 'orderedList') {
        icons.list.ordered = getIconTemplate(value);
    } else {
        icons[key] = getIconTemplate(value);
    }
});

const Wysiwyg = forwardRef((props, ref) => {
    const {
        $contentMinHeight,
        $contentMaxHeight = '200px',
        $toolbarHeight = '40px',
        $toolbarColor = 'white',
        $isFlip = false,
        $isNotCustomer = false,
        $isReopen = false,
        value = '',
        onChange,
        onFocus,
        onBlur,
        onFocusAfterChangeTab,
        handleChangeMessageType,
        handleKeyCommand,
        keyBindingFn,
        handleReturn,
        mentions = [],
        fileIds,
        toolbarLeft,
        toolbarRight,
        placeholder = 'Type your message here',
        addSnippetToContent,
        isCustomer = true,
        $showTabSwitcher = false,
        disableEnterKey = true,
        isAdminChat = false,
        canReopenRequest,
        ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    const [activeTab, setActiveTab] = useState('REPLY');
    const [openLink, setOpenLink] = useState(true);
    const [newPlaceHolder, setNewPlaceHolder] = useState(placeholder);
    const [editorContent, setEditorContent] = useState(value || '');
    const quillRef = useRef(null);
    const containerRef = useRef(null);
    const [isToolbarReady, setIsToolbarReady] = useState(false);
    const toolbarId = useRef(`toolbar-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        if (value !== editorContent) {
            setEditorContent(value || '');
        }
    }, [value]);

    const transformedMentions =
        mentions?.map((mention, index) => ({
            id: index.toString(),
            value: mention.text || '',
            link: mention.url || '',
        })) || [];

    const getQuill = () => quillRef.current?.getEditor();

    const handleEmojiSelect = emoji => {
        const quill = getQuill();
        if (!quill) return;
        // quill.insertText(0, 'Hello', 'link', 'https://world.com');
        const range = quill.getSelection(true);
        if (range) {
            quill.insertText(range.index, emoji);
            quill.setSelection(range.index + emoji.length);
        }
    };

    const createLinkMenu = (initialText = '', initialHref = '', initialTarget = '') => {
        const quill = getQuill();
        if (!quill) return;

        const existingMenu = containerRef.current.querySelector('.link-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const range = quill.getSelection(true);
        let defaultValueText = '';
        if (range && range.length > 0) {
            const selectedText = quill.getText(range.index, range.length);
            defaultValueText = selectedText;
        }
        if (initialText) {
            defaultValueText = initialText;
        }

        const linkButton = containerRef.current.querySelector('.ql-custom-link');
        const editorContainer = containerRef.current.querySelector('.ql-container');

        const linkMenu = document.createElement('div');
        linkMenu.className = 'link-menu';

        // Title
        const titleRow = document.createElement('div');
        titleRow.className = 'link-menu-row';

        const titleLabel = document.createElement('label');
        titleLabel.className = 'link-menu-label';
        titleLabel.innerText = 'Text:';

        const titleInput = document.createElement('input');
        titleInput.className = 'link-menu-input';
        titleInput.type = 'text';
        titleInput.placeholder = '';
        titleInput.value = defaultValueText;

        titleRow.appendChild(titleLabel);
        titleRow.appendChild(titleInput);

        // TARGET
        const targetRow = document.createElement('div');
        targetRow.className = 'link-menu-row';

        const targetLabel = document.createElement('label');
        targetLabel.className = 'link-menu-label';
        targetLabel.innerText = 'Link:';

        const targetInput = document.createElement('input');
        targetInput.className = 'link-menu-input';
        targetInput.type = 'text';
        targetInput.placeholder = '';
        if (initialHref) {
            targetInput.value = initialHref;
        }

        // Append label and input to row
        targetRow.appendChild(targetLabel);
        targetRow.appendChild(targetInput);

        // Open in new tab checkbox
        const checkboxRow = document.createElement('div');
        checkboxRow.className = 'link-menu-row2';

        const checkboxInput = document.createElement('div');
        checkboxInput.className = 'link-menu-checkbox link-menu-checkbox-active';
        checkboxInput.type = 'checkbox';
        checkboxInput.onclick = () => {
            if (checkboxInput.classList.contains('link-menu-checkbox-active')) {
                checkboxInput.classList.remove('link-menu-checkbox-active');
            } else {
                checkboxInput.classList.add('link-menu-checkbox-active');
            }
        };
        if (initialTarget === '_self') {
            checkboxInput.classList.remove('link-menu-checkbox-active');
        }

        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'link-menu-label2';
        checkboxLabel.innerText = 'Open link in new window';

        const customCheckbox = document.createElement('span');
        customCheckbox.className = 'link-menu-checkbox-custom';

        // Insert SVG inside customCheckbox
        customCheckbox.innerHTML = `
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8223 0.205945C12.0592 0.480538 12.0592 0.925741 11.8223 1.20033L4.40656 9.79426C4.16961 10.0689 3.78544 10.0689 3.5485 9.79426L0.17771 5.88793C-0.0592368 5.61334 -0.0592368 5.16814 0.17771 4.89354C0.414658 4.61895 0.798825 4.61895 1.03577 4.89354L3.97753 8.30268L10.9642 0.205945C11.2012 -0.0686483 11.5853 -0.0686483 11.8223 0.205945Z" fill="#0099F6" />
            </svg>
        `;

        checkboxRow.appendChild(checkboxInput);
        checkboxRow.appendChild(customCheckbox);
        checkboxRow.appendChild(checkboxLabel);

        // Confirm button
        const confirmButton = document.createElement('button');
        confirmButton.className = 'link-menu-button';
        confirmButton.innerText = 'ADD';

        confirmButton.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            const title = titleInput.value.trim();
            const url = targetInput.value.trim();
            const target = checkboxInput.classList.contains('link-menu-checkbox-active') ? '_blank' : '_self';

            if (url) {
                const range = quill.getSelection(true);
                if (range) {
                    const linkText = title || url;
                    // If selection length is 0, just insert the text
                    if (range.length === 0) {
                        quill.insertText(range.index, linkText, 'link', url);
                        // Set target attribute on the newly created link node
                        const [blot] = quill.getLeaf(range.index);
                        if (blot?.next?.domNode) {
                            blot.next.domNode.setAttribute('target', target);
                        }
                    } else {
                        // Otherwise replace selected text with linkText
                        quill.deleteText(range.index, range.length);
                        quill.insertText(range.index, linkText, 'link', url);
                        const [blot2] = quill.getLeaf(range.index);
                        if (blot2?.next?.domNode) {
                            blot2.next.domNode.setAttribute('target', target);
                        }
                    }
                }
                linkMenu.remove();
            }
        };

        // Append all elements to the menu
        linkMenu.appendChild(titleRow);
        linkMenu.appendChild(targetRow);
        linkMenu.appendChild(checkboxRow);
        linkMenu.appendChild(confirmButton);

        // Position menu relative to button
        const buttonRect = linkButton.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();

        const editorTop = document.querySelector('.ql-editor').getBoundingClientRect().top;
        const toolbarTop = document.querySelector('.ql-toolbar').getBoundingClientRect().top;

        linkMenu.style.position = 'absolute';

        if (editorTop < toolbarTop) {
            linkMenu.style.top = `${buttonRect.bottom - containerRect.top - 220}px`;
        } else {
            linkMenu.style.top = `${buttonRect.bottom - containerRect.top + 47}px`;
        }
        linkMenu.style.left = `${buttonRect.left - containerRect.left + 10}px`;

        editorContainer.appendChild(linkMenu);

        titleInput.focus();

        // Close menu when clicking outside
        const handleClickOutside = e => {
            if (!linkMenu.contains(e.target) && !linkButton.contains(e.target)) {
                linkMenu.remove();
                document.removeEventListener('click', handleClickOutside);
                setOpenLink(true);
            }
        };

        const updateConfirmButtonState = () => {
            if (targetInput.value.trim() !== '' && titleInput.value.trim() !== '') {
                confirmButton.classList.add('link-menu-button-active');
            } else {
                confirmButton.classList.remove('link-menu-button-active');
            }
        };

        updateConfirmButtonState();

        targetInput.addEventListener('input', updateConfirmButtonState);
        titleInput.addEventListener('input', updateConfirmButtonState);

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
    };

    const createEmojiMenu = () => {
        const quill = getQuill();
        if (!quill) return;

        const existingMenu = containerRef.current.querySelector('.emoji-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const emojiButton = containerRef.current.querySelector('.ql-emoji');
        const editorContainer = containerRef.current.querySelector('.ql-container');
        const emojiMenu = document.createElement('div');
        const emojiGrid = document.createElement('div');

        emojiMenu.className = 'emoji-menu';
        emojiGrid.className = 'emoji-grid';

        const buttonRect = emojiButton.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();

        emojiMenu.style.position = 'absolute';
        emojiMenu.style.top = $isFlip
            ? $showTabSwitcher
                ? '-110px'
                : $isReopen
                ? '-80px'
                : '-150px'
            : `${buttonRect.bottom - containerRect.top + 5}px`;
        emojiMenu.style.left = `${buttonRect.left - containerRect.left}px`;

        emojiList.forEach(emoji => {
            const button = document.createElement('div');
            button.className = 'emoji-button';
            button.innerHTML = emoji;
            button.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                handleEmojiSelect(emoji);
                emojiMenu.remove();
            };
            emojiGrid.appendChild(button);
        });

        emojiMenu.appendChild(emojiGrid);
        editorContainer.appendChild(emojiMenu);

        const handleClickOutside = e => {
            if (!emojiMenu.contains(e.target) && !emojiButton.contains(e.target)) {
                emojiMenu.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
    };

    const handleChangeTab = val => {
        if (val !== activeTab) {
            const quill = getQuill();
            if (quill) {
                const currentContent = quill.root.innerHTML;
                setActiveTab(val);
                quill.setContents([]);
                const getPlaceHolder =
                    val === 'REPLY'
                        ? 'Type your message here'
                        : 'Mention your teammate here (just @ and their name) and they will be notified.';
                setNewPlaceHolder(getPlaceHolder);

                setTimeout(() => {
                    quill.clipboard.dangerouslyPasteHTML(currentContent);
                }, 0);
            } else {
                setActiveTab(val);
                const getPlaceHolder =
                    val === 'REPLY'
                        ? 'Type your message here'
                        : 'Mention your teammate here (just @ and their name) and they will be notified.';
                setNewPlaceHolder(getPlaceHolder);
            }

            if (onFocusAfterChangeTab) {
                onFocusAfterChangeTab();
            }
            if (handleChangeMessageType) {
                handleChangeMessageType(val);
            }
        }
    };

    const handleChange = useCallback(
        content => {
            setEditorContent(content);
            if (onChange) onChange(content);
        },
        [onChange]
    );
    useEffect(
        debounce(() => {
            const quill = getQuill();
            if (quill && value !== editorContent) {
                quill.clipboard.dangerouslyPasteHTML(value || '');
                setEditorContent(value || '');
            }
        }, 300),
        [value]
    );

    React.useImperativeHandle(ref, () => ({
        focus: () => getQuill()?.focus(),
        blur: () => getQuill()?.blur(),
        getContent: () => {
            return getQuill()?.container.firstChild.innerHTML || '';
        },
        setContent: content => {
            const quill = getQuill();
            if (quill) {
                quill.clipboard.dangerouslyPasteHTML(content);
            }
        },
        clear: () => {
            const quill = getQuill();
            if (quill) {
                quill.setText('');
                if (onChange) onChange('');
            }
        },
        editor: getQuill(),
        focusEditor: () => getQuill()?.focus(),
    }));

    const modules = useMemo(
        () => ({
            toolbar: {
                container: `#${toolbarId.current}`,
            },
            clipboard: {
                matchVisual: false,
            },
            keyboard: {
                bindings: {
                    shift_enter: {
                        key: 13,
                        shiftKey: true,
                        handler: (range, ctx) => {
                            const quill = getQuill();
                            quill.insertText(range.index, '\n');
                        },
                    },
                    enter: {
                        key: 13,
                        handler: () => {},
                    },
                },
            },
            mention:
                mentions.length > 0
                    ? {
                          allowedChars: /^[A-Za-z\u0400-\u04FF0-9\s]*$/,
                          mentionDenotationChars: ['@'],
                          source: (searchTerm, renderList) => {
                              const matches = transformedMentions.filter(mention =>
                                  mention.value.toLowerCase().includes(searchTerm.toLowerCase())
                              );
                              renderList(matches, searchTerm);
                          },

                          onSelect(item, insertItem) {
                              insertItem(item);
                          },
                          dataAttributes: ['id', 'value', 'link'],
                          mentionContainerClass: 'ql-mention-list-container',
                          mentionListClass: 'ql-mention-list',
                          listItemClass: 'ql-mention-list-item',
                          spaceAfterInsert: true,
                      }
                    : false,
        }),
        []
    );

    const handleKeyDown = e => {
        const quill = getQuill();

        if (!handleKeyCommand) {
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            if (canReopenRequest) {
                handleKeyCommand('send-message');
                return;
            }
            e.preventDefault();
            let content = quill.root.innerHTML;

            content = content.replace(/(<p><br><\/p>)+$/, '').replace(/(<p><\/p>)+$/, '');

            quill.root.innerHTML = content;

            const hasContent = content && content !== '<p><br></p>' && content !== '<p></p>';
            if ((hasContent && handleKeyCommand) || fileIds?.length > 0) {
                handleKeyCommand('send-message');
                setTimeout(() => {
                    quill.setText('');
                    if (onChange) onChange('');
                }, 0);
            }
        }
    };

    useEffect(() => {
        const linkButton = containerRef.current?.querySelector('.ql-custom-link');
        if (linkButton) {
            const handleLinkClick = e => {
                e.preventDefault();
                e.stopPropagation();
                createLinkMenu();
            };
            linkButton.addEventListener('click', handleLinkClick);
            return () => linkButton.removeEventListener('click', handleLinkClick);
        }
    }, []);

    useEffect(() => {
        const emojiButton = containerRef.current?.querySelector('.ql-emoji');
        if (emojiButton) {
            const handleEmojiClick = e => {
                e.preventDefault();
                e.stopPropagation();
                createEmojiMenu();
            };
            emojiButton.addEventListener('click', handleEmojiClick);
            return () => {
                emojiButton.removeEventListener('click', handleEmojiClick);
            };
        }
    }, []);

    const formats = ['bold', 'italic', 'link', 'list', 'mention'];

    useEffect(() => {
        const checkQuill = () => {
            const quill = getQuill();

            quill.root.addEventListener('click', e => {
                if (e.target.tagName === 'A') {
                    e.preventDefault(); // prevent the default tooltip or link open
                    e.stopPropagation(); // stop other listeners if necessary

                    const linkText = e.target.innerText;
                    const linkHref = e.target.href;
                    const linkTarget = e.target.target;

                    // Optional: set the selection to the clicked link's position
                    const blot = Quill.find(e.target);
                    if (blot) {
                        const index = quill.getIndex(blot);
                        quill.setSelection(index, linkText.length);
                    }

                    // Show your custom link menu
                    createLinkMenu(linkText, linkHref, linkTarget);
                }
            });

            // This remove all actions from the keyboard for the Enter key
            if (disableEnterKey) {
                const keyboard = quill.getModule('keyboard');
                keyboard.bindings.Enter = null;
            }
        };

        const timeoutId = setTimeout(checkQuill, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const toolbarElement = document.querySelector(`#${toolbarId.current}`);
        if (toolbarElement) {
            setIsToolbarReady(true);
        }
    }, []);

    const debouncedUpdateContent = useCallback(
        debounce((newValue, currentContent) => {
            const quill = getQuill();
            if (quill && newValue !== currentContent) {
                quill.clipboard.dangerouslyPasteHTML(newValue || '');
                setEditorContent(newValue || '');
            }
        }, 300),
        [] // Empty dependencies so this function never changes
    );

    // Then use it in your effect
    useEffect(() => {
        debouncedUpdateContent(value, editorContent);

        // Important: Clean up the debounce on unmount to prevent memory leaks
        return () => {
            debouncedUpdateContent.cancel();
        };
    }, [value, editorContent, debouncedUpdateContent]);
    const getContainerDiv = () => {
        if (isAdminChat) {
            return document.querySelector('#adminFormInputMessageForm_content');
        }
        return containerRef.current?.querySelector('.ql-container');
    };

    return (
        <WysiwygContext.Provider
            value={{
                quill: getQuill(),
                addSnippetToContent,
                getContainerDiv,
                $isReopen,
                activeTab,
                $showTabSwitcher,
            }}
        >
            <QuillEditorContainer
                ref={containerRef}
                $contentMinHeight={$contentMinHeight}
                $contentMaxHeight={$contentMaxHeight}
                $toolbarHeight={$toolbarHeight}
                $toolbarColor={$toolbarColor}
                $isFlip={$isFlip}
                $isReopen={$isReopen}
                $isNotCustomer={$isNotCustomer}
                $isFocused={isFocused}
                $activeTab={activeTab}
                $showTabSwitcher={$showTabSwitcher}
                {...rest}
            >
                <div id={toolbarId.current}>
                    <span className="ql-formats">
                        <button className="ql-bold" title="Bold" />
                        <button className="ql-italic" title="Italic" />
                        <button className="ql-custom-link" title="Link" />
                        <button className="ql-list" value="bullet" title="Unordered" />
                        <button className="ql-list" value="ordered" title="Ordered" />
                        <button type="button" className="ql-emoji" title="Emoji" />
                    </span>
                    <ToolbarProvider
                        quill={getQuill()}
                        handleAddSnippet={addSnippetToContent}
                        left={toolbarLeft}
                        right={toolbarRight}
                        isCustomer={isCustomer}
                        $toolbarColor={$toolbarColor}
                        $isFlip={$isFlip}
                        $showTabSwitcher={$showTabSwitcher}
                    />
                </div>

                {isToolbarReady && (
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={editorContent}
                        onChange={handleChange}
                        modules={modules}
                        formats={formats}
                        placeholder={newPlaceHolder}
                        onFocus={() => {
                            setIsFocused(true);
                            if (onFocus) onFocus();
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                            if (onBlur) onBlur();
                        }}
                        onKeyDown={handleKeyDown}
                    />
                )}
                {$showTabSwitcher && (
                    <Box
                        id="admin-message-tab-switcher"
                        style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        $d="flex"
                        $alignItems="center"
                        $px="16"
                        $pt="10"
                        $border="0"
                        $borderT="1"
                        $borderL="1"
                        $borderR="1"
                        $borderB={activeTab !== 'NOTES' ? '1' : '0'}
                        $borderStyle="solid"
                        $borderColor="outline-gray"
                        $borderBottomColor="#F8F8F8"
                        $bg={activeTab === 'NOTES' ? 'badge-yellow' : 'white'}
                    >
                        <Text
                            $textVariant="H6"
                            $mr="27"
                            $pb="11"
                            $pos="relative"
                            $overflow="hidden"
                            $cursor="pointer"
                            onClick={() => handleChangeTab('REPLY')}
                            $colorScheme={activeTab === 'REPLY' ? 'cta' : 'primary'}
                        >
                            Reply
                            <Box
                                $h="3"
                                $w="38.641"
                                $bg="cta"
                                $pos="absolute"
                                $bottom="0"
                                $trans="left 250ms ease-in-out"
                                $left={activeTab === 'REPLY' ? '0' : '-38.641'}
                            />
                        </Text>
                        <Text
                            $textVariant="H6"
                            $pb="11"
                            $pos="relative"
                            $overflow="hidden"
                            $cursor="pointer"
                            onClick={() => handleChangeTab('NOTES')}
                            $colorScheme={activeTab === 'NOTES' ? 'cta' : 'primary'}
                        >
                            Notes
                            <Box
                                $h="3"
                                $w="39.969"
                                $bg="cta"
                                $pos="absolute"
                                $bottom="0"
                                $trans="left 250ms ease-in-out"
                                $left={activeTab === 'NOTES' ? '0' : '-39.969'}
                            />
                        </Text>
                    </Box>
                )}
            </QuillEditorContainer>
        </WysiwygContext.Provider>
    );
});

Wysiwyg.displayName = 'Wysiwyg';

export default Wysiwyg;
