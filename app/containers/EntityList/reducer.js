/*
*
* EntityListFilters reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  SHOW_FILTER_FORM,
  HIDE_FILTER_FORM,
  SHOW_EDIT_FORM,
  HIDE_EDIT_FORM,
  SHOW_PANEL,
  FILTERS_PANEL,
  RESET_STATE,
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

function entityListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_PANEL:
      return state
        .set('activePanel', action.activePanel)
        .set('activeFilterOption', null)
        .set('activeEditOption', null);
    case SHOW_FILTER_FORM:
      return state.set('activeFilterOption', action.option);
    case HIDE_FILTER_FORM:
      return state.set('activeFilterOption', null);
    case SHOW_EDIT_FORM:
      return state.set('activeEditOption', action.option);
    case HIDE_EDIT_FORM:
      return state.set('activeEditOption', null);
    case LOCATION_CHANGE:
      return action.payload.action === 'PUSH' ? initialState : state;
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

const filterFormInitial = fromJS({
  values: [],
});
const editFormInitial = fromJS({
  values: [],
});
const listingsFormInitial = fromJS({
  entities: {},
});

export default combineReducers({
  page: entityListReducer,
  forms: combineForms({
    filterData: filterFormInitial,
    editData: editFormInitial,
    listingsData: listingsFormInitial,
  }, 'entityList.forms'),
});

// export default entityListFilterReducer;
