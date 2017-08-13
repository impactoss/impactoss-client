/*
 *
 * UserPassword reducer
 *
 */
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import { checkResponseError } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  PASSWORD_SENDING,
  PASSWORD_SUCCESS,
  PASSWORD_ERROR,
} from './constants';

const initialState = fromJS({
  passwordSending: false,
  passwordSuccess: false,
  passwordError: false,
});

function userPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case PASSWORD_SENDING:
      return state
        .set('passwordSending', true)
        .set('passwordSuccess', false)
        .set('passwordError', false);
    case PASSWORD_SUCCESS:
      return state
        .set('passwordSending', false)
        .set('passwordSuccess', true);
    case PASSWORD_ERROR:
      return state
        .set('passwordSending', false)
        .set('passwordSuccess', false)
        .set('passwordError', checkResponseError(action.error));
    default:
      return state;
  }
}

const formData = fromJS({
  attributes: {
    password: '',
    passwordNew: '',
    passwordConfirmation: '',
  },
});

export default combineReducers({
  page: userPasswordReducer,
  form: combineForms({
    data: formData,
  }, 'userPassword.form'),
});
