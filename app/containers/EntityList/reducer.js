/*
*
* EntityListFilters reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';
import {
  SHOW_FILTER_FORM,
  HIDE_FILTER_FORM,
} from './constants';

const initialState = fromJS({
  activeFilterOption: null,
  // {
  //   group: 'taxonomies',
  //   optionId: 'taxonomies-6',
  // },
});

const formData = fromJS({
  filterId: null,
  values: [],
});

function entityListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_FILTER_FORM:
      return state
        .set('formTitle', action.title)
        .set('activeFilterOption', action.activeFilterOption);
        // {
        //   group: '',
        //   optionId: ''
        // }
    case HIDE_FILTER_FORM:
      return initialState;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListReducer,
  form: combineForms({
    data: formData,
  }, 'entityList.form'),
});

// export default entityListFilterReducer;
