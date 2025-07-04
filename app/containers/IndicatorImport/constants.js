/*
 *
 * IndicatorImport constants
 *
 */
import { API } from 'themes/config';

export const SAVE = 'impactoss/IndicatorImport/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.ACTIONS,
  API.INDICATORS,
  API.RECOMMENDATIONS,
];

export const FORM_INITIAL = {
  import: null,
};
