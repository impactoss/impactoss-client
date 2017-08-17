/*
 *
 * IndicatorEdit constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES } from 'containers/App/constants';

export const SAVE = 'nmrf/IndicatorEdit/SAVE';

export const DEPENDENCIES = [
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
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    manager_id: '',
    frequency_months: REPORT_FREQUENCIES[0] ? REPORT_FREQUENCIES[0].value : '',
    start_date: '',
    repeat: '',
    end_date: '',
    reference: '',
  },
  associatedSdgTargets: [],
  associatedMeasures: [],
  associatedUser: [],
});
