/*
 *
 * IndicatorEdit constants
 *
 */
import { fromJS } from 'immutable';
import { REPORT_FREQUENCIES, ENABLE_SDGS } from 'themes/config';

export const SAVE = 'impactoss/IndicatorEdit/SAVE';

let tables = [];
const baseTables = [
  'user_roles',
  'measures',
  'users',
  'indicators',
  'measure_indicators',
  'measure_categories',
  'taxonomies',
  'categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_indicators',
  'sdgtarget_categories',
];

tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
export const DEPENDENCIES = tables;


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
