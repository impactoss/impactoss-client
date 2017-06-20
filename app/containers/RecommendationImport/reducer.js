/*
 *
 * RecommendationImport reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityImportReducer } from 'components/forms/EntityForm/utils';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  RESET_FORM,
} from './constants';

const formInitial = fromJS({
  import: null,
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case RESET_FORM:
    case LOCATION_CHANGE:
      return formInitial;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityImportReducer, // TODO: reset_form should also reset page?
  form: combineForms({
    data: formReducer,
  }, 'recommendationImport.form'),
});
