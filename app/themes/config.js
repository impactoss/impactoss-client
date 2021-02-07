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

// default language locale
export const DEFAULT_LOCALE = 'en-GB';
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

export const SHOW_BRAND_ON_HOME = true;
export const SHOW_HEADER_PATTERN_HOME_GRAPHIC = true;

// show footer logo section
export const FOOTER = {
  PARTNERS: true,
  LINK_TARGET_INTERNAL: false,
  LINK_TARGET_INTERNAL_ID: 1,
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

export const PROGRESS_TAXONOMY_ID = 10;

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
  API: (
    NODE_ENV === 'production'
      ? 'https://impactoss-dev.herokuapp.com'
      : 'https://impactoss-dev.herokuapp.com'
  ), // server API endpoint
  SIGNING_URL: '/s3/sign', // server AWS S3 signing url endpoint
  SIGN_IN: 'auth/sign_in',
  SIGN_OUT: 'auth/sign_out',
  PASSWORD: 'auth/password',
  VALIDATE_TOKEN: 'auth/validate_token',
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
  'framework_frameworks',
  'recommendation_indicators',
  'recommendation_recommendations',
];

export const COLUMN_WIDTHS = {
  FULL: 1,
  HALF: 0.5,
  MAIN: 0.72,
  OTHER: 0.28,
};
