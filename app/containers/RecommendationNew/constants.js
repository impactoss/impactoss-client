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
  // 'measures',
  // 'measure_categories',
  // 'indicators',
  'frameworks',
  'recommendations',
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    reference: '',
    support_level: 'null',
    response: '',
    draft: true,
    framework_id: '',
  },
  associatedTaxonomies: {},
  associatedMeasures: [],
  associatedIndicators: [],
  associatedRecommendations: [],
});
