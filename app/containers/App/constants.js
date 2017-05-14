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

export const DEFAULT_LOCALE = 'en';

export const REDIRECT_IF_NOT_PERMITTED = 'nmrf/App/REDIRECT_IF_NOT_PERMITTED';
export const LOAD_ENTITIES_IF_NEEDED = 'nmrf/App/LOAD_ENTITIES_IF_NEEDED';
export const LOADING_ENTITIES = 'nmrf/App/LOADING_ENTITIES';
export const LOAD_ENTITIES_SUCCESS = 'nmrf/App/LOAD_ENTITIES_SUCCESS';
export const LOAD_ENTITIES_ERROR = 'nmrf/App/LOAD_ENTITIES_ERROR';
export const ENTITIES_REQUESTED = 'nmrf/App/ENTITIES_REQUESTED';
export const INVALIDATE_ENTITIES = 'nmrf/App/INVALIDATE_ENTITIES';

export const AUTHENTICATE_SENDING = 'nmrf/App/AUTHENTICATE_SENDING';
export const AUTHENTICATE = 'nmrf/App/AUTHENTICATE';
export const RESET_PASSWORD = 'nmrf/App/RESET_PASSWORD';
export const RECOVER_PASSWORD = 'nmrf/App/RECOVER_PASSWORD';
export const AUTHENTICATE_SUCCESS = 'nmrf/App/AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_ERROR = 'nmrf/App/AUTHENTICATE_ERROR';
export const SET_AUTHENTICATION_STATE = 'nmrf/App/SET_AUTHENTICATION_STATE';
export const LOGOUT = 'nmrf/App/LOGOUT';
export const LOGOUT_SUCCESS = 'nmrf/App/LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'nmrf/App/LOGOUT_ERROR';
export const VALIDATE_TOKEN = 'nmrf/App/VALIDATE_TOKEN';
export const AUTHENTICATE_FORWARD = 'nmrf/App/AUTHENTICATE_FORWARD';

export const ADD_ENTITY = 'nmrf/App/ADD_ENTITY';
export const UPDATE_ENTITY = 'nmrf/App/UPDATE_ENTITY';
export const DELETE_ENTITY = 'nmrf/App/DELETE_ENTITY';

export const SAVE_ENTITY = 'nmrf/App/SAVE_ENTITY';
export const NEW_ENTITY = 'nmrf/App/NEW_ENTITY';
export const UPDATE_CONNECTIONS = 'nmrf/App/UPDATE_CONNECTIONS';
export const UPDATE_ENTITIES = 'nmrf/App/UPDATE_ENTITIES';
export const DUEDATE_ASSIGNED = 'nmrf/App/DUEDATE_ASSIGNED';
export const DUEDATE_UNASSIGNED = 'nmrf/App/DUEDATE_UNASSIGNED';

export const ENTITIES_READY = 'nmrf/App/ENTITIES_READY';

export const SAVE_SENDING = 'nmrf/App/SAVE_SENDING';
export const SAVE_SUCCESS = 'nmrf/App/SAVE_SUCCESS';
export const SAVE_ERROR = 'nmrf/App/SAVE_ERROR';

export const UPDATE_ROUTE_QUERY = 'nmrf/App/UPDATE_ROUTE_QUERY';
export const UPDATE_PATH = 'nmrf/App/UPDATE_PATH';

export const SAVE_ENTITY_FORM = 'nmrf/App/SAVE_ENTITY_FORM';
export const UPDATE_ENTITY_FORM = 'nmrf/App/UPDATE_ENTITY_FORM';

export const PUBLISH_STATUSES = [
  { value: true, label: 'Draft' },
  { value: false, label: 'Public' },
];

export const DOC_PUBLISH_STATUSES = [
  { value: true, label: 'Public' },
  { value: false, label: 'Private' },
];

export const USER_ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  CONTRIBUTOR: 3,
};

export const FILTERS_PANEL = 'filters';
export const EDIT_PANEL = 'edit';

export const CONTENT_LIST = 'list';
export const CONTENT_SINGLE = 'single';

// TODO need to pull from an env file
export const API_ENDPOINT = 'https://undp-sadata-staging.herokuapp.com';
export const SIGNING_URL_ENDPOINT = '/s3/sign';
