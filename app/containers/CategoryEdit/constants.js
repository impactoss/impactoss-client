/*
 *
 * CategoryEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/CategoryEdit/SAVE';

export const DEPENDENCIES = [
  'users',
  'user_roles',
  'categories',
  'taxonomies',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    short_title: '',
    url: '',
    manager_id: '',
    taxonomy_id: '',
    reference: '',
  },
  associatedUser: [],
});
