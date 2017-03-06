/*
 *
 * RegisterUserPage actions
 *
 */

import {
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
  CHANGE_PASSWORD_CONFIRMATION,
  SUBMIT_FORM,
  CHANGE_NAME,
  REGISTER_USER_SENDING,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from './constants';

export function changeName(name) {
  return {
    type: CHANGE_NAME,
    name,
  };
}

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}

export function changePassword(password) {
  return {
    type: CHANGE_PASSWORD,
    password,
  };
}

export function changePasswordConfirmation(passwordConfirmation) {
  return {
    type: CHANGE_PASSWORD_CONFIRMATION,
    passwordConfirmation,
  };
}

export function submitForm() {
  return {
    type: SUBMIT_FORM,
  };
}

export function registerUserSending(sending) {
  return {
    type: REGISTER_USER_SENDING,
    sending,
  };
}

export function registerUser(data) {
  return {
    type: REGISTER_USER,
    data,
  };
}

export function registerUserSuccess(user) {
  return {
    type: REGISTER_USER_SUCCESS,
    user,
  };
}

export function registerUserError(error) {
  return {
    type: REGISTER_USER_ERROR,
    error,
  };
}
