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
// date format - change to format according to locale
export const DATE_FORMAT = 'dd/mm/yyyy';

// UI settings ************************

// show app title and claim in header when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HEADER_TITLE = true;

// show app title and claim in home when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HOME_TITLE = true;

// show footer logo section
export const SHOW_FOOTER_LOGOS = true;

// entitylists items-per-page options
export const PAGE_ITEM_OPTIONS = [10, 20, 50, 100];

/**
 * Server settings
 **/

// General ********************

// server API endpoint
export const API_ENDPOINT = 'https://undp-sadata-staging.herokuapp.com';
// server AWS S3 signing url endpoint
export const SIGNING_URL_ENDPOINT = '/s3/sign';

// database date format
export const DB_DATE_FORMAT = 'YYYY-MM-DD';

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

// Map server database tables **************************

export const DB_TABLES = [
  'users',
  'user_roles',
  'pages',
  'taxonomies',
  'categories',
  'indicators',
  'measure_categories',
  'measure_indicators',
  'measures',
  'recommendation_categories',
  'recommendation_measures',
  'recommendations',
  'sdgtarget_categories',
  'sdgtarget_indicators',
  'sdgtarget_measures',
  'sdgtargets',
  'user_categories',
  'progress_reports',
  'due_dates',
];

export const MEASURE_ENTITY = {
  table: 'measures',
  key: 'measures_id',
  fields: [
    {
      attribute: 'title',
      control: 'title',
      type: 'text',
      required: true,
      import: true,
      section: 'header',
      column: 'main',
    },
    {
      attribute: 'draft',
      control: 'status',
      type: 'bool',
      default: true,
      section: 'header',
      column: 'aside',
    },
    {
      attribute: 'description',
      control: 'markdown',
      type: 'markdown',
      import: true,
      section: 'body',
      column: 'main',
    },
    {
      attribute: 'outcome',
      control: 'markdown',
      type: 'markdown',
      import: true,
      disabled: true,
      section: 'body',
      column: 'main',
    },
    {
      attribute: 'indicator_summary',
      control: 'markdown',
      type: 'markdown',
      import: true,
      disabled: true,
      section: 'body',
      column: 'main',
    },
    {
      attribute: 'target_date',
      control: 'date',
      type: 'date',
      import: true,
      section: 'body',
      column: 'aside',
    },
    {
      attribute: 'target_date_comment',
      control: 'textarea',
      type: 'text',
      import: true,
      section: 'body',
      column: 'aside',
    },
  ],
  taxonomies: {
    table: 'measure_categories',
    key: 'category_id',
    section: 'body',
    column: 'aside',
  },
  connections: {
    tables: [
      {
        table: 'recommendations',
        via: 'recommendation_measures',
        key: 'recommendation_id',
      },
      {
        table: 'sdgtargets',
        via: 'sdgtarget_measures',
        key: 'sdgtarget_id',
      },
      {
        table: 'indicators',
        via: 'measure_indicators',
        key: 'indicator_id',
      },
    ],
    section: 'body',
    column: 'main',
  },
};
