/*
 * Global config
 *
 * Theme and icons:
 * - theme file is set in app.js "import theme from 'themes/[theme-file]';"
 * - icon file is set in components/Icon/index.js "import icons from 'themes/[icons-file]';"
 *
 * Images: images are stored in 'themes/media' folder
 *
 */

// Language and date settings ********************
// Note: you may also set the locales in i18n.js
import { version } from '../../package.json';

export const SERVER = (process && process.env && process.env.SERVER) || 'development';
const SERVER_ENDPOINTS = {
  production: 'https://nz-api.impactoss.org',
  test: 'https://nz-dev-api.impactoss.org',
  development: 'https://nz-dev-6568bd13e406.herokuapp.com',
};
const IS_PROD = SERVER === 'production';
const IS_TEST = SERVER === 'test';
// const IS_DEV = SERVER === 'development';
const version_text = IS_PROD ? '' : ` [${SERVER}]`;
export const VERSION = `${version}${version_text}`;

// enable azure for test and prod environments but not for dev
export const ENABLE_AZURE = IS_PROD || IS_TEST;

// default language locale
export const DEFAULT_LOCALE = 'en-NZ';
// date format - change to format according to locale, only used for form error message
export const DATE_FORMAT = 'dd/MM/yyyy';
export const NODE_ENV = sessionStorage.NODE_ENV || 'production';

// UI settings ************************

// show app title and claim in header when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HEADER_TITLE = false;

// show header pattern
// specified in themes/[theme].js: theme.backgroundImages.header
export const SHOW_HEADER_PATTERN = true;
export const HEADER_PATTERN_HEIGHT = 254;

// show header pattern
// specified in themes/[theme].js: theme.backgroundImages.sidebarHeader
export const SHOW_SIDEBAR_HEADER_PATTERN = false;

// show app title and claim in home when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HOME_TITLE = true;

export const SHOW_BRAND_ON_HOME = false;
export const SHOW_HEADER_PATTERN_HOME_GRAPHIC = false;

// show footer logo section
export const FOOTER = {
  PARTNERS: false,
  LINK_TARGET_INTERNAL: true,
  LINK_TARGET_INTERNAL_ID: 1,
};

export const CONTAINER_FOOTER = {
  LINK_TARGET_INTERNAL: true,
  LINKS: [
    {
      TYPE: 'copyright',
      LINK_TARGET_INTERNAL_ID: 1,
    },
    {
      TYPE: 'disclaimer',
      LINK_TARGET_INTERNAL_ID: 1,
    },
    {
      TYPE: 'privacy',
      LINK_TARGET_INTERNAL_ID: 1,
    },
  ],
};
// entitylists items-per-page options
// export const PAGE_ITEM_OPTIONS = [10, 20, 50, 100, 'all'];
export const PAGE_ITEM_OPTIONS = [
  {
    value: 10,
  },
  {
    value: 20,
  },
  {
    value: 50,
  },
  {
    value: 100,
  },
  {
    value: 'all',
    message: 'ui.pageItemOptions.all',
  },
];

export const TEXT_TRUNCATE = {
  CONNECTION_TAG: 20,
  ATTRIBUTE_TAG: 10,
  ENTITY_TAG: 7,
  CONNECTION_POPUP: 80,
  LINK_FIELD: 30,
  FW_SELECT: 32,
  GRACE: 2,
  META_TITLE: 20,
};

export const PROGRESS_TAXONOMY_ID = 9;

// WARNING: references as assigned by user
export const PROGRESS_CATEGORY_REFERENCES = {
  ONGOING: 1,
  COMPLETED: 2,
};

export const CYCLE_TAXONOMY_ID = 2;

/**
 * Server settings
 * */

// General ********************

export const ENDPOINTS = {
  API: SERVER_ENDPOINTS[SERVER], // server API endpoint
  SIGNING_URL: 's3/sign', // server AWS S3 signing url endpoint
  SIGN_IN: 'auth/sign_in',
  SIGN_OUT: 'auth/sign_out',
  PASSWORD: 'auth/password',
  VALIDATE_TOKEN: 'auth/validate_token',
  SIGN_IN_AZURE: 'auth/azure_activedirectory_v2',
};

