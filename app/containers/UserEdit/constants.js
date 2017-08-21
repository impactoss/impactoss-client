/*
 *
 * UserEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/UserEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'users',
  'roles',
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
