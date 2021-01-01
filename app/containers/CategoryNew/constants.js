/*
 *
 * CategoryNew constants
 *
 */

import { fromJS } from 'immutable';

export const SAVE = 'impactoss/CategoryNew/SAVE';

export const DEPENDENCIES = [
  'measures',
  'recommendations',
  'users',
  'user_roles',
  'categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
  'measure_categories',
  'recommendation_categories',
];

export const FORM_INITIAL = fromJS({
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
    date: '',
  },
  associatedMeasures: [],
  associatedRecommendationsByFw: {},
  associatedUser: [],
  associatedCategory: [],
});
