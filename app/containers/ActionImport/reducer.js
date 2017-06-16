/*
 *
 * ActionImport reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entitySaveReducer } from 'components/forms/EntityForm/utils';
import { LOCATION_CHANGE } from 'react-router-redux';

const formInitial = fromJS({
  import:null
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return formInitial;
    default:
      return state;
  }
}

export default combineReducers({
  page: entitySaveReducer,
  form: combineForms({
    data: formReducer,
  }, 'actionImport.form'),
});
