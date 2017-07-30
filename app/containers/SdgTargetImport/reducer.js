/*
 *
 * SdgTargetImport reducer
 *
 */

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityImportReducer } from 'components/forms/EntityForm/reducers';
import {
  RESET_FORM,
  FORM_INITIAL,
} from './constants';

function formReducer(state = FORM_INITIAL, action) {
  switch (action.type) {
    case RESET_FORM:
      return FORM_INITIAL;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityImportReducer, // TODO: reset_form should also reset page?
  form: combineForms({
    data: formReducer,
  }, 'sdgtargetImport.form'),
});
