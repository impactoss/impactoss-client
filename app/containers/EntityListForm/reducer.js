/*
*
* EntityListFilters reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

const formInitial = fromJS({
  values: [],
});

function filterFormReducer(state = formInitial, action) {
  switch (action.type) {
    default:
      return state;
  }
}
function editFormReducer(state = formInitial, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({
  forms: combineForms({
    filterData: filterFormReducer,
    editData: editFormReducer,
  }, 'entityListForm.forms'),
});
