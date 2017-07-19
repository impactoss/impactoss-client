/*
 *
 * UserEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/UserEdit/SAVE';

export const DEPENDENCIES = [
  'users',
  'roles',
  'user_roles',
  'taxonomies',
  'categories',
  'user_categories',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    email: '',
    name: '',
  },
});
