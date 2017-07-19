/*
 *
 * RecommendationImport constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/RecommendationImport/SAVE';
export const RESET_FORM = 'nmrf/RecommendationImport/RESET_FORM';
export const FORM_INITIAL = fromJS({
  import: null,
});
