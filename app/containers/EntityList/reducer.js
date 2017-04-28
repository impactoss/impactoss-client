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
  EDIT_PANEL,
  RESET_STATE,
  SELECTION_FORM_MODEL,
} from './constants';

const initialState = fromJS({
  activeFilterOption: null,
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
    case SHOW_EDIT_FORM:
      return state.set('activeEditOption', action.option);
    case HIDE_FILTER_FORM:
    case HIDE_EDIT_FORM:
    case RESET_STATE:
      return initialState;
    case 'rrf/change':
      // if selection changes
      return action.model.substr(0, SELECTION_FORM_MODEL.length) === SELECTION_FORM_MODEL
        ? state
          .set('activePanel', EDIT_PANEL)
          .set('activeFilterOption', null)
          .set('activeEditOption', null)
        : state;
    default:
      return state;
  }
}

const formInitial = fromJS({
  values: [],
});
const selectionFormInitial = fromJS({
  entities: {},
});

function filterFormReducer(state = formInitial, action) {
  switch (action.type) {
    case 'rrf/change':
      return action.model.substr(0, SELECTION_FORM_MODEL.length) === SELECTION_FORM_MODEL
        ? formInitial
        : state;
    case RESET_STATE:
      return formInitial;
    default:
      return state;
  }
}
function editFormReducer(state = formInitial, action) {
  switch (action.type) {
    case RESET_STATE:
      return formInitial;
    default:
      return state;
  }
}

function selectionFormReducer(state = selectionFormInitial, action) {
  switch (action.type) {
    case SHOW_PANEL:
      return action.activePanel === FILTERS_PANEL ? selectionFormInitial : state;
    case RESET_STATE:
      return selectionFormInitial;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListReducer,
  forms: combineForms({
    filterData: filterFormReducer,
    editData: editFormReducer,
    selectionData: selectionFormReducer,
  }, 'entityList.forms'),
});

// export default entityListFilterReducer;
