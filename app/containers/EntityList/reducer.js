/*
*
* EntityListFilters reducer
*
*/

import { fromJS, List } from 'immutable';
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
  ENTITY_SELECTED,
  ENTITIES_SELECT,
} from './constants';

const initialState = fromJS({
  activeFilterOption: null,
  activeEditOption: null,
  activePanel: FILTERS_PANEL,
  entitiesSelected: [],
});

function entityListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_PANEL: {
      const updated = state
        .set('activePanel', action.activePanel)
        .set('activeFilterOption', null)
        .set('activeEditOption', null);
      // reset selected if filters panel activated
      return action.activePanel === FILTERS_PANEL
        ? updated.set('entitiesSelected', List())
        : updated;
    }
    case SHOW_FILTER_FORM:
      return state.set('activeFilterOption', action.option);
    case HIDE_FILTER_FORM:
      return state.set('activeFilterOption', null);
    case SHOW_EDIT_FORM:
      return state.set('activeEditOption', action.option);
    case HIDE_EDIT_FORM:
      return state.set('activeEditOption', null);
    case RESET_STATE:
      return initialState;
    case ENTITY_SELECTED: {
      const selected = state.get('entitiesSelected');
      return state
        .set('entitiesSelected', action.data.checked
          ? selected.push(action.data.id)
          : selected.filterNot((id) => id === action.data.id))
        .set('activePanel', EDIT_PANEL)
        .set('activeFilterOption', null)
        .set('activeEditOption', null);
    }
    case ENTITIES_SELECT: {
      return state
        .set('entitiesSelected', fromJS(action.ids))
        .set('activePanel', EDIT_PANEL)
        .set('activeFilterOption', null)
        .set('activeEditOption', null);
    }
    default:
      return state;
  }
}

const formInitial = fromJS({
  values: [],
});

function filterFormReducer(state = formInitial, action) {
  switch (action.type) {
    case ENTITY_SELECTED:
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

export default combineReducers({
  page: entityListReducer,
  forms: combineForms({
    filterData: filterFormReducer,
    editData: editFormReducer,
  }, 'entityList.forms'),
});
