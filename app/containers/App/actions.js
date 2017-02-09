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
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
  SET_AUTHENTICATION_STATE,
  LOAD_ENTITIES_IF_NEEDED,
  LOAD_ENTITIES,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_ERROR,
} from './constants';

/**
 * Load the entities, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadEntitiesIfNeeded(path) {
  return {
    type: LOAD_ENTITIES_IF_NEEDED,
    path: path,
  };
}
/**
 * Load the entities, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadEntities(path) {
  return {
    type: LOAD_ENTITIES,
    path:path,
  };
}

/**
 * Dispatched when the entities are loaded by the request saga
 *
 * @param  {array} entities The entities data
 *
 * @return {object}      An action object with a type of LOAD_ENTITIES_SUCCESS passing the entities
 */
export function entitiesLoaded(entities,path) {  
  return {
    type: LOAD_ENTITIES_SUCCESS,
    entities: entities,
    path: path,
  };
}

/**
 * Dispatched when loading the entities fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_ENTITIES_ERROR passing the error
 */
export function entitiesLoadingError(error) {
  return {
    type: LOAD_ENTITIES_ERROR,
    error,
  };
}


/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthenticationState (newAuthState) {
  return {
    type: SET_AUTHENTICATION_STATE,
    newAuthState
  }
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function authenticateSending (sending) {
  return {
    type: AUTHENTICATE_SENDING, 
    sending
  }
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
    data
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

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email
  };
}

export function changePassword(password) {
  return {
    type: CHANGE_PASSWORD,
    password
  };
}