/*
*
* ActionEdit reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import {
  SET_ACTION_ID,
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  ACTION_NOT_FOUND,
} from './constants';

const initialState = fromJS({
  id: null,
  saveSending: false,
  saveSuccess: false,
  saveError: false,
  actionNotFound: false,
});

function actionEditReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTION_ID:
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
    case ACTION_NOT_FOUND:
      return state
      .set('actionNotFound', true);
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
