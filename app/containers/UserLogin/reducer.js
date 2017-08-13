/*
 *
 * UserLogin reducer
 *
 */

import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { checkResponseError } from 'utils/request';

import {
  AUTHENTICATE_SENDING,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
} from 'containers/App/constants';

const initialState = fromJS({
  authSending: false,
  authSuccess: false,
  authError: false,
});
function userLoginReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case AUTHENTICATE_SENDING:
      return state
        .set('authSending', true)
        .set('authSuccess', false)
        .set('authError', false);
    case AUTHENTICATE_SUCCESS:
      return state
        .set('authSending', false)
        .set('authSuccess', true);
    case AUTHENTICATE_ERROR:
      return state
        .set('authSending', false)
        .set('authSuccess', false)
        .set('authError', checkResponseError(action.error));
    default:
      return state;
  }
}

const formData = fromJS({
  email: '',
  password: '',
});

export default combineReducers({
  page: userLoginReducer,
  form: combineForms({
    data: formData,
  }, 'userLogin.form'),
});
