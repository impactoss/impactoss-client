/*
 *
 * ActionEdit constants
 *
 */
import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';
export const SAVE = 'impactoss/ActionEdit/SAVE';

let tables = [];
const baseTables = [
  'users',
  'user_roles',
  'measures',
  'categories',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'recommendation_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_measures',
  'sdgtarget_categories',
];
const indicatorTables = [
  'indicators',
  'measure_indicators',
];
tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;
