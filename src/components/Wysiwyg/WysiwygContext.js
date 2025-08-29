import { createContext, useContext } from 'react';

export const WysiwygContext = createContext({
  quill: null,
  addSnippetToContent: null,
  getContainerDiv: () => document.querySelector('.ql-container'),
});

export const useWysiwygContext = () => {
  return useContext(WysiwygContext);
};