// API request Authentification keys
export const KEYS = {
  ACCESS_TOKEN: 'access-token',
  TOKEN_TYPE: 'token-type',
  CLIENT: 'client',
  EXPIRY: 'expiry',
  UID: 'uid',
  RESET_PASSWORD: 'reset_password',
};

// database date format
export const DB_DATE_FORMAT = 'yyyy-MM-dd';


// Map server messages *********************************

// Map server error messages to allow client-side translation
export const SERVER_ERRORS = {
  RECORD_OUTDATED: 'Record outdated',
  EMAIL_FORMAT: 'Email: is not an email',
  PASSWORD_MISMATCH: 'Password confirmation doesn\'t match Password',
  PASSWORD_SHORT: 'Password is too short (minimum is 6 characters)',
  PASSWORD_INVALID: 'Current password is invalid',
  TITLE_REQUIRED: 'Title: can\'t be blank',
  REFERENCE_REQUIRED: 'Reference: can\'t be blank',
};

// Map server attribute values **************************

// user roles
export const USER_ROLES = {
  ADMIN: { value: 1, message: 'ui.userRoles.admin' },
  MANAGER: { value: 2, message: 'ui.userRoles.manager' },
  CONTRIBUTOR: { value: 3, message: 'ui.userRoles.contributor' },
  DEFAULT: { value: 9999, message: 'ui.userRoles.default' }, // note: client side only - no role assigned on server
};
// Entity publish statuses
export const PUBLISH_STATUSES = [
  { value: true, message: 'ui.publishStatuses.draft' },
  { value: false, message: 'ui.publishStatuses.public' },
];
// Document publish statuses
export const DOC_PUBLISH_STATUSES = [
  { value: true, message: 'ui.docPublishStatuses.public' },
  { value: false, message: 'ui.docPublishStatuses.private' },
];
// Recommendation statuses
export const ACCEPTED_STATUSES = [
  { value: true, icon: 'recommendationAccepted', message: 'ui.acceptedStatuses.accepted' },
  { value: false, icon: 'recommendationNoted', message: 'ui.acceptedStatuses.noted' },
];
// Report frequencies
export const REPORT_FREQUENCIES = [
  { value: 1, message: 'ui.reportFrequencies.monthly' },
  { value: 3, message: 'ui.reportFrequencies.quarterly' },
  { value: 6, message: 'ui.reportFrequencies.semiannual' },
  { value: 12, message: 'ui.reportFrequencies.annual' },
];

export const DEFAULT_FRAMEWORK = 1;
export const ENABLE_SDGS = false;
// set to min role required or null to disable
export const DELETE_MIN_ROLE = null;
export const PAGE_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value;
export const USER_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value;
export const CATEGORY_MANAGER_MIN_ROLE = USER_ROLES.MANAGER.value;
export const CONTRIBUTOR_MIN_ROLE = USER_ROLES.MANAGER.value; // edit or create
export const CONTRIBUTOR_MIN_ROLE_PUBLISH = USER_ROLES.MANAGER.value; // publish
export const CONTRIBUTOR_MIN_ROLE_ASSIGNED = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_DRAFT_MIN_ROLE = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned

// Map server database tables **************************
export const DB_TABLES = [
  'users',
  'user_roles',
  'roles',
  'pages',
  'bookmarks',
  'taxonomies',
  'categories',
  'indicators',
  'measure_categories',
  'measure_indicators',
  'measures',
  'recommendation_categories',
  'recommendation_measures',
  'recommendations',
  'user_categories',
  'progress_reports',
  'due_dates',
  'frameworks',
  'framework_taxonomies',
  'recommendation_indicators',
];

export const COLUMN_WIDTHS = {
  FULL: 1,
  HALF: 0.5,
  MAIN: 0.72,
  OTHER: 0.28,
};
