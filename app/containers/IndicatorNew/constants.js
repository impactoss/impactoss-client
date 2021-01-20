/*
 *
 * IndicatorNew constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES } from 'themes/config';

export const SAVE = 'impactoss/IndicatorNew/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'recommendations',
  'users',
  'measure_categories',
  'recommendation_categories',
  'categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    draft: true,
    manager_id: '',
    frequency_months: REPORT_FREQUENCIES[0] ? REPORT_FREQUENCIES[0].value : 1,
    start_date: '',
    repeat: false,
    end_date: '',
    reference: '',
  },
  associatedMeasures: [],
  associatedRecommendationsByFw: {},
  associatedUser: [],
});
