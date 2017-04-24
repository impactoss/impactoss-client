/*
*
* IndicatorEdit reducer
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

function indicatorEditReducer(state = initialState, action) {
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

const formData = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    manager_id: '',
    frequency_months: '',
    start_date: '',
    repeat: '',
    end_date: '',
  },
  associatedActions: [],
  associatedUser: [],
});

export default combineReducers({
  page: indicatorEditReducer,
  form: combineForms({
    data: formData,
  }, 'indicatorEdit.form'),
});
