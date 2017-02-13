/*
 *
 * RegisterUserPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  CHANGE_VERIFY,
} from './constants';

const initialState = fromJS({
  email: '',
  password: '',
  verify: '',
});

function registerUserPageReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_EMAIL:
      return state.set('email', action.email);
    case CHANGE_PASSWORD:
      return state.set('password', action.password);
    case CHANGE_VERIFY:
      return state.set('verify', action.verify);
    default:
      return state;
  }
}

export default registerUserPageReducer;
