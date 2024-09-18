/*
 *
 * IndicatorImport constants
 *
 */
import { fromJS } from 'immutable';

import { API } from 'themes/config';

export const SAVE = 'impactoss/IndicatorImport/SAVE';
export const RESET_FORM = 'impactoss/IndicatorImport/RESET_FORM';

export const DEPENDENCIES = [
  API.ACTIONS,
  API.INDICATORS,
  API.FRAMEWORKS,
  // API.CATEGORIES
];

export const FORM_INITIAL = fromJS({
  import: null,
});
