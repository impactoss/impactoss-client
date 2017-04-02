/*
 *
 * UserLogin reducer
 *
 */

import { fromJS } from 'immutable';
// import { checkErrorMessagesExist } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
} from 'containers/App/constants';

const initialState = fromJS({
  loginSuccess: false,
  loginError: false,
});
function userLoginReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      return state
        .set('loginSuccess', true);
    case AUTHENTICATE_ERROR:
      return state
        .set('loginSuccess', false)
        .set('loginError', action.error);
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
