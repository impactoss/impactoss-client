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
export const SORT_ORDER_OPTIONS = [
  { value: 'asc', icon: 'ascending', nextValue: 'desc', message: 'ui.sortOrderOptions.asc' },
  { value: 'desc', icon: 'descending', nextValue: 'asc', message: 'ui.sortOrderOptions.desc' },
];
export const PARAMS = {
  GROUP_RESET: '0',
  REDIRECT_ON_AUTH_SUCCESS: 'redirectOnAuthSuccess',
  RECOVER_SUCCESS: 'recoverSuccess',
  ALREADY_SIGNED_IN: 'alreadySignedIn',
  NOT_SIGNED_IN: 'notSignedIn',
};

export const VIEWPORTS = {
  MOBILE: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
};

export const PATHS = {
  ID: '/:id',
  NEW: '/new',
  EDIT: '/edit',
  IMPORT: '/import',
  PASSWORD: '/password',
  OVERVIEW: '/overview',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  RESET_PASSWORD: '/resetpassword',
  RECOVER_PASSWORD: '/recoverpassword',
  UNAUTHORISED: '/unauthorised',
  USERS: '/users',
  MEASURES: '/actions',
  INDICATORS: '/indicators',
  SDG_TARGETS: '/sdgtargets',
  RECOMMENDATIONS: '/recommendations',
  PROGRESS_REPORTS: '/reports',
  TAXONOMIES: '/categories',
  CATEGORIES: '/category',
  PAGES: '/pages',
  SEARCH: '/search',
};
