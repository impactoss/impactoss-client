/*
 *
 * CategoryEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/CategoryEdit/SAVE';

export const DEPENDENCIES = [
  'measures',
  'recommendations',
  'users',
  'user_roles',
  'categories',
  'taxonomies',
  'measure_categories',
  'recommendation_categories',
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
    parent_id: '',
    reference: '',
    user_only: false,
    draft: true,
  },
  associatedMeasures: [],
  associatedRecommendations: [],
  associatedUser: [],
  associatedCategory: [],
});
