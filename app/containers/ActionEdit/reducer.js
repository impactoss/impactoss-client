/*
*
* ActionEdit reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  ADD_ACTION_ID,
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
} from './constants';

const initialState = fromJS({
  id: '',
  saveSending: false,
  saveSuccess: false,
  saveError: false,
});

function actionEditReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACTION_ID:
      return state.set('id', action.id);
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

const actionForm = fromJS({
  title: '',
  description: '',
  draft: '',
});

export default combineReducers({
  page: actionEditReducer,
  form: combineForms({
    action: actionForm,
  }, 'actionEdit.form'),
});
