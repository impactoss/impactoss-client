/*
 *
 * UserRegister actions
 *
 */

import {
  REGISTER,
  REGISTER_USER_SENDING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from './constants';

export function register(data) {
  return {
    type: REGISTER,
    data,
  };
}

export function userRegisterSending() {
  return {
    type: REGISTER_USER_SENDING,
  };
}

export function userRegisterSuccess() {
  return {
    type: REGISTER_USER_SUCCESS,
  };
}

export function userRegisterError(error) {
  return {
    type: REGISTER_USER_ERROR,
    error,
  };
}
