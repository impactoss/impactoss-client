/*
 *
 * ActionView reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOAD_ACTION,
  ADD_ACTION_ID,
} from './constants';

const initialState = fromJS({
  id: '',
  action: null,
});

function actionViewReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACTION_ID:
      return state.set('id', action.id);
    case LOAD_ACTION:
      return state.set('action', action.action);
    default:
      return state;
  }
}

export default actionViewReducer;
