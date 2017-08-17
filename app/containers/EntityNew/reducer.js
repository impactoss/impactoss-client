/*
 *
 * CategoryNew reducer
 *
 */

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityFormReducer } from 'containers/App/entityFormReducer';
import { UPDATE_ENTITY_FORM, SAVE_SUCCESS } from 'containers/App/constants';

import { FORM_INITIAL } from './constants';

function formReducer(state = FORM_INITIAL, action) {
  switch (action.type) {
    case UPDATE_ENTITY_FORM:
      return action.data;
    case SAVE_SUCCESS:
      return FORM_INITIAL;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityFormReducer,
  form: combineForms({
    data: formReducer,
  }, 'entityNew.form'),
});
