
import { useEffect } from 'react';

const useScript = (url) => {
  useEffect(() => {
    const t = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    t.async = true;
    t.id    = 'cio-forms-handler';
    t.setAttribute('data-site-id', 'daca9ef56fbc7d0e8849');
    t.setAttribute('data-base-url', 'https://customerioforms.com');
    
    t.src = url ?? 'https://customerioforms.com/assets/forms.js';
    s.parentNode.insertBefore(t, s);
    document.body.appendChild(t)
    return () => {
      document.body.removeChild(t);
    }
  }, [url]);
};

export default useScript;