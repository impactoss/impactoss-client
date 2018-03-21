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

import { checkResponseError } from 'utils/request';
import { isSignedIn } from 'utils/api-request';
import { DB_TABLES } from 'themes/config';

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
  UPDATE_ENTITIES,
  UPDATE_CONNECTIONS,
  REMOVE_ENTITY,
  ENTITIES_REQUESTED,
  INVALIDATE_ENTITIES,
  DUEDATE_ASSIGNED,
  OPEN_NEW_ENTITY_MODAL,
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
  /* eslint-disable no-param-reassign */
  // Record the time that entities where requested from the server
  requested: DB_TABLES.reduce((memo, table) => { memo[table] = null; return memo; }, {}),
  // Record the time that entities where returned from the server
  ready: DB_TABLES.reduce((memo, table) => { memo[table] = null; return memo; }, {}),
  entities: DB_TABLES.reduce((memo, table) => { memo[table] = {}; return memo; }, {}),
  /* eslint-enable no-param-reassign */
  user: {
    attributes: null,
    isSignedIn: isSignedIn(),
  },
  newEntityModal: null,
});

function appReducer(state = initialState, payload) {
  switch (payload.type) {
    case LOGOUT_SUCCESS:
      return initialState.setIn(['user', 'isSignedIn'], false);
    case AUTHENTICATE_SUCCESS:
      return state
          .setIn(['user', 'attributes'], payload.user)
          .setIn(['user', 'isSignedIn'], true)
          .setIn(['auth', 'sending'], false);
    case AUTHENTICATE_ERROR: {
      return state
        .setIn(['auth', 'error'], checkResponseError(payload.error))
        .setIn(['auth', 'sending'], false)
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
    case UPDATE_ENTITIES:
      return payload.entities.reduce((stateUpdated, entity) =>
        stateUpdated.setIn(
          ['entities', payload.path, entity.data.id, 'attributes'],
          fromJS(entity.data.attributes)
        )
      , state);
    case UPDATE_CONNECTIONS:
      return payload.updates.reduce((stateUpdated, connection) =>
        connection.type === 'delete'
        ? stateUpdated.deleteIn(['entities', payload.path, connection.id])
        : stateUpdated.setIn(
          ['entities', payload.path, connection.data.id],
          fromJS(connection.data)
        )
      , state);
    case UPDATE_ENTITY:
      return state
          .setIn(['entities', payload.path, payload.entity.id, 'attributes'], fromJS(payload.entity.attributes));
    case REMOVE_ENTITY:
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
      // check unauthorised (401)
      if (payload.error.response.status === 401) {
        return state
          .setIn(['server', 'error'], payload.error)
          .setIn(['entities', payload.path], fromJS([]))
          .setIn(['ready', payload.path], Date.now());
      }
      return state
        .setIn(['server', 'error'], payload.error)
        .setIn(['ready', payload.path], null);
    case INVALIDATE_ENTITIES:
      // reset requested to initial state
      if (payload.path) {
        // reset a specific entity table
        return state
          .setIn(['ready', payload.path], null) // should trigger new entity load
          .setIn(['requested', payload.path], null)
          .setIn(['entities', payload.path], fromJS({}));
      }
      // reset all entities
      return state
        .set('ready', fromJS(initialState.toJS().ready)) // should trigger new entity load
        .set('requested', fromJS(initialState.toJS().requested)) // should trigger new entity load
        .set('entities', fromJS(initialState.toJS().entities));
    case DUEDATE_ASSIGNED:
      if (payload.id) {
        const date = state.getIn(['entities', 'due_dates', payload.id.toString()]);
        if (date) {
          // check
          return state
            .setIn(['entities', 'due_dates', payload.id.toString(), 'attributes', 'due'], false)
            .setIn(['entities', 'due_dates', payload.id.toString(), 'attributes', 'overdue'], false)
            .setIn(['entities', 'due_dates', payload.id.toString(), 'attributes', 'has_progress_report'], true);
        }
        return state;
      }
      return state;
    case OPEN_NEW_ENTITY_MODAL:
      return state.set('newEntityModal', fromJS(payload.args));
    default:
      return state;
  }
}

export default appReducer;
