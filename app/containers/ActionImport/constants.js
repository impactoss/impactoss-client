/*
 *
 * ActionImport constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/ActionImport/SAVE';
export const RESET_FORM = 'impactoss/ActionImport/RESET_FORM';

export const FORM_INITIAL = fromJS({
  import: null,
});
