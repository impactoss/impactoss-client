/*
 *
 * ActionEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/ActionEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'users',
  'categories',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'indicators',
  'measure_indicators',
  'sdgtargets',
  'sdgtarget_measures',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    target_date: '',
    target_date_comment: '',
    outcome: '',
    indicator_summary: '',
  },
  associatedTaxonomies: {},
  associatedRecommendations: [],
  associatedIndicators: [],
  associatedSdgTargets: [],
});
