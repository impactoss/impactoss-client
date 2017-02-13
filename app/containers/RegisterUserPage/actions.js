/*
 *
 * RegisterUserPage actions
 *
 */

import {
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
  CHANGE_VERIFY,
  SUBMIT_FORM,
} from './constants';

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

export function changeVerify(verify) {
  return {
    type: CHANGE_VERIFY,
    verify,
  };
}

export function submitForm() {
  return {
    type: SUBMIT_FORM,
  };
}
