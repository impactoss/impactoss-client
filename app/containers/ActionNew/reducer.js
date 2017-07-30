/*
 *
 * ActionNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityFormReducer } from 'components/forms/EntityForm/reducers';
import { UPDATE_ENTITY_FORM } from 'containers/App/constants';

const formInitial = fromJS({
  attributes: {
    title: '',
    description: '',
    draft: true,
    target_date: '',
    target_date_comment: '',
    outcome: '',
    indicator_summary: '',
  },
  associatedTaxonomies: {},
  associatedRecommendations: [],
  associatedIndicators: [],
  associatedSdgTargets: [],
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case UPDATE_ENTITY_FORM:
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityFormReducer,
  form: combineForms({
    data: formReducer,
  }, 'measureNew.form'),
});
