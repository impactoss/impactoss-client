/*
 *
 * ActionImport constants
 *
 */

import { API } from 'themes/config';

export const SAVE = 'impactoss/ActionImport/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.ACTIONS,
  API.CATEGORIES,
  API.INDICATORS,
  API.RECOMMENDATIONS,
];

export const FORM_INITIAL = {
  import: null,
};
