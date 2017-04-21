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

const formInitial = fromJS({
  values: [],
});
const listingsFormInitial = fromJS({
  entities: {},
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return action.payload.action === 'PUSH' ? formInitial : state;
    default:
      return state;
  }
}

function listingsFormReducer(state = listingsFormInitial, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return action.payload.action === 'PUSH' ? listingsFormInitial : state;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListReducer,
  forms: combineForms({
    filterData: formReducer,
    editData: formReducer,
    listingsData: listingsFormReducer,
  }, 'entityList.forms'),
});

// export default entityListFilterReducer;
