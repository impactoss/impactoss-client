/*
 *
 * RecommendationNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  SAVE_SENDING,
  SAVE_SUCCESS,
  SAVE_ERROR,
} from './constants';

const initialState = fromJS({
  saveSending: false,
  saveSuccess: false,
  saveError: false,
});

function recommendationNewReducer(state = initialState, action) {
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

const recommendationForm = fromJS({
  title: '',
  number: '',
  draft: true,
});

export default combineReducers({
  page: recommendationNewReducer,
  form: combineForms({
    recommendation: recommendationForm,
  }, 'recommendationNew.form'),
});
