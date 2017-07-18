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
  UPDATE_ENTITIES,
  UPDATE_CONNECTIONS,
  REMOVE_ENTITY,
  ENTITIES_REQUESTED,
  INVALIDATE_ENTITIES,
  DUEDATE_ASSIGNED,
  DUEDATE_UNASSIGNED,
  DB_TABLES,
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
    case DUEDATE_UNASSIGNED:
      // reset due_date to get updated virtual fields: due, overdue, and has_progress_reports
      // while the overdue and has_progress_reports fields would be trivial to set client-side, the due field
      // is dependent on the server configuration (look-ahead-period) that is best not stored also on the client
      // TODO instead of reloading all due dates we could alternatively only request a new version of the due_date in question
      return state
        .setIn(['ready', 'due_dates'], null) // should trigger new entity load
        .setIn(['requested', 'due_dates'], null)
        .setIn(['entities', 'due_dates'], fromJS({}));
    default:
      return state;
  }
}

export default appReducer;
