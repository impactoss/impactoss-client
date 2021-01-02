/*
 *
 * ActionEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/ActionEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'users',
  'categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'indicators',
  'measure_indicators',
  'recommendation_categories',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    outcome: '',
    indicator_summary: '',
    target_date: '',
    target_date_comment: '',
  },
  associatedTaxonomies: {},
  associatedRecommendationsByFw: {},
  associatedIndicators: [],
});
