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
import packageJson from '../../package.json';

export const SERVER = (process && process.env && process.env.SERVER) || 'development';
const SERVER_ENDPOINTS = {
  production: 'https://sg-api-dev.impactoss.org/',
  UAT: 'https://sg-api-dev.impactoss.org/',
  development: 'https://sg-api-dev.impactoss.org/',
};
export const SERVER_ENDPOINT = SERVER_ENDPOINTS[SERVER];
// used for redirect and canonical tag

export const CLIENT_URL = 'https://impactoss-sg-dev.web.app';
export const IS_PROD = SERVER === 'production';
export const IS_TEST = SERVER === 'UAT';
// const IS_DEV = SERVER === 'development';
const version_text = IS_PROD ? '' : ` [${SERVER}]`;
export const VERSION = `${packageJson.version}${version_text}`;

// enable azure for test and prod environments but not for dev
export const ENABLE_AZURE = false; // IS_PROD || IS_TEST;

// default language locale
export const DEFAULT_LOCALE = 'en-GB';
// date format - change to format according to locale, only used for form error message
export const DATE_FORMAT = 'dd/MM/yyyy';
// database date format
export const API_DATE_FORMAT = 'yyyy-MM-dd';

export const NODE_ENV = sessionStorage.NODE_ENV || 'production';

export const FEATURES = {
  measures: false,
  indicators: false,
  progress_reports: false,
  sdgs: false,
};

// UI settings ************************

// show app title and claim in header when not included in graphic
// set in translations/[LOCALE].js
// - app.containers.App.app.title
// - app.containers.App.app.claim
export const SHOW_HEADER_TITLE = true;
export const SHOW_HEADER_LOGO = false;

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
export const SHOW_HOME_TITLE_OR_CLAIM = true;
export const SHOW_HOME_TITLE = false;
export const SHOW_HEADER_SHADOW_ON_HOME = false;

export const SHOW_BRAND_ON_HOME = true;
export const HOME_GRAPHIC_WIDTH = 1200;
export const SHOW_HEADER_PATTERN_HOME_GRAPHIC = true;

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

export const CYCLE_TAXONOMY_ID = 2;
export const PROGRESS_TAXONOMY_ID = null;
// categories where "is_current" is relevant
export const CURRENT_TAXONOMY_IDS = [
  2, // reporting cycles
];

// WARNING: references as assigned by user
export const PROGRESS_CATEGORY_ID = {
  COMPLETED: null,
};


/**
 * Server settings
 * */

// General ********************

