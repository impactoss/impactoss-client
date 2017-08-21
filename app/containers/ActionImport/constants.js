/*
 *
 * ActionImport constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/ActionImport/SAVE';
export const RESET_FORM = 'nmrf/ActionImport/RESET_FORM';

export const FORM_INITIAL = fromJS({
  import: null,
});
