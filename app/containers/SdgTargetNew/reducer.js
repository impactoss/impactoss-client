/*
 *
 * SdgTargetNew reducer
 *
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

import { entitySaveReducer } from 'components/forms/EntityForm/utils';
import { LOCATION_CHANGE } from 'react-router-redux';
import { UPDATE_ENTITY_FORM } from 'containers/App/constants';

const formInitial = fromJS({
  attributes: {
    title: '',
    description: '',
    draft: true,
    reference: '',
  },
  associatedTaxonomies: {},
  associatedIndicators: [],
  associatedMeasures: [],
});

function formReducer(state = formInitial, action) {
  switch (action.type) {
    case UPDATE_ENTITY_FORM:
      return action.data;
    case LOCATION_CHANGE:
      return formInitial;
    default:
      return state;
  }
}

export default combineReducers({
  page: entitySaveReducer,
  form: combineForms({
    data: formReducer,
  }, 'sdgtargetNew.form'),
});
