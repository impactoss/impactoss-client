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
    messages: [],
  },
  entities: {
    actions: false,
    recommendations: false,
    recommendation_actions: false,
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
        .setIn(['auth', 'error'], true);
    }
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
