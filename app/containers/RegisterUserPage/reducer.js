/*
 *
 * RegisterUserPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
  CHANGE_PASSWORD_CONFIRMATION,
  CHANGE_NAME,
  REGISTER_USER_SENDING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from './constants';

const initialState = fromJS({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  register: {
    sending: false,
    error: false,
    messages: [],
    success: false,
  },
});

function registerUserPageReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return state.set('name', action.name);
    case CHANGE_EMAIL:
      return state.set('email', action.email);
    case CHANGE_PASSWORD:
      return state.set('password', action.password);
    case CHANGE_PASSWORD_CONFIRMATION:
      return state.set('passwordConfirmation', action.passwordConfirmation);
    case REGISTER_USER_ERROR:
      // TODO need to do some checking here as the errors may not exist
      return state.setIn(['register', 'messages'], action.error.response.errors.full_messages).setIn(['register', 'error'], true);
    case REGISTER_USER_SUCCESS:
      return initialState.setIn(['register', 'success'], true); // this is a better idea to empty the store once registration is successful
    case REGISTER_USER_SENDING:
      return state.setIn(['register', 'sending'], true).setIn(['register', 'error'], false);
    default:
      return state;
  }
}

export default registerUserPageReducer;
