/*
 *
 * RecommendationImport constants
 *
 */
import { fromJS } from 'immutable';

import { API } from 'themes/config';
export const SAVE = 'impactoss/RecommendationImport/SAVE';
export const RESET_FORM = 'impactoss/RecommendationImport/RESET_FORM';

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
