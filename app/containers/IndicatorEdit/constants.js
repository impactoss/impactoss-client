/*
 *
 * IndicatorEdit constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES } from 'themes/config';

export const SAVE = 'impactoss/IndicatorEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'users',
  'indicators',
  'measure_indicators',
  'measure_categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
  'categories',
  'recommendations',
  'recommendation_indicators',
  'recommendation_categories',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: true,
    manager_id: '',
    frequency_months: REPORT_FREQUENCIES[0] ? REPORT_FREQUENCIES[0].value : '',
    start_date: '',
    repeat: false,
    end_date: '',
    reference: '',
  },
  associatedMeasures: [],
  associatedRecommendationsByFw: {},
  associatedUser: [],
});