export const ENDPOINTS = {
  API: SERVER_ENDPOINTS[SERVER], // server API endpoint
  // SIGNING_URL: 's3/sign', // server AWS S3 signing url endpoint
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
export const IS_CURRENT_STATUSES_FILTER = [
  { value: true, message: 'ui.currentStatuses.currentOrNA' },
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

// set to min role required or null to disable
export const DELETE_MIN_ROLE = null;
export const PAGE_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value;
export const USER_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value;
export const CATEGORY_MANAGER_MIN_ROLE = USER_ROLES.MANAGER.value; // can be assigned to category
export const CONTRIBUTOR_MIN_ROLE = USER_ROLES.MANAGER.value; // edit or create
export const CATEGORY_ADMIN_MIN_ROLE = USER_ROLES.ADMIN.value; // can edit or create categories
export const CONTRIBUTOR_MIN_ROLE_PUBLISH = USER_ROLES.CONTRIBUTOR.value; // publish
export const CONTRIBUTOR_MIN_ROLE_ASSIGNED = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_DRAFT_MIN_ROLE = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_ARCHIVED_MIN_ROLE = USER_ROLES.CONTRIBUTOR.value; // edit or create when assigned
export const SEE_META_MIN_ROLE = USER_ROLES.MANAGER.value; // edit or create when assigned
export const ARCHIVE_MIN_ROLE = USER_ROLES.ADMIN.value; // archive content


export const PERMISSIONS = {
  user: {
    updateEmail: false, // or min role
  },
};

export const COLUMN_WIDTHS = {
  FULL: 1,
  HALF: 0.5,
  MAIN: 0.72,
  OTHER: 0.28,
};

export const SEARCH = {
  MIN_LENGTH: 1,
};

export const API = {
  USERS: 'users',
  USER_ROLES: 'user_roles',
  ROLES: 'roles',
  PAGES: 'pages',
  BOOKMARKS: 'bookmarks',
  TAXONOMIES: 'taxonomies',
  CATEGORIES: 'categories',
  // INDICATORS: 'indicators', // actions/ACTIONS
  // ACTION_CATEGORIES: 'measure_categories', // measure_categories
  // ACTION_INDICATORS: 'measure_indicators', // linking actions with indicators
  // ACTIONS: 'measures', // actions/ACTIONS
  RECOMMENDATION_CATEGORIES: 'recommendation_categories',
  // RECOMMENDATION_ACTIONS: 'recommendation_measures',
  RECOMMENDATIONS: 'recommendations',
  USER_CATEGORIES: 'user_categories',
  // PROGRESS_REPORTS: 'progress_reports',
  // DUE_DATES: 'due_dates',
  FRAMEWORKS: 'frameworks',
  FRAMEWORK_TAXONOMIES: 'framework_taxonomies',
  // RECOMMENDATION_INDICATORS: 'recommendation_indicators',
};


// Map server database tables **************************
export const DB_TABLES = Object.values(API);

export const DB_TABLES_CURRENT = [
  // API.INDICATORS,
  // API.ACTIONS,
  API.RECOMMENDATIONS,
];
export const DB_TABLES_ARCHIVED = [
  API.USERS,
  API.PAGES,
  API.CATEGORIES,
  // API.INDICATORS,
  // API.ACTIONS,
  API.RECOMMENDATIONS,
];

export const ENTITY_FIELDS = {
  measures: {
    ATTRIBUTES: {
      draft: {
        defaultValue: true,
        type: 'bool',
        skipImport: true,
        exportRequired: true,
        roleExport: USER_ROLES.CONTRIBUTOR.value,
      },
      reference: {
        type: 'text',
        required: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
      },
      description: {
        type: 'markdown',
      },
      outcome: {
        type: 'markdown',
      },
      indicator_summary: {
        type: 'markdown',
      },
      target_date: {
        type: 'date',
      },
      target_date_comment: {
        type: 'text',
      },
      created_at: {
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
        skipImport: true,
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
    RELATIONSHIPS_IMPORT: {
      // column: recommendation-id
      'recommendation-id': {
        type: 'number',
        multiple: true,
        table: API.RECOMMENDATION_ACTIONS,
        lookup: {
          table: API.RECOMMENDATIONS, // id assumed
        },
        keyPair: ['measure_id', 'recommendation_id'], // own, other
        hint: 'one or more unique recommendation ids (as assigned by the database / comma-separated)',
      },
      // column: country-code
      'recommendation-reference': {
        type: 'text',
        lookup: {
          table: API.RECOMMENDATIONS, // id assumed
          attribute: 'reference',
        },
        multiple: true,
        table: API.RECOMMENDATION_ACTIONS,
        keyPair: ['measure_id', 'recommendation_id'], // own, other
        hint: 'one or more unique recommendation references (as assigned by the users / comma-separated)',
      },
      // column: indicator-id
      'indicator-id': {
        type: 'number',
        multiple: true,
        lookup: {
          table: API.INDICATORS, // id assumed
        },
        table: API.ACTION_INDICATORS,
        keyPair: ['measure_id', 'indicator_id'], // own, other
        hint: 'one or more unique indicator ids (as assigned by the database / comma-separated)',
      },
      // column: country-code
      'indicator-reference': {
        type: 'text',
        lookup: {
          table: API.INDICATORS, // id assumed
          attribute: 'reference',
        },
        multiple: true,
        table: API.ACTION_INDICATORS,
        keyPair: ['measure_id', 'indicator_id'], // own, other
        hint: 'one or more unique indicator references (as assigned by the users / comma-separated)',
      },
      // has category
      'category-id': {
        type: 'number',
        table: API.ACTION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
        },
        keyPair: ['measure_id', 'category_id'], // own, other
        hint: 'one or more category ids (as assigned by the database / comma-separated)',
      },
      // has category
      'category-short-title': {
        type: 'text',
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'short_title',
        },
        table: API.ACTION_CATEGORIES,
        keyPair: ['measure_id', 'category_id'], // own, other
        hint: 'one or more category short codes (as assigned by the users / comma-separated)',
      },
      // has category
      'category-reference': {
        type: 'text',
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'reference',
        },
        table: API.ACTION_CATEGORIES,
        keyPair: ['measure_id', 'category_id'], // own, other
        hint: 'one or more category references (as assigned by the users / comma-separated)',
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
      },
      reference: {
        type: 'text',
        required: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
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
      },
      repeat: {
        defaultValue: false,
        type: 'bool',
      },
      created_at: {
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
        skipImport: true,
      },
      created_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'created_by',
      },
      updated_at: {
        type: 'date',
        skipImport: true,
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
    RELATIONSHIPS_IMPORT: {
      // column: recommendation-id
      'action-id': {
        type: 'number',
        multiple: true,
        table: API.ACTION_INDICATORS,
        lookup: {
          table: API.ACTIONS, // id assumed
        },
        keyPair: ['indicator_id', 'measure_id'], // own, other
        hint: 'one or more unique action ids (as assigned by the database / comma-separated)',
      },
      // column: country-code
      'action-reference': {
        type: 'text',
        lookup: {
          table: API.ACTIONS, // id assumed
          attribute: 'reference',
        },
        multiple: true,
        table: API.ACTION_INDICATORS,
        keyPair: ['indicator_id', 'measure_id'], // own, other
        hint: 'one or more unique action references (as assigned by the users / comma-separated)',
      },
      // column: indicator-id
      'recommendation-id': {
        type: 'number',
        multiple: true,
        lookup: {
          table: API.RECOMMENDATIONS, // id assumed
        },
        table: API.RECOMMENDATION_INDICATORS,
        keyPair: ['indicator_id', 'recommendation_id'], // own, other
        hint: 'one or more unique indicator ids (as assigned by the database / comma-separated)',
      },
      // column: country-code
      'recommendation-reference': {
        type: 'text',
        lookup: {
          table: API.RECOMMENDATIONS, // id assumed
          attribute: 'reference',
        },
        multiple: true,
        table: API.RECOMMENDATION_INDICATORS,
        keyPair: ['indicator_id', 'recommendation_id'], // own, other
        hint: 'one or more unique recommendation references (as assigned by the users / comma-separated)',
      },
    },
  },
  recommendations: {
    ATTRIBUTES: {
      draft: {
        defaultValue: true,
        type: 'bool',
        skipImport: true,
        exportRequired: true,
        roleExport: USER_ROLES.CONTRIBUTOR.value,
      },
      framework_id: {
        type: 'number',
        required: true,
        import: true,
        skipImport: true,
      },
      reference: {
        type: 'text',
        required: true,
      },
      title: {
        type: 'text',
        exportDefault: true,
      },
      description: {
        type: 'markdown',
      },
      // response: {
      //   type: 'markdown',
      //   type: 'text',
      // },
      // support_level: {
      //   type: 'number',
      // },
      created_at: {
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
        skipImport: true,
      },
      created_by_id: {
        skipImport: true,
        type: 'key',
        table: 'users',
        roleExport: USER_ROLES.MANAGER.value,
        exportColumn: 'created_by',
      },
      updated_at: {
        type: 'date',
        roleExport: USER_ROLES.MANAGER.value,
        skipImport: true,
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
    RELATIONSHIPS_IMPORT: {
      // column: recommendation-id
      // 'action-id': {
      //   type: 'number',
      //   multiple: true,
      //   table: API.RECOMMENDATION_ACTIONS,
      //   lookup: {
      //     table: API.ACTIONS, // id assumed
      //   },
      //   keyPair: ['recommendation_id', 'measure_id'], // own, other
      //   hint: 'one or more unique action ids (as assigned by the database / comma-separated)',
      // },
      // // column: country-code
      // 'action-reference': {
      //   type: 'text',
      //   lookup: {
      //     table: API.ACTIONS, // id assumed
      //     attribute: 'reference',
      //   },
      //   multiple: true,
      //   table: API.RECOMMENDATION_ACTIONS,
      //   keyPair: ['recommendation_id', 'measure_id'], // own, other
      //   hint: 'one or more unique action references (as assigned by the users / comma-separated)',
      // },
      // // column: indicator-id
      // 'indicator-id': {
      //   type: 'number',
      //   multiple: true,
      //   lookup: {
      //     table: API.INDICATORS, // id assumed
      //   },
      //   table: API.RECOMMENDATION_INDICATORS,
      //   keyPair: ['recommendation_id', 'indicator_id'], // own, other
      //   hint: 'one or more unique indicator ids (as assigned by the database / comma-separated)',
      // },
      // // column: country-code
      // 'indicator-reference': {
      //   type: 'text',
      //   lookup: {
      //     table: API.INDICATORS, // id assumed
      //     attribute: 'reference',
      //   },
      //   multiple: true,
      //   table: API.RECOMMENDATION_INDICATORS,
      //   keyPair: ['recommendation_id', 'indicator_id'], // own, other
      //   hint: 'one or more unique indicator references (as assigned by the users / comma-separated)',
      // },
      // has category
      'category-id': {
        type: 'number',
        table: API.RECOMMENDATION_CATEGORIES,
        lookup: {
          table: API.CATEGORIES, // id assumed
        },
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hint: 'one or more category ids (as assigned by the database / comma-separated)',
      },
      // has category
      'category-short-title': {
        type: 'text',
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'short_title',
        },
        table: API.RECOMMENDATION_CATEGORIES,
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hint: 'one or more category short codes (as assigned by the users / comma-separated)',
      },
      // has category
      'category-reference': {
        type: 'text',
        lookup: {
          table: API.CATEGORIES, // id assumed
          attribute: 'reference',
        },
        table: API.RECOMMENDATION_CATEGORIES,
        keyPair: ['recommendation_id', 'category_id'], // own, other
        hint: 'one or more category references (as assigned by the users / comma-separated)',
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
