/*
 *
 * ActionNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';
// import {
//   ACTION_STATUSES,
// } from 'containers/App/constants';
// import {
//   DEFAULT_ACTION,
// } from './constants';

const initialState = fromJS({});

function actionNewReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionForm = fromJS({
  title: '',
  description: '',
  status: '',
});

export default combineReducers({
  page: actionNewReducer,
  form: combineForms({
    action: actionForm,
  }, 'actionNew.form'),
});
