/*
*
* ActionEdit reducer
*
*/
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityFormReducer } from 'containers/App/entityFormReducer';
import { UPDATE_ENTITY_FORM } from 'containers/App/constants';
import { MEASURE_SHAPE } from 'themes/config';
import { getInitialFormData } from 'utils/entities';

function formReducer(s, action) {
  const state = s || getInitialFormData(MEASURE_SHAPE);
  switch (action.type) {
    case UPDATE_ENTITY_FORM:
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityFormReducer,
  form: combineForms({
    data: formReducer,
  }, 'measureEdit.form'),
});
