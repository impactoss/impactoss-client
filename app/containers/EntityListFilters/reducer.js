/*
*
* EntityListFilters reducer
*
*/

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';
import Option from 'components/FilterForm/Option';
import {
  SHOW_FILTER_FORM,
  HIDE_FILTER_FORM,
} from './constants';

const initialState = fromJS({
  showFilterForm: false,
  formOptions: [],
});

const formData = fromJS({
  filterId: null,
  values: [],
});

function entityListFilterReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_FILTER_FORM:
      return state.withMutations((mstate) => {
        const formOptions = fromJS(action.options.map((option) => ({
          value: option,
        })));

        return mstate.set('showFilterForm', true)
        .set('formTitle', action.title)
        .set('formOptions', formOptions.map((option) =>
          option.set('label', Option({
            label: option.getIn(['value', 'label']),
            count: option.getIn(['value', 'count']),
          }))));
      });
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
