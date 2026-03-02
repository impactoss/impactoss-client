/*
 *
 * UserEdit constants
 *
 */
import { fromJS } from 'immutable';
import { API } from 'themes/config';
export const SAVE = 'impactoss/UserEdit/SAVE';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.USERS,
  API.ROLES,
  API.TAXONOMIES,
  API.CATEGORIES,
  API.USER_CATEGORIES,
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    email: '',
    name: '',
  },
});
