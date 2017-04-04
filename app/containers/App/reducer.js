/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import { checkErrorMessagesExist } from 'utils/request';
import { isSignedIn } from 'utils/api-request';
import {
  AUTHENTICATE_SENDING,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  SET_AUTHENTICATION_STATE,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_ERROR,
  LOGOUT_SUCCESS,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  ENTITIES_REQUESTED,
  INVALIDATE_ENTITIES,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  server: {
    error: false,
  },
  auth: {
    sending: false,
    error: false,
    messages: [],
  },
  requested: { // Record the time that entities where requested from the server
    taxonomies: null,
    categories: null,
    roles: null,
    users: null,
    user_categories: null,
    user_roles: null,
    indicators: null,
    measures: null,
    measure_categories: null,
    measure_indicators: null,
    recommendations: null,
    recommendation_measures: null,
    recommendation_categories: null,
  },
  ready: { // Record the time that entities where returned from the server
    taxonomies: null,
    categories: null,
    roles: null,
    users: null,
    user_categories: null,
    user_roles: null,
    indicators: null,
    measures: null,
    measure_categories: null,
    measure_indicators: null,
    recommendations: null,
    recommendation_measures: null,
    recommendation_categories: null,
  },
  entities: {
    taxonomies: {},
    categories: {},
    roles: {},
    users: {},
    user_categories: {},
    user_roles: {},
    indicators: {},
    measures: {},
    measure_categories: {},
    measure_indicators: {},
    recommendations: {},
    recommendation_measures: {},
    recommendation_categories: {},
  },
  user: {
    attributes: null,
    isSignedIn: isSignedIn(),
  },
});

function appReducer(state = initialState, payload) {
  switch (payload.type) {
    case LOGOUT_SUCCESS:
      return state
          .setIn(['user', 'attributes'], null)
          .setIn(['user', 'isSignedIn'], false);
    case AUTHENTICATE_SUCCESS:
      return state
          .setIn(['user', 'attributes'], payload.user)
          .setIn(['user', 'isSignedIn'], true)
          .setIn(['auth', 'sending'], false);
    case AUTHENTICATE_ERROR: {
      const errors = checkErrorMessagesExist(payload.error.response);
      return state
        .setIn(['auth', 'messages'], errors)
        .setIn(['auth', 'error'], true)
        .setIn(['user', 'attributes'], null)
        .setIn(['user', 'isSignedIn'], false);
    }
    case AUTHENTICATE_SENDING:
      return state
          .setIn(['auth', 'sending'], true)
          .setIn(['auth', 'error'], false);
    case SET_AUTHENTICATION_STATE:
      return state
          .setIn(['user', 'isSignedIn'], payload.newAuthState);
    case ADD_ENTITY:
      return state
        .setIn(['entities', payload.path, payload.entity.id], fromJS(payload.entity));
    case UPDATE_ENTITY:
      return state
          .setIn(['entities', payload.path, payload.entity.id, 'attributes'], fromJS(payload.entity.attributes));
    case DELETE_ENTITY:
      return state
          .deleteIn(['entities', payload.path, payload.id]);
    case ENTITIES_REQUESTED:
      return state
          .setIn(['requested', payload.path], payload.time);
    case LOAD_ENTITIES_SUCCESS:
      return state
        .setIn(['entities', payload.path], fromJS(payload.entities))
        .setIn(['ready', payload.path], payload.time);
    case LOAD_ENTITIES_ERROR:
      return state
        .setIn(['server', 'error'], payload.error)
        .setIn(['requested', payload.path], null)
        .setIn(['ready', payload.path], null);
    case INVALIDATE_ENTITIES:
      // reset requested to initial state
      return state
        .set('ready', fromJS(initialState.toJS().ready)) // should trigger new entity load
        .set('requested', fromJS(initialState.toJS().requested)) // should trigger new entity load
        .set('entities', fromJS(initialState.toJS().entities));
    default:
      return state;
  }
}

export default appReducer;
