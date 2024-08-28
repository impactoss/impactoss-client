/*
 *
 * UserPasswordReset reducer
 *
 */

import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { checkResponseError } from 'utils/request';

import { combineReducers } from 'redux-immutable';

import {
  RESET_PASSWORD_SENDING,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from './constants';

const initialState = fromJS({
  resetSending: false,
  resetSuccess: false,
  resetError: false,
});

function userResetReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case RESET_PASSWORD_SENDING:
      return state
        .set('resetSending', true)
        .set('resetSuccess', false)
        .set('resetError', false);
    case RESET_PASSWORD_SUCCESS:
      return state
        .set('resetSending', false)
        .set('resetSuccess', true);
    case RESET_PASSWORD_ERROR:
      return state
        .set('resetSending', false)
        .set('resetSuccess', false)
        .set('resetError', checkResponseError(action.error));
    default:
      return state;
  }
}

export default combineReducers({
  page: userResetReducer,
});
