/*
 *
 * PageNew constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/PageNew/SAVE';

export const DEPENDENCIES = ['user_roles'];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    content: '',
    menu_title: '',
    draft: true,
    order: '',
  },
});
