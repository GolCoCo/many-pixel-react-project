// Pages from the website
export const WEBPAGE_PRICING = 'https://www.manypixels.co/pricing#plans';
export const WEBPAGE_HOME = 'https://www.manypixels.co';
export const WEBPAGE_HELP = 'https://www.manypixels.co/help';
export const WEBPAGE_NOTION = 'https://www.notion.so/manypixels/ManyPixels-Home-5769b40777b6402b82cc0b1bd4c2780d';

// Stripe Third party
export const STRIPE_CUSTOMER_PROFILE = 'https://dashboard.stripe.com/customers/:customerId';
export const STRIPE_PLAN_PROFILE = 'https://dashboard.stripe.com/plans/:planId';

// Auth
export const SIGN_IN = '/signin';
export const LOG_OUT = '/logout';
export const PASSWORD_FORGET = '/password-forgot';
export const PASSWORD_RESET = '/password-reset/:id';
export const ONBOARD = '/onboard';
export const ONBOARD_MEMBER = '/onboard/member';
export const REQUESTS = '/requests';
export const REQUESTS_QUEUE = '/requests?tab=queue';
export const REQUESTS_DELIVERED = '/requests?tab=delivered';
export const REQUESTS_DRAFT = '/requests?tab=draft';
export const CREATE_REQUEST = '/requests/create';
export const EDIT_REQUEST = '/requests/edit/:id';
export const DUPLICATE_REQUEST = '/requests/duplicate/:id';
export const DETAIL_REQUEST = '/requests/:id';
export const FEEDBACK_REQUEST = '/requests/:id/feedback';
export const BRANDS = '/brands';
export const BRAND = '/brand/:brandId';
export const TEAM = '/team';
export const PROFILE = '/profile';
export const COMPANY = '/profile?tab=2';
export const BILLING = '/profile?tab=3';
export const EDIT_PLAN = '/edit-plan';
export const NOTIFICATIONS = '/notifications';
export const REFERRAL = '/referral';
export const PLANNING = '/planning';
export const ADMIN_COMPANY = '/company';
export const CUSTOMERS = '/customers';
export const SETTINGS = '/settings';
export const ADMIN_PLAN_SETTING = '/settings?tab=PLAN';
export const ADMIN_CATEGORY_SETTING = '/settings?tab=CATEGORY';
export const ADMIN_PRODUCT_SETTING = '/settings?tab=PRODUCT';
export const ADMIN_DESIGN_TYPE_SETTING = '/settings?tab=DESIGN TYPE';
export const ADMIN_TOOL_SETTING = '/settings?tab=TOOL';
export const ADMIN_SNIPPETS_SETTING = '/settings?tab=SNIPPETS';
export const ADD_PLAN_SETTING = '/settings/plan/create';
export const EDIT_PLAN_SETTING = '/settings/plan/edit/:id';
export const PLAN_DETAILS = '/settings/plan/:id';
export const CATEGORY_DETAILS = '/settings/category/:id';
export const PRODUCT_DETAILS = '/settings/product/:id';
export const SNIPPET_DETAILS = '/settings/snippet/:id';

// Misc
export const HOME = '/home';

// Wizard
export const WIZARD = '/wizard';
export const ORDER_WIZARD = '/order/new';
export const ORDER_WIZARD_CATEGORY_SLUG = '/order/new/:category';
export const ORDER_WIZARD_SERVICE_ID = '/s/:id';
export const BROWSE_REQUESTS = '/browse/';
export const PRODUCT = '/product/:id';
export const EMBED_PRODUCT = '/product/:id/embed';

// Subscriptions
export const SUBSCRIPTIONS = '/subscriptions';
export const ADD_SUBSCRIPTION = '/subscriptions/add';
export const EMBED_SUBSCRIPTION = '/subscription/:id/embed';
export const NEW_SUBSCRIPTION = '/subscriptions/new';

// Plan
export const PLAN = '/plan/:id';

// Team
export const MANAGE_COMPANY = '/company/:section?';
export const STRIPE_OAUTH_TEAM = '/company/stripe/oauth';
export const MANAGE_TEAM = '/company/teams/:id?';
export const MANAGE_COMPANY_TEAM = '/company/teams';

// Category
export const CATEGORY = '/category/:slug/:section?';

// Customers
export const ADD_CUSTOMER = '/customers/add';
export const CUSTOMER_PROFILE = '/user/:id/:section?/:page?';

// Profile
export const GET_USER_INFOS = '/account/missing-infos';
export const CHANGE_PLAN = '/subscription/plan';
export const FILES_VAULT = '/files';
export const FILES_VAULT_ORDER = '/files/order/:orderId';
export const FILES_VAULT_ORDER_ATTACHMENTS = '/files/order/:orderId/folder/attachments';
export const FILES_VAULT_ORDER_FOLDER = '/files/order/:orderId/ORDER_WIDGET/:folderId';
export const FILES_VAULT_REFERENCES = '/files/references';
export const FILES_VAULT_REFERENCES_FOLDER = '/files/references/folder/:folderId';
export const NEW_ORDER = '/s/:id/order';
export const ORDERS = '/orders';
export const ORDER = '/order/:id/:section?';
export const ORDER_FOLDER = '/order/:orderId/files/:folderId?';
export const ACCOUNT_INFO = '/account/:id?';
export const MEMBER_INFO = '/member/:id';

// Join
export const JOIN_TEAM = '/join/:id';

// Connect as
export const CONNECT_AS = '/connect/:token?';
