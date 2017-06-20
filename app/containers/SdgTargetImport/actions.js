/*
 *
 * SdgTargetImport actions
 *
 */

import {
  SAVE,
  RESET_FORM,
} from './constants';

export function save(data) {
  return {
    type: SAVE,
    data,
  };
}

export function resetForm() {
  return {
    type: RESET_FORM,
  };
}
