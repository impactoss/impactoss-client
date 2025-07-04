/*
 *
 * RecommendationImport constants
 *
 */

import { API } from 'themes/config';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.ACTIONS,
  API.CATEGORIES,
  API.INDICATORS,
  API.RECOMMENDATIONS,
];

export const SAVE = 'impactoss/RecommendationImport/SAVE';
export const FORM_INITIAL = {
  import: null,
};
