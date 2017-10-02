/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en-GB';
export const DB_DATE_FORMAT = 'YYYY-MM-DD';
export const SHOW_FOOTER_LOGOS = true;

// map server error messages
export const RECORD_OUTDATED = 'Record outdated';
export const EMAIL_FORMAT = 'Email: is not an email';
export const PASSWORD_MISMATCH = 'Password confirmation doesn\'t match Password';
export const PASSWORD_SHORT = 'Password is too short (minimum is 6 characters)';
export const PASSWORD_INVALID = 'Current password is invalid';

export const REDIRECT_IF_NOT_PERMITTED = 'impactoss/App/REDIRECT_IF_NOT_PERMITTED';
export const LOAD_ENTITIES_IF_NEEDED = 'impactoss/App/LOAD_ENTITIES_IF_NEEDED';
export const LOADING_ENTITIES = 'impactoss/App/LOADING_ENTITIES';
export const LOAD_ENTITIES_SUCCESS = 'impactoss/App/LOAD_ENTITIES_SUCCESS';
export const LOAD_ENTITIES_ERROR = 'impactoss/App/LOAD_ENTITIES_ERROR';
export const ENTITIES_REQUESTED = 'impactoss/App/ENTITIES_REQUESTED';
export const INVALIDATE_ENTITIES = 'impactoss/App/INVALIDATE_ENTITIES';
export const RESET_PROGRESS = 'impactoss/App/RESET_PROGRESS';

export const AUTHENTICATE_SENDING = 'impactoss/App/AUTHENTICATE_SENDING';
export const AUTHENTICATE = 'impactoss/App/AUTHENTICATE';
export const RESET_PASSWORD = 'impactoss/App/RESET_PASSWORD';
export const RECOVER_PASSWORD = 'impactoss/App/RECOVER_PASSWORD';
export const AUTHENTICATE_SUCCESS = 'impactoss/App/AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_ERROR = 'impactoss/App/AUTHENTICATE_ERROR';
export const SET_AUTHENTICATION_STATE = 'impactoss/App/SET_AUTHENTICATION_STATE';
export const LOGOUT = 'impactoss/App/LOGOUT';
export const LOGOUT_SUCCESS = 'impactoss/App/LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'impactoss/App/LOGOUT_ERROR';
export const VALIDATE_TOKEN = 'impactoss/App/VALIDATE_TOKEN';
export const AUTHENTICATE_FORWARD = 'impactoss/App/AUTHENTICATE_FORWARD';

export const ADD_ENTITY = 'impactoss/App/ADD_ENTITY';
export const UPDATE_ENTITY = 'impactoss/App/UPDATE_ENTITY';
export const REMOVE_ENTITY = 'impactoss/App/REMOVE_ENTITY';
export const UPDATE_ENTITIES = 'impactoss/App/UPDATE_ENTITIES';
export const UPDATE_CONNECTIONS = 'impactoss/App/UPDATE_CONNECTIONS';

export const SAVE_ENTITY = 'impactoss/App/SAVE_ENTITY';
export const NEW_ENTITY = 'impactoss/App/NEW_ENTITY';
export const DELETE_ENTITY = 'impactoss/App/DELETE_ENTITY';
export const SAVE_CONNECTIONS = 'impactoss/App/SAVE_CONNECTIONS';
export const SAVE_ENTITIES = 'impactoss/App/SAVE_ENTITIES';
export const DUEDATE_ASSIGNED = 'impactoss/App/DUEDATE_ASSIGNED';
export const DUEDATE_UNASSIGNED = 'impactoss/App/DUEDATE_UNASSIGNED';

export const ENTITIES_READY = 'impactoss/App/ENTITIES_READY';

export const SAVE_SENDING = 'impactoss/App/SAVE_SENDING';
export const SAVE_SUCCESS = 'impactoss/App/SAVE_SUCCESS';
export const SAVE_ERROR = 'impactoss/App/SAVE_ERROR';
export const SAVE_ERROR_DISMISS = 'impactoss/App/SAVE_ERROR_DISMISS';

