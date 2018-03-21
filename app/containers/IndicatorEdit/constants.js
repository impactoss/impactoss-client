/*
 *
 * IndicatorEdit constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES, ENABLE_SDGS } from 'themes/config';

export const SAVE = 'impactoss/IndicatorEdit/SAVE';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'measures',
  'sdgtargets',
  'users',
  'indicators',
  'measure_indicators',
  'sdgtarget_indicators',
  'measure_categories',
  'sdgtarget_categories',
  'taxonomies',
  'categories',
]
: [
  'user_roles',
  'measures',
  'users',
  'indicators',
  'measure_indicators',
  'measure_categories',
  'taxonomies',
  'categories',
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
  associatedSdgTargets: [],
  associatedMeasures: [],
  associatedUser: [],
});
