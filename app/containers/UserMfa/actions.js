/*
 * UserMfa actions
 */

import { ENABLE_MFA, DISABLE_MFA, SAVE_SENDING, SAVE_ERROR, SAVE_SUCCESS } from './constants';

export function enableMfa(data) {
  return {
    type: ENABLE_MFA,
    data,
  };
}

export function disableMfa(data) {
  return {
    type: DISABLE_MFA,
    data,
  };
}

export function saveSending() {
  return {
    type: SAVE_SENDING,
  };
}

export function saveSuccess() {
  return {
    type: SAVE_SUCCESS,
  };
}

export function saveError(error) {
  return {
    type: SAVE_ERROR,
    error,
  };
}
