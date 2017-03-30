/*
*
* EntityListFilters reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

const formData = fromJS({
  filterGroups: {},
});

export default combineReducers({
  form: combineForms({
    data: formData,
  }, 'entityListFilters.form'),
});
