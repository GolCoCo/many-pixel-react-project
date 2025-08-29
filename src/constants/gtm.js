import { isBrowser } from './utils';

const gtm = data => {
    //  return false;
    if (!isBrowser) return false;
    window.dataLayer.push(data);
    return true;
};

export default gtm;
