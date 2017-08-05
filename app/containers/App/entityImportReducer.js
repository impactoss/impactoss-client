import { fromJS } from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
} from 'containers/App/constants';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
  deleteSending: false,
  deleteSuccess: false,
  deleteError: false,
});

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
