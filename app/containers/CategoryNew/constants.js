/*
 *
 * CategoryNew constants
 *
 */

import { fromJS } from 'immutable';

export const SAVE = 'nmrf/CategoryNew/SAVE';

export const FORM_INITIAL = fromJS({
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


export const DEPENDENCIES = [
  'user_roles',
  'taxonomies',
  'users',
];
