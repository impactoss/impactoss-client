/*
 *
 * UserPasswordReset reducer
 *
 */

import { fromJS } from 'immutable';
import { checkErrorMessagesExist } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

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
        .set('resetError', checkErrorMessagesExist(action.error.response));
    default:
      return state;
  }
}


const formData = fromJS({
  password: '',
  passwordConfirmation: '',
});

export default combineReducers({
  page: userResetReducer,
  form: combineForms({
    data: formData,
  }, 'userPasswordReset.form'),
});
