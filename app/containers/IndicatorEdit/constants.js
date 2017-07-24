/*
 *
 * IndicatorEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/IndicatorEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'sdgtargets',
  'users',
  'indicators',
  'measure_indicators',
  'sdgtarget_indicators',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    manager_id: '',
    frequency_months: 1,
    start_date: '',
    repeat: '',
    end_date: '',
    reference: '',
  },
  associatedSdgTargets: [],
  associatedMeasures: [],
  associatedUser: [],
});
