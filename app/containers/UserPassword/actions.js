/*
 *
 * UserPassword actions
 *
 */

import {
  SAVE,
  PASSWORD_SENDING,
  PASSWORD_SUCCESS,
  PASSWORD_ERROR,
} from './constants';

export function save(data) {
  return {
    type: SAVE,
    data,
  };
}

export function passwordSending() {
  return {
    type: PASSWORD_SENDING,
  };
}

export function passwordSuccess() {
  return {
    type: PASSWORD_SUCCESS,
  };
}

export function passwordError(error) {
  return {
    type: PASSWORD_ERROR,
    error,
  };
}
