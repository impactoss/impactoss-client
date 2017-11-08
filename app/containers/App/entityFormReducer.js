import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  DELETE_SENDING,
  DELETE_ERROR,
  DELETE_SUCCESS,
  SUBMIT_INVALID,
  SAVE_ERROR_DISMISS,
  LOGOUT_SUCCESS,
} from 'containers/App/constants';

import { checkResponseError } from 'utils/request';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
  deleteSending: false,
  deleteSuccess: false,
  deleteError: false,
  submitValid: true,
});

export const entityFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCCESS:
    case LOCATION_CHANGE:
      return initialState;
    case SAVE_SENDING:
      return state
        .set('saveSending', true)
        .set('saveSuccess', false)
        .set('saveError', false);
    case SAVE_SUCCESS:
      return state
        .set('saveSending', false)
        .set('saveSuccess', true);
    case SAVE_ERROR:
      return state
        .set('saveSending', false)
        .set('saveSuccess', false)
        .set('saveError', checkResponseError(action.error));
    case SAVE_ERROR_DISMISS:
      return state
        .set('saveSending', false)
        .set('saveSuccess', false)
        .set('saveError', false);
    case DELETE_SENDING:
      return state
        .set('deleteSending', true)
        .set('deleteSuccess', false)
        .set('deleteError', false);
    case DELETE_SUCCESS:
      return state
        .set('deleteSending', false)
        .set('deleteSuccess', true);
    case DELETE_ERROR:
      return state
        .set('deleteSending', false)
        .set('deleteSuccess', false)
        .set('deleteError', checkResponseError(action.error));
    case SUBMIT_INVALID:
      return state.set('submitValid', action.valid);
    default:
      return state;
  }
};
