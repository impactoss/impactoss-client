/*
 *
 * ActionNew constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/ActionNew/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
  'recommendations',
  'indicators',
  'recommendation_categories',
  'measures',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    reference: '',
    title: '',
    description: '',
    draft: true,
    outcome: '',
    indicator_summary: '',
    target_date: '',
    target_date_comment: '',
  },
  associatedTaxonomies: {},
  associatedRecommendationsByFw: {},
  associatedIndicators: [],
});
