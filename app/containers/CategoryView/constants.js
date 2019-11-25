/*
 *
 * CategoryView constants
 *
 */
import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

let tables = [];
const baseTables = [
  'user_roles',
  'categories',
  'users',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'measures',
  'measure_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_indicators',
  'sdgtarget_categories',
];
const indicatorTables = [
  'measure_indicators',
  'indicators',
];

tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;
