/*
 *
 * IndicatorNew constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES, ENABLE_SDGS } from 'themes/config';

export const SAVE = 'impactoss/IndicatorNew/SAVE';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'measures',
  'users',
  'sdgtargets',
  'measure_categories',
  'sdgtarget_categories',
  'categories',
  'taxonomies',
]
: [
  'user_roles',
  'measures',
  'users',
  'measure_categories',
  'categories',
  'taxonomies',
];

export const FORM_INITIAL = fromJS({
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
