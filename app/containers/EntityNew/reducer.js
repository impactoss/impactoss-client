/*
 *
 * CategoryNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entityFormReducer } from 'components/forms/EntityForm/reducers';
import { UPDATE_ENTITY_FORM, SAVE_SUCCESS } from 'containers/App/constants';

const formInitial = fromJS({
  attributes: {
    draft: true,
    accepted: true,
    title: '',
    reference: '',
    response: '',
    short_title: '',
    description: '',
    url: '',
    taxonomy_id: '',
    manager_id: '',
    user_only: '',
    target_date: '',
    outcome: '',
    indicator_summary: '',
    target_date_comment: '',
    frequency_months: '',
    repeat: '',
    start_date: '',
    end_date: '',
    indicator_id: '',
    due_date_id: '',
    document_url: '',
    document_public: true,
  },
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case UPDATE_ENTITY_FORM:
      return action.data;
    case SAVE_SUCCESS:
      return formInitial;
    default:
      return state;
  }
}

export default combineReducers({
  page: entityFormReducer,
  form: combineForms({
    data: formReducer,
  }, 'entityNew.form'),
});
