import { fromJS } from 'immutable';
import { SAVE_SENDING, SAVE_ERROR, SAVE_SUCCESS } from './constants';

const initialState = fromJS({
  saveSending: false,
  saveError: false,
  saveSuccess: false,
});

function userMfaReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_SENDING:
      return state.set('saveSending', true).set('saveError', false).set('saveSuccess', false);
    case SAVE_ERROR:
      return state.set('saveSending', false).set('saveError', action.error).set('saveSuccess', false);
    case SAVE_SUCCESS:
      return state.set('saveSending', false).set('saveError', false).set('saveSuccess', true);
    default:
      return state;
  }
}

export default userMfaReducer;
