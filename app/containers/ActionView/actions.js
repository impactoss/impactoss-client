/*
 *
 * ActionView actions
 *
 */

import {
  GET_ACTION_BY_ID,
  SET_ACTION_ID,
  ACTION_NOT_FOUND,
} from './constants';

export function getActionById(id) {
  return {
    type: GET_ACTION_BY_ID,
    id,
  };
}

export function setActionId(id) {
  return {
    type: SET_ACTION_ID,
    id,
  };
}

export function actionNotFound() {
  return {
    type: ACTION_NOT_FOUND,
  };
}
