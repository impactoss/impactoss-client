/*
 * App Actions
 *
 * Actions change things in your application
 * Since this application uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  AUTHENTICATE_SENDING,
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  SET_AUTHENTICATION_STATE,
  LOAD_ENTITIES_IF_NEEDED,
  REDIRECT_IF_NOT_PERMITTED,
  LOADING_ENTITIES,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_ERROR,
  LOGOUT,
  LOGOUT_SUCCESS,
  VALIDATE_TOKEN,
  ENTITIES_REQUESTED,
  ENTITIES_READY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  NEW_ENTITY,
  SAVE_ENTITY,
  INVALIDATE_ENTITIES,
  SAVE_SENDING,
  SAVE_SUCCESS,
  SAVE_ERROR,
  UPDATE_CONNECTIONS,
  UPDATE_ENTITIES,
  UPDATE_ROUTE_QUERY,
  UPDATE_PATH,
  AUTHENTICATE_FORWARD,
  UPDATE_ENTITY_FORM,
  DUEDATE_ASSIGNED,
  DUEDATE_UNASSIGNED,
  RESET_PASSWORD,
  RECOVER_PASSWORD,
} from './constants';


export function saveSending() {
  return {
    type: SAVE_SENDING,
  };
}

export function saveSuccess() {
  return {
    type: SAVE_SUCCESS,
  };
}

export function saveError(error) {
  return {
    type: SAVE_ERROR,
    error,
  };
}

/**
 * Load the entities, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadEntitiesIfNeeded(path) {
  return {
    type: LOAD_ENTITIES_IF_NEEDED,
    path,
  };
}
export function redirectIfNotPermitted(role) {
  return {
    type: REDIRECT_IF_NOT_PERMITTED,
    role,
  };
}
/**
 * Load the entities, this action is fired when we being loading entities
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadingEntities(path) {
  return {
    type: LOADING_ENTITIES,
    path,
  };
}

/**
 * Dispatched when the entities are loaded by the request saga
 *
 * @param  {array} entities The entities data
 *
 * @return {object}      An action object with a type of LOAD_ENTITIES_SUCCESS passing the entities
 */
export function entitiesLoaded(entities, path, time) {
  return {
    type: LOAD_ENTITIES_SUCCESS,
    entities,
    path,
    time,
  };
}

/**
 * Dispatched when loading the entities fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_ENTITIES_ERROR passing the error
 */
export function entitiesLoadingError(error, path) {
  return {
    type: LOAD_ENTITIES_ERROR,
    error,
    path,
  };
}

export function addEntity(path, entity) {
  return {
    type: ADD_ENTITY,
    path,
    entity,
  };
}

export function updateEntity(path, entity) {
  return {
    type: UPDATE_ENTITY,
    path,
    entity,
  };
}


export function deleteEntity(path, id) {
  return {
    type: DELETE_ENTITY,
    path,
    id,
  };
}

export function saveEntity(data) {
  return {
    type: SAVE_ENTITY,
    data,
  };
}

export function newEntity(data) {
  return {
    type: NEW_ENTITY,
    data,
  };
}

export function updateConnections(data) {
  return {
    type: UPDATE_CONNECTIONS,
    data,
  };
}

export function updateEntities(data) {
  return {
    type: UPDATE_ENTITIES,
    data,
  };
}

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthenticationState(newAuthState) {
  return {
    type: SET_AUTHENTICATION_STATE,
    newAuthState,
  };
}

export function entitiesRequested(path, time) {
  return {
    type: ENTITIES_REQUESTED,
    path,
    time,
  };
}

export function entitiesReady(path, time) {
  return {
    type: ENTITIES_READY,
    path,
    time,
  };
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function authenticateSending(sending) {
  return {
    type: AUTHENTICATE_SENDING,
    sending,
  };
}

/**
 * Try logging in user
 *
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.email The email of the user to log in
 * @param  {string} data.password The password of the user to log in
 *
 * @return {object} An action object with a type of AUTHENTICATE
 */
export function authenticate(data) {
  return {
    type: AUTHENTICATE,
    data,
  };
}

export function resetPassword(data) {
  return {
    type: RESET_PASSWORD,
    data,
  };
}
export function recoverPassword(data) {
  return {
    type: RECOVER_PASSWORD,
    data,
  };
}

/**
 * Dispatched when authentication successful
 *
 * @param  {array} user The user data
 *
 * @return {object}      An action object with a type of AUTHENTICATE_SUCCESS passing the user
 */
export function authenticateSuccess(user) {
  return {
    type: AUTHENTICATE_SUCCESS,
    user,
  };
}

/**
 * Dispatched when authentication fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of AUTHENTICATE_ERROR passing the error
 */
export function authenticateError(error) {
  return {
    type: AUTHENTICATE_ERROR,
    error,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function validateToken() {
  return {
    type: VALIDATE_TOKEN,
  };
}

export function invalidateEntities(path) {
  return {
    type: INVALIDATE_ENTITIES,
    path,
  };
}

export function updateRouteQuery(query, extend) {
  return {
    type: UPDATE_ROUTE_QUERY,
    query,
    extend,
  };
}

export function updatePath(path) {
  return {
    type: UPDATE_PATH,
    path,
  };
}

export function forwardOnAuthenticationChange() {
  return {
    type: AUTHENTICATE_FORWARD,
  };
}

export function updateEntityForm(data) {
  return {
    type: UPDATE_ENTITY_FORM,
    data,
  };
}

export function dueDateAssigned(id) {
  return {
    type: DUEDATE_ASSIGNED,
    id,
  };
}

export function dueDateUnassigned(id) {
  return {
    type: DUEDATE_UNASSIGNED,
    id,
  };
}