export const DELETE_SENDING = 'impactoss/App/DELETE_SENDING';
export const DELETE_SUCCESS = 'impactoss/App/DELETE_SUCCESS';
export const DELETE_ERROR = 'impactoss/App/DELETE_ERROR';

export const RECOVER_SENDING = 'impactoss/App/RECOVER_SENDING';
export const RECOVER_SUCCESS = 'impactoss/App/RECOVER_SUCCESS';
export const RECOVER_ERROR = 'impactoss/App/RECOVER_ERROR';

export const UPDATE_ROUTE_QUERY = 'impactoss/App/UPDATE_ROUTE_QUERY';
export const UPDATE_PATH = 'impactoss/App/UPDATE_PATH';

export const SAVE_ENTITY_FORM = 'impactoss/App/SAVE_ENTITY_FORM';
export const UPDATE_ENTITY_FORM = 'impactoss/App/UPDATE_ENTITY_FORM';

export const CLOSE_ENTITY = 'impactoss/App/CLOSE_ENTITY';

export const OPEN_NEW_ENTITY_MODAL = 'impactoss/App/OPEN_NEW_ENTITY_MODAL';
export const SUBMIT_INVALID = 'impactoss/App/SUBMIT_INVALID';

export const DISMISS_QUERY_MESSAGES = 'impactoss/App/DISMISS_QUERY_MESSAGES';

export const PUBLISH_STATUSES = [
  { value: true, label: 'Draft' },
  { value: false, label: 'Public' },
];
export const ACCEPTED_STATUSES = [
  { value: true, label: 'Accepted', icon: 'recommendationAccepted' },
  { value: false, label: 'Noted', icon: 'recommendationNoted' },
];
export const REPORT_FREQUENCIES = [
  { value: 1, label: 'Monthly' },
  { value: 3, label: 'Quarterly' },
  { value: 6, label: 'Semiannual' },
  { value: 12, label: 'Annual' },
];

export const DOC_PUBLISH_STATUSES = [
  { value: true, label: 'Public' },
  { value: false, label: 'Private' },
];

export const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending', icon: 'ascending', nextValue: 'desc' },
  { value: 'desc', label: 'Descending', icon: 'descending', nextValue: 'asc' },
];

export const USER_ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  CONTRIBUTOR: 3,
};

export const PAGE_ITEM_OPTIONS = [10, 20, 50, 100];

export const FILTERS_PANEL = 'filters';
export const EDIT_PANEL = 'edit';

export const CONTENT_LIST = 'list';
export const CONTENT_SINGLE = 'single';
export const CONTENT_PAGE = 'page';
export const CONTENT_MODAL = 'modal';

export const DEPENDENCIES = [
  'user_roles',
  'pages',
];

