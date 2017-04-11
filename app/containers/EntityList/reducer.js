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
  SHOW_EDIT_FORM,
  HIDE_EDIT_FORM,
  SHOW_PANEL,
  FILTERS_PANEL,
} from './constants';

const initialState = fromJS({
  activeFilterOption: null,
  // {
  //   group: 'taxonomies',
  //   optionId: '6',
  // },
  activeEditOption: null,
  activePanel: FILTERS_PANEL,
});

const filterFormData = fromJS({
  values: [],
});

const editFormData = fromJS({
  values: [],
});

const listingsFormData = fromJS({
  entities: {},
});

function entityListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_PANEL:
      return state.set('activePanel', action.activePanel);
    case SHOW_FILTER_FORM:
      return state.set('activeFilterOption', action.option);
    case HIDE_FILTER_FORM:
      return state.set('activeFilterOption', fromJS(initialState.toJS().activeFilterOption));
    case SHOW_EDIT_FORM:
      return state.set('activeEditOption', action.option);
    case HIDE_EDIT_FORM:
      return state.set('activeEditOption', fromJS(initialState.toJS().activeEditOption));
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListReducer,
  filterForm: combineForms({
    data: filterFormData,
  }, 'entityList.filterForm'),
  editForm: combineForms({
    data: editFormData,
  }, 'entityList.editForm'),
  listingsForm: combineForms({
    data: listingsFormData,
  }, 'entityList.listingsForm'),
});

// export default entityListFilterReducer;
