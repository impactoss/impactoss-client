/*
 *
 * RecommendationNew constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/RecommendationNew/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'measures',
  'measure_categories',
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    reference: '',
    accepted: true,
    response: '',
    draft: true,
  },
  associatedTaxonomies: {},
  associatedMeasures: [],
});
