/*
*
* ReportEdit reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
} from 'containers/App/constants';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
});

function reportEditReducer(state = initialState, action) {
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
    default:
      return state;
  }
}

// tim: I don't know how to pull from the global state to set these now, It doesn't seem to be possible
const formData = fromJS({
  id: '',
  attributes: {
    draft: true,
    title: '',
    description: '',
    document_url: '',
    document_public: true,
  },
});

export default combineReducers({
  page: reportEditReducer,
  form: combineForms({
    data: formData,
  }, 'reportEdit.form'),
});
