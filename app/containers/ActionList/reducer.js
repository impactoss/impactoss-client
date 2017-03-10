/*
 *
 * ActionList reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_SORT,
} from './constants';

const initialState = fromJS({
  sort: 'id',
  order: 'desc',
  perPage: 5,
  currentPage: 1,
});

function actionListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SORT:
      return state
        .set('sort', action.sort)
        .set('order', action.order);
    default:
      return state;
  }
}

export default actionListReducer;
