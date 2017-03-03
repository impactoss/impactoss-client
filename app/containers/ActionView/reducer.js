/*
 *
 * ActionView reducer
 *
 */

import { fromJS } from 'immutable';

import {
  SET_ACTION_ID,
  ACTION_NOT_FOUND,
} from './constants';

const initialState = fromJS({
  id: '',
  actionNotFound: false,
});

function actionViewReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTION_ID:
      return state
      .set('id', action.id)
      .set('actionNotFound', false);
    case ACTION_NOT_FOUND:
      return state
      .set('actionNotFound', true);
    default:
      return state;
  }
}

export default actionViewReducer;
