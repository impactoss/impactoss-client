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
  UPDATE_ENTITIES,
  UPDATE_CONNECTIONS,
  REMOVE_ENTITY,
  NEW_ENTITY,
  DELETE_ENTITY,
  SAVE_ENTITY,
  INVALIDATE_ENTITIES,
  SAVE_SENDING,
  SAVE_SUCCESS,
  SAVE_ERROR,
  SAVE_ERROR_DISMISS,
  DELETE_SENDING,
  DELETE_SUCCESS,
  DELETE_ERROR,
  SAVE_CONNECTIONS,
  SAVE_ENTITIES,
  UPDATE_ROUTE_QUERY,
  UPDATE_PATH,
  AUTHENTICATE_FORWARD,
  UPDATE_ENTITY_FORM,
  DUEDATE_ASSIGNED,
  DUEDATE_UNASSIGNED,
  RESET_PASSWORD,
  RECOVER_PASSWORD,
  RECOVER_SENDING,
  RECOVER_SUCCESS,
  RECOVER_ERROR,
  CLOSE_ENTITY,
  OPEN_NEW_ENTITY_MODAL,
  RESET_PROGRESS,
  SUBMIT_INVALID,
  DISMISS_QUERY_MESSAGES,
} from './constants';

export function submitInvalid(valid) {
  return {
    type: SUBMIT_INVALID,
    valid,
  };
}

export function resetProgress() {
  return {
    type: RESET_PROGRESS,
  };
}

export function saveSending(data) {
  return {
    type: SAVE_SENDING,
    data,
  };
}

export function saveSuccess(data) {
  return {
    type: SAVE_SUCCESS,
    data,
  };
}

export function saveErrorDismiss() {
  return {
    type: SAVE_ERROR_DISMISS,
  };
}

export function saveError(error, data) {
  return {
    type: SAVE_ERROR,
    data,
    error,
  };
}

export function recoverSending(data) {
  return {
    type: RECOVER_SENDING,
    data,
  };
}

export function recoverSuccess(data) {
  return {
    type: RECOVER_SUCCESS,
    data,
  };
}

export function recoverError(error, data) {
  return {
    type: RECOVER_ERROR,
    data,
    error,
  };
}

export function deleteSending(data) {
  return {
    type: DELETE_SENDING,
    data,
  };
}

export function deleteSuccess(data) {
  return {
    type: DELETE_SUCCESS,
    data,
  };
}

export function deleteError(error, data) {
  return {
    type: DELETE_ERROR,
    data,
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


// server side
export function deleteEntity(data) {
  return {
    type: DELETE_ENTITY,
    data,
  };
}

// server side
export function saveEntity(data) {
  return {
    type: SAVE_ENTITY,
    data,
  };
}

// server side
export function newEntity(data) {
  return {
    type: NEW_ENTITY,
    data,
  };
}

// server side
export function saveConnections(data) {
  return {
    type: SAVE_CONNECTIONS,
    data,
  };
}

// server side
export function saveEntities(data) {
  return {
    type: SAVE_ENTITIES,
    data,
  };
}

// client side
export function addEntity(path, entity) {
  return {
    type: ADD_ENTITY,
    path,
    entity,
  };
}

// client side
export function updateEntity(path, entity) {
  return {
    type: UPDATE_ENTITY,
    path,
    entity,
  };
}

// client side
export function updateEntities(path, entities) {
  return {
    type: UPDATE_ENTITIES,
    path,
    entities,
  };
}

// client side
export function updateConnections(path, updates) {
  return {
    type: UPDATE_CONNECTIONS,
    path,
    updates,
  };
}

// client side
export function removeEntity(path, id) {
  return {
    type: REMOVE_ENTITY,
    path,
    id,
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

export function updatePath(path, args) {
  return {
    type: UPDATE_PATH,
    path,
    args, // { keepQuery: false, query: { arg: key, value }, extend: true }
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

export function closeEntity(path) {
  return {
    type: CLOSE_ENTITY,
    path,
  };
}

export function openNewEntityModal(args) {
  return {
    type: OPEN_NEW_ENTITY_MODAL,
    args,
  };
}

export function dismissQueryMessages() {
  return {
    type: DISMISS_QUERY_MESSAGES,
  };
}
