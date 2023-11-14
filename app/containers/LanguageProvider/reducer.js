/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_LOCALE,
} from 'themes/config'; // eslint-disable-line
import {
  CHANGE_LOCALE,
} from './constants';

const initialState = fromJS({
  locale: DEFAULT_LOCALE,
});

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state
        .set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
