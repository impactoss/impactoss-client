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

import {
  AUTHENTICATE_SENDING,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  SET_AUTHENTICATION_STATE,
  LOAD_ENTITIES,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_ERROR,
  LOGOUT_SUCCESS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  server: {
    loading: false,
    error: false,
  },
  auth: {
    sending: false,
    error: false,
  },
  entities: {
    actions: false,
    recommendations: false,
    recommendation_actions: false,
  },
  user: {
    attributes: '',
    isSignedIn: false,
  },
});

function appReducer(state = initialState, payload) {
  switch (payload.type) {
    case LOGOUT_SUCCESS:
      return state
          .setIn(['user', 'attributes'], '')
          .setIn(['user', 'isSignedIn'], false);
    case AUTHENTICATE_SUCCESS:
      return state
          .setIn(['user', 'attributes'], payload.user)
          .setIn(['user', 'isSignedIn'], true)
          .setIn(['auth', 'sending'], false);
    case AUTHENTICATE_ERROR:
      return state
          .setIn(['auth', 'sending'], false)
          .setIn(['auth', 'error'], payload.error.message);
    case AUTHENTICATE_SENDING:
      return state
          .setIn(['auth', 'sending'], true)
          .setIn(['auth', 'error'], false);
    case SET_AUTHENTICATION_STATE:
      return state
          .setIn(['user', 'isSignedIn'], payload.newAuthState);
    case LOAD_ENTITIES:
      return state
          .set('loading', true)
          .set('error', false)
          .setIn(['entities', payload.path], false);
    case LOAD_ENTITIES_SUCCESS:
      return state
        .setIn(['entities', payload.path], payload.entities)
        .setIn(['server', 'loading'], false);
    case LOAD_ENTITIES_ERROR:
      return state
        .setIn(['server', 'error'], payload.error)
        .setIn(['server', 'loading'], false);
    default:
      return state;
  }
}

export default appReducer;
