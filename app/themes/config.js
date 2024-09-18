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
  UAT: 'https://nz-dev-api.impactoss.org',
  development: 'https://nz-dev-6568bd13e406.herokuapp.com',
};
export const SERVER_ENDPOINT = SERVER_ENDPOINTS[SERVER];
// used for redirect and canonical tag

export const CLIENT_URL = 'https://uat.humanrights.govt.nz';
export const IS_PROD = SERVER === 'production';
export const IS_TEST = SERVER === 'UAT';
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
export const SHOW_HEADER_PATTERN = false;
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
export const SHOW_HEADER_PATTERN_HOME_GRAPHIC = false;

// show footer logo section
export const FOOTER = {
  INTERNAL_LINKS: [
    1, // copyright (page db id as generated in seed file)
    2, // disclaimer
    3, // privacy
  ],
};

export const ABOUT_PAGE_ID = 4;

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
// categories where "is_current" is relevant
export const CURRENT_TAXONOMY_IDS = [
  2, // reporting cycles
];

// WARNING: references as assigned by user
export const PROGRESS_CATEGORY_ID = {
  COMPLETED: 8,
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
export const SUPPORT_LEVELS = [
  { value: 'null', icon: '', message: 'ui.supportLevels.null' },
  { value: 0, icon: 'recommendationNoted', message: 'ui.supportLevels.noted' },
  { value: 1, icon: 'recommendationSupported', message: 'ui.supportLevels.supportedInPart' },
  { value: 2, icon: 'recommendationSupported', message: 'ui.supportLevels.supported' },
];
// "current" statuses
export const IS_CURRENT_STATUSES = [
  { value: true, message: 'ui.currentStatuses.current' },
  { value: false, message: 'ui.currentStatuses.notCurrent' },
];
export const IS_ARCHIVE_STATUSES = [
  { value: true, message: 'ui.archiveStatuses.archived' },
  { value: false, message: 'ui.archiveStatuses.notArchived' },
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
export const CATEGORY_MANAGER_MIN_ROLE = USER_ROLES.MANAGER.value; // can be assigned to category
export const CONTRIBUTOR_MIN_ROLE = USER_ROLES.MANAGER.value; // edit or create
export const CATEGORY_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value; // can edit or create categories
export const CONTRIBUTOR_MIN_ROLE_PUBLISH = USER_ROLES.MANAGER.value; // publish
export const CONTRIBUTOR_MIN_ROLE_ASSIGNED = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_DRAFT_MIN_ROLE = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_ARCHIVED_MIN_ROLE = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_META_MIN_ROLE = USER_ROLES.MANAGER.value; // edit or create when assigned
export const ARCHIVE_MIN_ROLE = USER_ROLES.ADMIN.value; // archive content

// Map server database tables **************************
export const API = {
  FRAMEWORKS: 'frameworks', // frameworks aka recommendation-type / type of objective
  TAXONOMIES: 'taxonomies',
  CATEGORIES: 'categories',
  USERS: 'users',
  ROLES: 'roles',
  RECOMMENDATIONS: 'recommendations', //
  ACTIONS: 'measures', // actions/ACTIONS
  INDICATORS: 'indicators', // actions/ACTIONS
  PROGRESS_REPORTS: 'progress_reports', //
  DUE_DATES: 'due_dates',
  PAGES: 'pages',
  BOOKMARKS: 'bookmarks',
  USER_ROLES: 'user_roles',
  USER_CATEGORIES: 'user_categories',
  FRAMEWORK_TAXONOMIES: 'framework_taxonomies', // action taxonomies
  RECOMMENDATION_CATEGORIES: 'recommendation_categories', // linking recs with cats
  RECOMMENDATION_ACTIONS: 'recommendation_measures', // linking recs with actions
  RECOMMENDATION_INDICATORS: 'recommendation_indicators', // linking recs with indicators
  ACTION_CATEGORIES: 'measure_categories', // measure_categories
  ACTION_INDICATORS: 'measure_indicators', // linking actions with indicators
};

export const DB_TABLES = Object.values(API);

export const DB_TABLES_CURRENT = [
  'indicators',
  'measures',
  'recommendations',
];
export const DB_TABLES_ARCHIVED = [
  'users',
  'pages',
  'categories',
  'indicators',
  'measures',
  'recommendations',
];

export const COLUMN_WIDTHS = {
  FULL: 1,
  HALF: 0.5,
  MAIN: 0.72,
  OTHER: 0.28,
};

export const SEARCH = {
  MIN_LENGTH: 1,
};

export const ENTITY_FIELDS = {
  measures: {
    ATTRIBUTES: {
      draft: {
        defaultValue: true,
        type: 'bool',
        skipImport: true,
        exportRequired: true,
        roleExport: USER_ROLES.CONTRIBUTOR.value,
        exportColumn: 'public',
        exportFlip: true,
      },
      reference: {
        type: 'text',
        required: true,
        import: true,
        unique: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
        required: true,
      },
      description: {
        type: 'markdown',
      },
      outcome: {
        type: 'markdown',
      },
      target_date: {
        type: 'date',
      },
      target_date_comment: {
        type: 'text',
      },
      created_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      created_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'created_by',
      },
      updated_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      updated_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'updated_by',
      },
      relationship_updated_at: {
        skipImport: true,
        type: 'datetime',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_at',
      },
      relationship_updated_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_by',
      },
    },
    CONNECTIONS: {
      categories: {
        table: API.CATEGORIES,
        connection: API.ACTION_CATEGORIES,
        groupby: {
          table: API.TAXONOMIES,
          on: 'taxonomy_id',
        },
      },
      recommendations: {
        table: API.RECOMMENDATIONS,
        connection: API.RECOMMENDATION_ACTIONS,
        groupby: {
          table: API.FRAMEWORKS,
          on: 'framework_id',
        },
      },
      indicators: {
        table: API.INDICATORS,
        connection: API.ACTION_INDICATORS,
      },
    },
    RELATIONSHIPS_IMPORT: {
      // has category
      'category-reference': {
        type: 'text',
        table: API.ACTION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'reference',
        },
        keyPair: ['measure_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-reference',
      },
      'category-short-title': {
        type: 'text',
        table: API.ACTION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'short_title',
        },
        keyPair: ['measure_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-short-title',
      },
      // has category
      'category-id': {
        type: 'number',
        table: API.ACTION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
        },
        keyPair: ['measure_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-id',
      },
      // has indicator
      'indicator-reference': {
        type: 'text',
        table: API.ACTION_INDICATORS,
        lookup: {
          table: API.INDICATORS,
          attribute: 'reference',
        },
        keyPair: ['measure_id', 'indicator_id'], // own, other
        hintMessage: 'importHints.indicator-reference',
      },
      // has indicator
      'indicator-id': {
        type: 'text',
        multiple: true,
        table: API.ACTION_INDICATORS,
        lookup: {
          table: API.INDICATORS,
        },
        keyPair: ['measure_id', 'indicator_id'], // own, other
        hintMessage: 'importHints.indicator-id',
      },
      // has recommendation
      'recommendation-reference': {
        type: 'text',
        table: API.RECOMMENDATION_ACTIONS,
        lookup: {
          table: API.RECOMMENDATIONS,
          attribute: 'reference',
        },
        keyPair: ['measure_id', 'recommendation_id'], // own, other
        hintMessage: 'importHints.recommendation-reference',
      },
      // has recommendation
      'recommendation-id': {
        type: 'text',
        multiple: true,
        table: API.RECOMMENDATION_ACTIONS,
        lookup: {
          table: API.RECOMMENDATIONS,
        },
        keyPair: ['measure_id', 'recommendation_id'], // own, other
        hintMessage: 'importHints.recommendation-id',
      },
    },
  },
  indicators: {
    ATTRIBUTES: {
      draft: {
        defaultValue: true,
        type: 'bool',
        skipImport: true,
        exportRequired: true,
        roleExport: USER_ROLES.CONTRIBUTOR.value,
        exportColumn: 'public',
        exportFlip: true,
      },
      reference: {
        type: 'text',
        required: true,
        import: true,
        unique: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
        required: true,
      },
      description: {
        type: 'markdown',
      },
      start_date: {
        type: 'date',
      },
      end_date: {
        type: 'date',
      },
      frequency_months: {
        type: 'number',
        options: REPORT_FREQUENCIES,
      },
      repeat: {
        defaultValue: false,
        type: 'bool',
      },
      created_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      created_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'created_by',
      },
      updated_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      updated_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'updated_by',
      },
      relationship_updated_at: {
        skipImport: true,
        type: 'datetime',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_at',
      },
      relationship_updated_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_by',
      },
    },
    CONNECTIONS: {
      actions: {
        table: API.ACTIONS,
        connection: API.ACTION_INDICATORS,
      },
      recommendations: {
        table: API.RECOMMENDATIONS,
        connection: API.RECOMMENDATION_INDICATORS,
        groupby: {
          table: API.FRAMEWORKS,
          on: 'framework_id',
        },
      },
    },
    RELATIONSHIPS_IMPORT: {
      // has action
      'action-reference': {
        type: 'text',
        table: API.ACTION_INDICATORS,
        lookup: {
          table: API.ACTIONS,
          attribute: 'reference',
        },
        keyPair: ['indicator_id', 'measure_id'], // own, other
        hintMessage: 'importHints.action-reference',
      },
      // has action
      'action-id': {
        type: 'text',
        multiple: true,
        table: API.ACTION_INDICATORS,
        lookup: {
          table: API.ACTIONS,
        },
        keyPair: ['indicator_id', 'measure_id'], // own, other
        hintMessage: 'importHints.action-id',
      },
    },
  },
  recommendations: {
    ATTRIBUTES: {
      framework_id: {
        defaultValue: '1',
        required: true, // all types
        type: 'number',
        table: API.FRAMEWORKS,
        exportColumn: 'framework',
        export: true,
        skipImport: true,
      },
      draft: {
        defaultValue: true,
        type: 'bool',
        skipImport: true,
        exportRequired: true,
        roleExport: USER_ROLES.CONTRIBUTOR.value,
        exportColumn: 'public',
        exportFlip: true,
      },
      reference: {
        type: 'text',
        required: true,
        import: true,
        unique: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
        required: true,
        import: true,
      },
      description: {
        type: 'markdown',
        label: 'fullRecommendation',
        import: true,
      },
      response: {
        type: 'markdown',
        import: true,
      },
      support_level: {
        type: 'number',
        import: true,
        options: SUPPORT_LEVELS,
      },
      created_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      created_by_id: {
        skipImport: true,
        type: 'key',
        table: API.USERS,
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'created_by',
      },
      updated_at: {
        skipImport: true,
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
      },
      updated_by_id: {
        skipImport: true,
        type: 'key',
        table: API.USERS,
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'updated_by',
      },
      relationship_updated_at: {
        skipImport: true,
        type: 'datetime',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_at',
      },
      relationship_updated_by_id: {
        skipImport: true,
        type: 'key',
        table: API.USERS,
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'connection_updated_by',
      },
    },
    CONNECTIONS: {
      categories: {
        table: API.CATEGORIES,
        connection: API.RECOMMENDATION_CATEGORIES,
        groupby: {
          table: API.TAXONOMIES,
          on: 'taxonomy_id',
        },
      },
      actions: {
        table: API.ACTIONS,
        connection: API.RECOMMENDATION_ACTIONS,
      },
      indicators: {
        table: API.INDICATORS,
        connection: API.RECOMMENDATION_INDICATORS,
      },
    },
    RELATIONSHIPS_IMPORT: {
      // has category
      'category-reference': {
        type: 'text',
        table: API.RECOMMENDATION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'reference',
        },
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-reference',
      },
      'category-short-title': {
        type: 'text',
        table: API.RECOMMENDATION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'short_title',
        },
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-short-title',
      },
      // has category
      'category-id': {
        type: 'number',
        table: API.RECOMMENDATION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
        },
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hintMessage: 'importHints.category-id',
      },
      'action-reference': {
        type: 'text',
        table: API.RECOMMENDATION_ACTIONS,
        lookup: {
          table: API.ACTIONS,
          attribute: 'reference',
        },
        keyPair: ['recommendation_id', 'measure_id'], // own, other
        hintMessage: 'importHints.action-reference',
      },
      'action-id': {
        type: 'text',
        multiple: true,
        table: API.RECOMMENDATION_ACTIONS,
        lookup: {
          table: API.ACTIONS,
        },
        keyPair: ['recommendation_id', 'measure_id'], // own, other
        hintMessage: 'importHints.action-id',
      },
    },
  },
};

export const KEEP_QUERY_ARGS = ['fw', 'loadNonCurrent', 'loadArchived'];

export const SETTINGS = {
  loadNonCurrent: {
    available: null,
    value: false,
  },
  loadArchived: { // key also query arg
    available: null, // will only be set once, once data is loaded
    value: false, // default value
    minRole: SEE_ARCHIVED_MIN_ROLE,
  },
};

export const IGNORE_ROW_TAG = '[ignore-row]';
