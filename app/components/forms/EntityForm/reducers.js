import { fromJS } from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  DELETE_SENDING,
  DELETE_ERROR,
  DELETE_SUCCESS,
} from 'containers/App/constants';

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
        .set('saveError', action.error);
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
        .set('deleteError', action.error);
    default:
      return state;
  }
};

export const entityImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case SAVE_SENDING:
      return state
        .set('saveSending', action);
    case SAVE_SUCCESS:
      return state
        .set('saveSuccess', action);
    case SAVE_ERROR:
      return state
        .set('saveError', action);
    default:
      return state;
  }
};
