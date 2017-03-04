/*
 *
 * ActionView reducer
 *
 */

import { fromJS } from 'immutable';
import { ACTION_ENTITIES_READY } from 'containers/App/constants';

const initialState = fromJS({
  actionsReady: false,
});

function actionViewReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_ENTITIES_READY:
      return state
      .set('actionsReady', true);
    default:
      return state;
  }
}

export default actionViewReducer;
