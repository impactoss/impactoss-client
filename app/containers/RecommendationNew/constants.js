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
  'framework_taxonomies',
  'measures',
  'measure_categories',
  'indicators',
  'frameworks',
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    reference: '',
    accepted: null,
    response: '',
    draft: true,
    framework_id: '',
  },
  associatedTaxonomies: {},
  associatedMeasures: [],
  associatedIndicators: [],
  associatedRecommendations: [],
});
