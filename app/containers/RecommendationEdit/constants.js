/*
 *
 * RecommendationEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/RecommendationEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'recommendations',
  'users',
  'categories',
  'taxonomies',
  'measures',
  'recommendation_measures',
  'recommendation_categories',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    reference: '',
    accepted: '',
    response: '',
    draft: '',
  },
  associatedTaxonomies: {},
  associatedMeasures: [],
});
