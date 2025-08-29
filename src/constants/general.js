export const BRAND_NAME = 'ManyPixels';

export const SUBSCRIPTIONS_LINK = import.meta.env.VITE_SUBSCRIPTIONS_API ?? 'ws://localhost:4000/graphql';
export const API_LINK = import.meta.env.VITE_SERV_API;

const port = window.location.port;
export const FULL_HOSTNAME = `${window.location.protocol}//${window.location.hostname}${port && port !== 80 ? `:${port}` : ''}`;

export const MANYPIXELS_PRICING_PAGE = 'https://manypixels.co/pricing#plans';
export const JAR_LINK = 'http://manypixels.jarhq.com';
export const MANYPIXELS_TERMS_OF_SERVICE_PAGE = 'https://www.manypixels.co/terms-of-service';
export const MANYPIXELS_PRIVACY_POLICY = 'https://www.manypixels.co/privacy-policy';
export const INTERCOM_ID = 'zrk70l5h';

export const STRIPE_PK = import.meta.env.VITE_STRIPE_PK;

export const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

export const CALENDLY_CALL_URL = 'https://calendly.com/quentingilon/manypixels-customer-call'; // todo calendly manypixels ?
export const FACEBOOK_PIXEL_ID = '219501192287459';

export const PLATFORM_GOOGLE_SHEET = 'https://docs.google.com/spreadsheets/d/1tk_XfcOi1JwKbhDlwm0g09jn03kdGYGnixn5B8TP-Sk';

export const contactEmail = 'info@manypixels.co';
export const notionLink = 'https://www.notion.so/manypixels/ManyPixels-Home-5769b40777b6402b82cc0b1bd4c2780d';
