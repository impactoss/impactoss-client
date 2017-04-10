/*
 *
 * ReportNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  SAVE_SENDING,
  SAVE_SUCCESS,
  SAVE_ERROR,
} from 'containers/App/constants';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
});

function reportNewReducer(state = initialState, action) {
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
        .set('saveError', action.error);
    default:
      return state;
  }
}

const formData = fromJS({
  attributes: {
    draft: true,
    title: '',
    description: '',
    document_url: '',
    document_public: true,
    indicator_id: '',
  },
});

export default combineReducers({
  page: reportNewReducer,
  form: combineForms({
    data: formData,
  }, 'reportNew.form'),
});
