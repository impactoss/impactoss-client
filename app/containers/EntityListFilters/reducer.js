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
  optionsPath: [],
  title: null,
});

const formData = fromJS({
  filterId: null,
  values: [],
});

function entityListFilterReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_FILTER_FORM:
      return state.set('formTitle', action.title)
        .set('optionsPath', fromJS(action.optionsPath));
    case HIDE_FILTER_FORM:
      return initialState;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListFilterReducer,
  form: combineForms({
    data: formData,
  }, 'entityListFilters.form'),
});

// export default entityListFilterReducer;
