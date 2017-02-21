/*
 *
 * ActionView actions
 *
 */

import {
  GET_ENTITIES_AND_ACTION_BY_ID,
  LOAD_ACTION,
  ADD_ACTION_ID,
  GET_ENTITIES_LOADING,
  GET_ENTITIES_SUCCESS,
  GET_ENTITIES_ERROR,
  LOAD_ACTION_ERROR,
} from './constants';

export function getEntitiesAndActionById(path, id) {
  return {
    type: GET_ENTITIES_AND_ACTION_BY_ID,
    path,
    id,
  };
}

export function addActionId(id) {
  return {
    type: ADD_ACTION_ID,
    id,
  };
}

export function loadAction(action) {
  return {
    type: LOAD_ACTION,
    action,
  };
}

export function getEntitiesLoading() {
  return {
    type: GET_ENTITIES_LOADING,
  };
}

export function getEntitiesSuccess() {
  return {
    type: GET_ENTITIES_SUCCESS,
  };
}

export function getEntitiesError(error) {
  return {
    type: GET_ENTITIES_ERROR,
    error,
  };
}

export function loadActionError(error) {
  return {
    type: LOAD_ACTION_ERROR,
    error,
  };
}
