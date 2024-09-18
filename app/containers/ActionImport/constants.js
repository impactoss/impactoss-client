/*
 *
 * ActionImport constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';

export const SAVE = 'impactoss/ActionImport/SAVE';
export const RESET_FORM = 'impactoss/ActionImport/RESET_FORM';

export const DEPENDENCIES = [
  API.ACTIONS,
  API.INDICATORS,
  API.RECOMMENDATIONS,
  API.CATEGORIES,
  API.TAXONOMIES,
  API.FRAMEWORKS,
];

export const FORM_INITIAL = fromJS({
  import: null,
});
