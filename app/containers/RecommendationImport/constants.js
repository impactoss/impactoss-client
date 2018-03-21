/*
 *
 * RecommendationImport constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/RecommendationImport/SAVE';
export const RESET_FORM = 'impactoss/RecommendationImport/RESET_FORM';
export const FORM_INITIAL = fromJS({
  import: null,
});
