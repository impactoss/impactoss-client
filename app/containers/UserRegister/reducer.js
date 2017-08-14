/*
 *
 * UserRegister reducer
 *
 */

import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { checkResponseError } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  REGISTER_USER_SENDING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from './constants';

const initialState = fromJS({
  registerSending: false,
  registerSuccess: false,
  registerError: false,
});

function userRegisterReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case REGISTER_USER_SENDING:
      return state
        .set('registerSending', true)
        .set('registerSuccess', false)
        .set('registerError', false);
    case REGISTER_USER_SUCCESS:
      return state
        .set('registerSending', false)
        .set('registerSuccess', true);
    case REGISTER_USER_ERROR:
      return state
        .set('registerSending', false)
        .set('registerSuccess', false)
        .set('registerError', checkResponseError(action.error));
    default:
      return state;
  }
}

const formData = fromJS({
  attributes: {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  },
});

export default combineReducers({
  page: userRegisterReducer,
  form: combineForms({
    data: formData,
  }, 'userRegister.form'),
});
