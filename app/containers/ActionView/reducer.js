/*
 *
 * ActionView reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOAD_ACTION,
  ADD_ACTION_ID,
  GET_ENTITIES_LOADING,
  GET_ENTITIES_ERROR,
  GET_ENTITIES_SUCCESS,
  LOAD_ACTION_ERROR,
} from './constants';

const initialState = fromJS({
  id: '',
  action: null,
  getEntitiesError: false,
  getEntitiesLoading: false,
  loadActionError: false,
});

function actionViewReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ENTITIES_LOADING:
      return state
        .set('getEntitiesLoading', true)
        .set('getEntitiesError', false)
        .set('loadActionError', false);
    case GET_ENTITIES_ERROR:
      return state
        .set('getEntitiesLoading', false)
        .set('getEntitiesError', action.error);
    case GET_ENTITIES_SUCCESS:
      return state
        .set('getEntitiesLoading', false)
        .set('getEntitiesError', false);
    case LOAD_ACTION_ERROR:
      return state
        .set('loadActionError', action.error);
    case ADD_ACTION_ID:
      return state.set('id', action.id);
    case LOAD_ACTION:
      return state.set('action', action.action);
    default:
      return state;
  }
}

export default actionViewReducer;
