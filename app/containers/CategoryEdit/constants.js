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
  'framework_taxonomies',
  'measure_categories',
  'recommendation_categories',
  'frameworks',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    short_title: '',
    url: '',
    manager_id: null,
    taxonomy_id: null,
    parent_id: null,
    reference: '',
    user_only: false,
    draft: true,
    date: '',
  },
  associatedMeasures: [],
  associatedRecommendationsByFw: {},
  associatedUser: [],
  associatedCategory: [],
});
