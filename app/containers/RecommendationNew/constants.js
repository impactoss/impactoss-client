/*
 *
 * RecommendationNew constants
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_FRAMEWORK } from 'themes/config';
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
    accepted: true,
    response: '',
    draft: true,
    framework_id: DEFAULT_FRAMEWORK,
  },
  associatedTaxonomies: {},
  associatedMeasures: [],
  associatedIndicators: [],
  associatedRecommendations: [],
});
