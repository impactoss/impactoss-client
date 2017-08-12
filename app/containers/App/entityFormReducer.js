import { fromJS } from 'immutable';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  DELETE_SENDING,
  DELETE_ERROR,
  DELETE_SUCCESS,
} from 'containers/App/constants';

import { checkResponseError } from 'utils/request';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
  deleteSending: false,
  deleteSuccess: false,
  deleteError: false,
});

export const entityFormReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};
