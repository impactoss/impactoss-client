/*
 *
 * IndicatorView constants
 *
 */

import { ENABLE_SDGS } from 'themes/config';

let tables = [];
const baseTables = [
  'user_roles',
  'measures',
  'users',
  'indicators',
  'measure_indicators',
  'progress_reports',
  'due_dates',
  'taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'user_roles',
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