export const PARAMS = {
  GROUP_RESET: 'OFF',
};

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
//
// export const DB_SCHEMA = {
//   categories: {
//     attributes: {
//       title: {
//         type: 'string',
//         required: true,
//       },
//       reference: 'string',
//       short_title: 'string',
//       description: 'string',
//       url: 'string',
//       taxonomy_id: 'number',
//       manager_id: 'number',
//       user_only: 'bool',
//     },
//     many: {
//       recommendation_categories: 'category_id',
//       measure_categories: 'category_id',
//       user_categories: 'category_id',
//       sdgtarget_categories: 'category_id',
//       recommendations: { via: 'recommendation_categories' },
//       measures: { via: 'measure_categories' },
//       sdgtargets: { via: 'sdgtarget_categories' },
//       users: { via: 'user_categories' },
//     },
//     one: {
//       taxonomies: {
//         fk: 'taxonomy_id',
//         as: 'taxonomy',
//       },
//       users: {
//         fk: 'manager_id',
//         as: 'manager',
//       },
//     },
//   },
//   taxonomies: {
//     attributes: {
//       title: {
//         type: 'string',
//         required: true,
//       },
//       tags_recommendations: 'bool',
//       tags_measures: 'bool',
//       tags_sdgtargets: 'bool',
//       tags_users: 'bool',
//       is_smart: 'bool',
//       allow_multiple: 'bool',
//       priority: 'number',
//       grouping_default: 'number',
//     },
//     many: {
//       categories: 'taxonomy_id',
//     },
//   },
//   recommendations: {
//     attributes: {
//       reference: {
//         type: 'string',
//         required: true,
//       },
//       title: {
//         type: 'string',
//         required: true,
//       },
//       response: {
//         type: 'string',
//         required: true,
//       },
//       draft: 'bool',
//       accepted: 'bool',
//     },
//     many: {
//       recommendation_categories: 'recommendation_id',
//       recommendation_measures: 'recommendation_id',
//       measures: { via: 'recommendation_measures' },
//       categories: { via: 'recommendation_categories' },
//     },
//   },
//   sdgtargets: {
//     attributes: {
//       reference: 'string',
//       title: {
//         type: 'string',
//         required: true,
//       },
//       description: 'string',
//       draft: 'bool',
//     },
//     many: {
//       sdgtarget_categories: 'sdgtarget_id',
//       sdgtarget_indicators: 'sdgtarget_id',
//       sdgtarget_measures: 'sdgtarget_id',
//       measures: { via: 'sdgtarget_measures' },
//       categories: { via: 'recommendationsdgtarget_categories_categories' },
//       indicators: { via: 'sdgtarget_indicators' },
//     },
//   },
//   measures: {
//     attributes: {
//       title: {
//         type: 'string',
//         required: true,
//       },
//       description: 'string',
//       draft: 'bool',
//       target_date: 'string',
//       outcome: 'string',
//       indicator_summary: 'string',
//       target_date_comment: 'string',
//     },
//     many: {
//       measure_categories: 'measure_id',
//       measure_indicators: 'measure_id',
//       sdgtarget_measures: 'measure_id',
//       recommendation_measures: 'measure_id',
//       categories: { via: 'measure_categories' },
//       recommendations: { via: 'recommendation_measures' },
//       sdgtargets: { via: 'sdgtarget_measures' },
//       indicators: { via: 'measure_indicators' },
//     },
//   },
//   indicators: {
//     attributes: {
//       reference: 'string',
//       title: {
//         type: 'string',
//         required: true,
//       },
//       description: 'string',
//       draft: 'bool',
//       manager_id: 'number',
//       frequency_months: 'number',
//       repeat: 'bool',
//       start_date: 'date',
//       end_date: 'date',
//     },
//     one: {
//       users: {
//         fk: 'manager_id',
//         as: 'manager',
//       },
//     },
//     many: {
//       due_dates: 'indicator_id',
//       progress_reports: 'indicator_id',
//       measure_indicators: 'indicator_id',
//       sdgtarget_indicators: 'indicator_id',
//       sdgtargets: { via: 'sdgtarget_indicators' },
//       measures: { via: 'measure_indicators' },
//     },
//   },
//   progress_reports: {
//     attributes: {
//       title: {
//         type: 'string',
//         required: true,
//       },
//       indicator_id: 'number',
//       due_date_id: 'number',
//       description: 'string',
//       document_url: 'string',
//       document_public: 'bool',
//       draft: 'bool',
//     },
//     one: {
//       indicators: {
//         fk: 'indicator_id',
//         as: 'indicator',
//       },
//       due_dates: {
//         fk: 'due_date_id',
//         as: 'indicator',
//       },
//     },
//   },
//   due_dates: {
//     attributes: {
//       indicator_id: 'number',
//       due_date: 'date',
//       draft: 'bool',
//     },
//     one: {
//       indicators: {
//         fk: 'indicator_id',
//         as: 'indicator',
//       },
//     },
//     many: {
//       progress_reports: 'due_date_id',
//     },
//   },
//   pages: {
//     attributes: {
//       title: {
//         type: 'string',
//         required: true,
//       },
//       content: 'string',
//       menu_title: 'string',
//       order: 'number',
//     },
//   },
//   roles: {
//     attributes: {
//       name: {
//         type: 'string',
//         required: true,
//       },
//       friendly_name: {
//         type: 'string',
//         required: true,
//       },
//     },
//     many: {
//       user_roles: 'role_id',
//     },
//   },
//   users: {
//     attributes: {
//       name: {
//         type: 'string',
//         required: true,
//       },
//       email: {
//         type: 'string',
//         required: true,
//       },
//       provider: {
//         type: 'string',
//         required: true,
//       },
//     },
//     many: {
//       user_roles: 'user_id',
//       user_categories: 'user_id',
//     },
//   },
//   recommendation_categories: {
//     attributes: {
//       recommendation_id: 'number',
//       category_id: 'number',
//     },
//     one: {
//       recommendations: {
//         fk: 'recommendation_id',
//         as: 'recommendation',
//       },
//       categories: {
//         fk: 'category_id',
//         as: 'category',
//       },
//     },
//   },
//   sdgtarget_categories: {
//     attributes: {
//       sdgtarget_id: 'number',
//       category_id: 'number',
//     },
//     one: {
//       sdgtargets: {
//         fk: 'sdgtarget_id',
//         as: 'sdgtarget',
//       },
//       categories: {
//         fk: 'category_id',
//         as: 'category',
//       },
//     },
//   },
//   measure_categories: {
//     attributes: {
//       measure_id: 'number',
//       category_id: 'number',
//     },
//     one: {
//       measures: {
//         fk: 'measure_id',
//         as: 'measure',
//       },
//       categories: {
//         fk: 'category_id',
//         as: 'category',
//       },
//     },
//   },
//   user_categories: {
//     attributes: {
//       user_id: 'number',
//       category_id: 'number',
//     },
//     one: {
//       users: {
//         fk: 'user_id',
//         as: 'user',
//       },
//       categories: {
//         fk: 'category_id',
//         as: 'category',
//       },
//     },
//   },
//   user_roles: {
//     attributes: {
//       user_id: 'number',
//       role_id: 'number',
//     },
//     one: {
//       users: {
//         fk: 'user_id',
//         as: 'user',
//       },
//       roles: {
//         fk: 'role_id',
//         as: 'role',
//       },
//     },
//   },
//   recommendation_measures: {
//     attributes: {
//       measure_id: 'number',
//       recommendation_id: 'number',
//     },
//     one: {
//       measures: {
//         fk: 'measure_id',
//         as: 'measure',
//       },
//       recommendations: {
//         fk: 'recommendation_id',
//         as: 'recommendation',
//       },
//     },
//   },
//   sdgtarget_measures: {
//     attributes: {
//       measure_id: 'number',
//       sdgtarget_id: 'number',
//     },
//     one: {
//       sdgtarget: {
//         fk: 'sdgtarget_id',
//         as: 'sdgtarget',
//       },
//       measures: {
//         fk: 'measure_id',
//         as: 'measure',
//       },
//     },
//   },
//   sdgtarget_indicators: {
//     attributes: {
//       sdgtarget_id: 'number',
//       indicator_id: 'number',
//     },
//     one: {
//       sdgtarget: {
//         fk: 'sdgtarget_id',
//         as: 'sdgtarget',
//       },
//       indicators: {
//         fk: 'indicator_id',
//         as: 'indicator',
//       },
//     },
//   },
//   measure_indicators: {
//     attributes: {
//       measure_id: 'number',
//       indicator_id: 'number',
//     },
//     one: {
//       measures: {
//         fk: 'measure_id',
//         as: 'measure',
//       },
//       indicators: {
//         fk: 'indicator_id',
//         as: 'indicator',
//       },
//     },
//   },
// };

// TODO need to pull from an env file
export const API_ENDPOINT = 'https://undp-sadata-staging.herokuapp.com';
// export const API_ENDPOINT = 'https://sadata-production.herokuapp.com';
export const SIGNING_URL_ENDPOINT = '/s3/sign';
